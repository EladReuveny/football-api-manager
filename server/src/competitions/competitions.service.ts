import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClubsService } from 'src/clubs/clubs.service';
import { Club } from 'src/clubs/entities/club.entity';
import { CountriesService } from 'src/countries/countries.service';
import { Country } from 'src/countries/entities/country.entity';
import { Repository } from 'typeorm';
import { CreateCompetitionDto } from './dto/create-competition.dto';
import { UpdateCompetitionDto } from './dto/update-competition.dto';
import { Competition } from './entities/competition.entity';

@Injectable()
export class CompetitionsService {
  constructor(
    @InjectRepository(Competition)
    private readonly competitionsRepository: Repository<Competition>,
    private readonly clubsService: ClubsService,
    private readonly countriesService: CountriesService,
  ) {}

  async create(createCompetitionDto: CreateCompetitionDto) {
    await this.validateUniqueness(createCompetitionDto);

    let country: Country | undefined = undefined;
    if (createCompetitionDto.countryId) {
      country = await this.countriesService.findOne(
        createCompetitionDto.countryId,
      );
    }

    let clubs: Club[] = [];
    if (createCompetitionDto.clubIds) {
      clubs = await this.clubsService.findMany(createCompetitionDto.clubIds);
    }

    const competition = this.competitionsRepository.create({
      ...createCompetitionDto,
      establishedAt: createCompetitionDto.establishedAt
        ? createCompetitionDto.establishedAt
        : new Date(),
      country,
      clubs,
    });
    return await this.competitionsRepository.save(competition);
  }

  async findAll() {
    return this.competitionsRepository.find();
  }

  async findOne(id: number) {
    const competition = await this.competitionsRepository.findOneBy({ id });

    if (!competition) {
      throw new NotFoundException(`Competition with id ${id} does not exist`);
    }

    return competition;
  }

  async update(id: number, updateCompetitionDto: UpdateCompetitionDto) {
    const competition = await this.findOne(id);
    await this.validateUniqueness(updateCompetitionDto);
    const updatedCompetition = this.competitionsRepository.merge(
      competition,
      updateCompetitionDto,
    );

    return await this.competitionsRepository.save(updatedCompetition);
  }

  async remove(id: number) {
    const competition = await this.findOne(id);
    await this.competitionsRepository.remove(competition);
  }

  private async validateUniqueness(
    dto: CreateCompetitionDto | UpdateCompetitionDto,
  ) {
    const { name } = dto;

    const isNameExists = await this.competitionsRepository.existsBy({ name });

    if (isNameExists) {
      throw new ConflictException(
        `Competition with name ${name} already exists`,
      );
    }
  }

  async createMany(createCompetitionDtos: CreateCompetitionDto[]) {
    // const competitions = this.competitionsRepository.create(
    //   createCompetitionDtos,
    // );
    // return await this.competitionsRepository.save(competitions);
    const competitions = await Promise.all(
      createCompetitionDtos.map((createCompetitionDto) =>
        this.create(createCompetitionDto),
      ),
    );

    return competitions;
  }

  async addClubToCompetition(competitionId: number, clubId: number) {
    const competition = await this.findOne(competitionId);
    const club = await this.clubsService.findOne(clubId);

    const isClubExistInCompetition = competition.clubs?.some(
      (c) => c.id === club.id,
    );

    if (isClubExistInCompetition) {
      throw new ConflictException(
        `Club with id ${clubId} already exists in competition with id ${competitionId}`,
      );
    }

    competition.clubs?.push(club);

    return await this.competitionsRepository.save(competition);
  }

  async removeClubFromCompetition(competitionId: number, clubId: number) {
    const competition = await this.findOne(competitionId);
    const club = await this.clubsService.findOne(clubId);

    competition.clubs = competition.clubs?.filter((c) => c.id !== club.id);

    return await this.competitionsRepository.save(competition);
  }
}
