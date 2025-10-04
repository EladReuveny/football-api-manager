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

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player) private playersRepository: Repository<Player>,
    @Inject(forwardRef(() => ClubsService))
    private readonly clubsService: ClubsService,
    private readonly countriesService: CountriesService,
  ) {}

  async create(createPlayerDto: CreatePlayerDto) {
    let club: Club | undefined;
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

  async findAll() {
    return await this.playersRepository.find();
  }

  async findOne(id: number) {
    const player = await this.playersRepository.findOneBy({ id });
    if (!player) {
      throw new NotFoundException(`Player with ID ${id} not found`);
    }
    return player;
  }

  async update(id: number, updatePlayerDto: UpdatePlayerDto) {
    const player = await this.findOne(id);
    const updatedPlayer = this.playersRepository.merge(player, updatePlayerDto);
    return await this.playersRepository.save(updatedPlayer);
  }

  async remove(id: number) {
    const player = await this.findOne(id);
    await this.playersRepository.remove(player);
  }

  async createMany(createPlayerDtos: CreatePlayerDto[]) {
    // const players = this.playersRepository.create(createPlayerDtos);
    // return await this.playersRepository.save(players);
    const players = await Promise.all(
      createPlayerDtos.map((createPlayerDto) => this.create(createPlayerDto)),
    );
    
    return players;
  }
}
