import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClubsService } from 'src/clubs/clubs.service';
import { Club } from 'src/clubs/entities/club.entity';
import { CountriesService } from 'src/countries/countries.service';
import { Repository } from 'typeorm';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Player } from './entities/player.entity';

/**
 * Service for players
 */
@Injectable()
export class PlayersService {
  /**
   * Constructor
   * @param playersRepository Player repository
   * @param clubsService Club service
   * @param countriesService Country service
   */
  constructor(
    @InjectRepository(Player) private playersRepository: Repository<Player>,
    @Inject(forwardRef(() => ClubsService))
    private readonly clubsService: ClubsService,
    private readonly countriesService: CountriesService,
  ) {}

  /**
   * Create a player
   * @param createPlayerDto Create player dto
   * @returns Created player
   */
  async create(createPlayerDto: CreatePlayerDto) {
    let club: Club | null = null;
    if (createPlayerDto.clubId) {
      club = await this.clubsService.findOne(createPlayerDto.clubId);
    }

    const nationality = await this.countriesService.findOne(
      createPlayerDto.nationalityId,
    );

    const player = this.playersRepository.create({
      ...createPlayerDto,
      club,
      nationality,
    });
    return await this.playersRepository.save(player);
  }

  /**
   * Get all players
   * @returns All players
   */
  async findAll() {
    return await this.playersRepository.find({
      relations: ['club', 'nationality'],
    });
  }

  /**
   * Get a player by id
   * @param id Player id
   * @returns Player
   * @throws NotFoundException - if player not found
   */
  async findOne(id: number) {
    const player = await this.playersRepository.findOne({
      where: { id },
      relations: ['club', 'nationality'],
    });

    if (!player) {
      throw new NotFoundException(`Player with ID ${id} not found`);
    }
    
    return player;
  }

  /**
   * Update a player
   * @param id Player id
   * @param updatePlayerDto Update player dto
   * @returns Updated player
   */
  async update(id: number, updatePlayerDto: UpdatePlayerDto) {
    const player = await this.findOne(id);

    if (updatePlayerDto.name) {
      player.name = updatePlayerDto.name;
    }

    if (updatePlayerDto.age) {
      player.age = updatePlayerDto.age;
    }

    if (updatePlayerDto.position) {
      player.position = updatePlayerDto.position;
    }

    if (updatePlayerDto.rating) {
      player.rating = updatePlayerDto.rating;
    }

    if (updatePlayerDto.marketValue) {
      player.marketValue = updatePlayerDto.marketValue;
    }

    if (updatePlayerDto.imageUrl) {
      player.imageUrl = updatePlayerDto.imageUrl;
    }

    if (updatePlayerDto.clubId) {
      const club = await this.clubsService.findOne(updatePlayerDto.clubId);
      player.club = club;
    } else {
      player.club = null;
    }

    if (updatePlayerDto.nationalityId) {
      const nationality = await this.countriesService.findOne(
        updatePlayerDto.nationalityId,
      );
      player.nationality = nationality;
    }

    return await this.playersRepository.save(player);
  }

  /**
   * Remove a player
   * @param id Player id
   */
  async remove(id: number) {
    const player = await this.findOne(id);
    await this.playersRepository.remove(player);
  }

  /**
   * Create many players
   * @param createPlayerDtos Create player dtos
   * @returns Created players
   */
  async createBulk(createPlayerDtos: CreatePlayerDto[]) {
    const players = await Promise.all(
      createPlayerDtos.map((createPlayerDto) => this.create(createPlayerDto)),
    );

    return players;
  }
}
