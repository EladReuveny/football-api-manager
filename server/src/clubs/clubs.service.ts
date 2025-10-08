import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CountriesService } from 'src/countries/countries.service';
import { PlayersService } from 'src/players/players.service';
import { Repository } from 'typeorm';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { Club } from './entities/club.entity';

/**
 * Service for clubs
 */
@Injectable()
export class ClubsService {
  /**
   * Constructor
   * 
   * @param clubsRepository - club repository
   * @param playersService - players service
   * @param countryService - country service
   */
  constructor(
    @InjectRepository(Club) private readonly clubsRepository: Repository<Club>,
    @Inject(forwardRef(() => PlayersService))
    private readonly playersService: PlayersService,
    private readonly countryService: CountriesService,
  ) {}

  /**
   * Create a club
   * @param createClubDto - create club dto
   * @returns created club
   */
  async create(createClubDto: CreateClubDto) {
    await this.validateUniqueness(createClubDto);

    const country = await this.countryService.findOne(createClubDto.countryId);

    const club = this.clubsRepository.create({
      ...createClubDto,
      country,
      establishedAt: createClubDto.establishedAt
        ? createClubDto.establishedAt
        : new Date(),
    });
    return await this.clubsRepository.save(club);
  }

  /**
   * Find all clubs
   * @returns all clubs
   */
  async findAll() {
    return await this.clubsRepository.find();
  }

  /**
   * Find a club by id
   * @param id - club id
   * @returns found club
   * @throws NotFoundException if club not found
   */
  async findOne(id: number) {
    const club = await this.clubsRepository.findOneBy({ id });
    if (!club) {
      throw new NotFoundException(`Club with id ${id} does not exist`);
    }
    return club;
  }

  /**
   * Update a club
   * @param id - club id
   * @param updateClubDto - update club dto
   * @returns updated club
   */
  async update(id: number, updateClubDto: UpdateClubDto) {
    const club = await this.findOne(id);
    await this.validateUniqueness(updateClubDto);
    const updatedClub = this.clubsRepository.merge(club, updateClubDto);
    return await this.clubsRepository.save(updatedClub);
  }

  /**
   * Remove a club
   * @param id - club id
   */
  async remove(id: number) {
    const club = await this.findOne(id);
    await this.clubsRepository.remove(club);
  }

  /**
   * Create many clubs
   * @param createClubDtos - create club dtos
   * @returns created clubs
   */
  async createMany(createClubDtos: CreateClubDto[]) {
    // const clubs = this.clubsRepository.create(createClubDtos);
    // return await this.clubsRepository.save(clubs);
    const clubs = await Promise.all(
      createClubDtos.map((createClubDto) => this.create(createClubDto)),
    );

    return clubs;
  }

  /**
   * Find many clubs by ids
   * @param createCompetitionDtoIds - club ids
   * @returns found clubs
   */
  async findMany(createCompetitionDtoIds: number[]) {
    return await Promise.all(
      createCompetitionDtoIds.map((id) => this.findOne(id)),
    );
  }

  /**
   * Add a player to a club
   * @param clubId - club id
   * @param playerId - player id
   */
  async addPlayerToClub(clubId: number, playerId: number) {
    const club = await this.findOne(clubId);
    const player = await this.playersService.findOne(playerId);
    player.club = club;
    await this.playersService.update(playerId, player);
    return await this.clubsRepository.save(club);
  }

  /**
   * Remove a player from a club
   * @param clubId - club id
   * @param playerId - player id
   */
  async removePlayerFromClub(clubId: number, playerId: number) {
    const club = await this.findOne(clubId);
    const player = await this.playersService.findOne(playerId);
    player.club = undefined;
    await this.playersService.update(playerId, player);
    return await this.clubsRepository.save(club);
  }

  /**
   * Validates uniqueness of club
   * @param dto - create club dto or update club dto
   * @throws ConflictException if club with name already exists
   */
  private async validateUniqueness(dto: CreateClubDto | UpdateClubDto) {
    const { name } = dto;

    const isNameExists = await this.clubsRepository.existsBy({ name });

    if (isNameExists) {
      throw new ConflictException(`Club with name ${name} already exists`);
    }
  }
}
