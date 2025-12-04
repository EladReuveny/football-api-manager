import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';
import { CountriesService } from 'src/countries/countries.service';
import { PlayersService } from 'src/players/players.service';
import { RedisService } from 'src/redis/redis.service';
import { Repository } from 'typeorm';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { Club } from './entities/club.entity';

/**
 * Service for clubs
 */
@Injectable()
export class ClubsService {
  private readonly baseCacheKey = 'clubs';

  /**
   * Constructor
   * @param clubsRepository Club repository
   * @param redisService Redis service
   * @param playersService Players service
   * @param countryService Country service
   */
  constructor(
    @InjectRepository(Club) private readonly clubsRepository: Repository<Club>,
    private readonly redisService: RedisService,
    @Inject(forwardRef(() => PlayersService))
    private readonly playersService: PlayersService,
    private readonly countryService: CountriesService,
  ) {}

  /**
   * Create a club
   * @param createClubDto Create club dto
   * @returns Created club
   */
  async create(createClubDto: CreateClubDto) {
    await this.validateName(createClubDto.name);

    const country = await this.countryService.findOne(createClubDto.countryId);
    const establishedAt = createClubDto.establishedAt || new Date();

    const club = this.clubsRepository.create({
      ...createClubDto,
      country,
      establishedAt,
    });

    await this.redisService.invalidateByPattern(`${this.baseCacheKey}*`);

    return await this.clubsRepository.save(club);
  }

  /**
   * Get all clubs with pagination.
   *
   * @param {PaginationQueryDto} query - The pagination query parameters.
   * @returns The paginated list of clubs.
   */
  async findAll(query: PaginationQueryDto) {
    const { page, limit } = query;

    const cached = await this.redisService.get<PaginationResponseDto<Club>>(
      `${this.baseCacheKey}:page=${page}:limit=${limit}`,
    );
    if (cached) {
      return cached;
    }

    const offset = (page - 1) * limit;

    const [items, total] = await this.clubsRepository.findAndCount({
      relations: ['country', 'players', 'players.nationality', 'competitions'],
      take: limit,
      skip: offset,
    });

    const totalPages = Math.ceil(total / limit);

    const response = {
      items,
      currentPage: page,
      limit,
      totalItems: total,
      totalPages,
    } as PaginationResponseDto<Club>;

    await this.redisService.set(
      `${this.baseCacheKey}:page=${page}:limit=${limit}`,
      response,
    );

    return response;
  }

  /**
   * Find a club by id
   * @param id Club id
   * @returns Found club
   * @throws NotFoundException if club not found
   */
  async findOne(id: number) {
    const cached = await this.redisService.get<Club>(
      `${this.baseCacheKey}:${id}`,
    );
    if (cached) {
      return cached;
    }

    const club = await this.clubsRepository.findOne({
      where: { id },
      relations: ['country', 'players', 'players.nationality', 'competitions'],
    });
    if (!club) {
      throw new NotFoundException(`Club with id ${id} does not exist`);
    }

    await this.redisService.set(`${this.baseCacheKey}:${id}`, club);

    return club;
  }

  /**
   * Update a club
   * @param id Club id
   * @param updateClubDto Update club dto
   * @returns Updated club
   */
  async update(id: number, updateClubDto: UpdateClubDto) {
    const club = await this.findOne(id);

    const isNameChanged = updateClubDto.name !== club.name;
    if (isNameChanged && updateClubDto.name) {
      await this.validateName(updateClubDto.name);
      club.name = updateClubDto.name;
    }

    if (updateClubDto.logoUrl) {
      club.logoUrl = updateClubDto.logoUrl;
    }

    if (updateClubDto.countryId) {
      const country = await this.countryService.findOne(
        updateClubDto.countryId,
      );
      club.country = country;
    }

    await this.redisService.invalidateByPattern(`${this.baseCacheKey}*`);

    return await this.clubsRepository.save(club);
  }

  /**
   * Remove a club
   * @param id Club id
   */
  async remove(id: number) {
    const club = await this.findOne(id);
    await this.clubsRepository.remove(club);
    await this.redisService.invalidateByPattern(`${this.baseCacheKey}*`);
  }

  /**
   * Create many clubs
   * @param createClubDtos Create club dtos
   * @returns Created clubs
   */
  async createBulk(createClubDtos: CreateClubDto[]) {
    const clubs = await Promise.all(
      createClubDtos.map((createClubDto) => this.create(createClubDto)),
    );

    await this.redisService.invalidateByPattern(`${this.baseCacheKey}*`);

    return clubs;
  }

  /**
   * Find many clubs by ids
   * @param createCompetitionDtoIds Club ids
   * @returns Found clubs
   */
  async findMany(createCompetitionDtoIds: number[]) {
    return await Promise.all(
      createCompetitionDtoIds.map((id) => this.findOne(id)),
    );
  }

  /**
   * Add a player to a club
   * @param clubId Club id
   * @param playerId Player id
   */
  async addPlayerToClub(clubId: number, playerId: number) {
    const club = await this.findOne(clubId);
    const player = await this.playersService.findOne(playerId);

    if (player.club?.id === clubId) {
      throw new ConflictException(
        `Player with ID ${playerId} already exists in the club with ID ${clubId}`,
      );
    }

    club.players = [...(club.players || []), player];

    await this.redisService.invalidateByPattern(`${this.baseCacheKey}*`);

    return await this.clubsRepository.save(club);
  }

  /**
   * Remove a player from a club
   * @param clubId Club id
   * @param playerId Player id
   */
  async removePlayerFromClub(clubId: number, playerId: number) {
    const club = await this.findOne(clubId);
    const player = await this.playersService.findOne(playerId);

    if (player.club?.id !== clubId) {
      throw new BadRequestException(
        `Player with ID ${playerId} does not exist in the club with ID ${clubId}`,
      );
    }

    club.players = club.players?.filter((p) => p.id !== playerId);

    await this.redisService.invalidateByPattern(`${this.baseCacheKey}*`);

    return await this.clubsRepository.save(club);
  }

  /**
   * Validates uniqueness of club name
   * @param name Club name
   * @throws ConflictException - if club with name already exists
   */
  private async validateName(name: string) {
    const isNameExists = await this.clubsRepository.existsBy({
      name,
    });

    if (isNameExists) {
      throw new ConflictException(`Club with name ${name} already exists`);
    }
  }
}
