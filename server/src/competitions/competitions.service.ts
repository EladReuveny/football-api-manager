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

/**
 * Service for competitions
 */
@Injectable()
export class CompetitionsService {
  /**
   * Constructor
   *
   * @param competitionsRepository - Competition repository
   * @param clubsService - Clubs service
   * @param countriesService - Countries service
   */
  constructor(
    @InjectRepository(Competition)
    private readonly competitionsRepository: Repository<Competition>,
    private readonly clubsService: ClubsService,
    private readonly countriesService: CountriesService,
  ) {}

  /**
   * Create a competition
   * @param createCompetitionDto - create competition dto
   * @returns created competition
   */
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

  /**
   * Get all competitions
   * @returns all competitions
   */
  async findAll() {
    return this.competitionsRepository.find();
  }

  /**
   * Get a competition by id
   * @param id - competition id
   * @returns competition
   * @throws NotFoundException if competition not found
   */
  async findOne(id: number) {
    const competition = await this.competitionsRepository.findOneBy({ id });

    if (!competition) {
      throw new NotFoundException(`Competition with id ${id} does not exist`);
    }

    return competition;
  }

  /**
   * Update a competition
   * @param id - competition id
   * @param updateCompetitionDto - update competition dto
   * @returns updated competition
   */
  async update(id: number, updateCompetitionDto: UpdateCompetitionDto) {
    const competition = await this.findOne(id);
    await this.validateUniqueness(updateCompetitionDto);
    const updatedCompetition = this.competitionsRepository.merge(
      competition,
      updateCompetitionDto,
    );

    return await this.competitionsRepository.save(updatedCompetition);
  }

  /**
   * Remove a competition
   * @param id - competition id
   */
  async remove(id: number) {
    const competition = await this.findOne(id);
    await this.competitionsRepository.remove(competition);
  }

  /**
   * Validate uniqueness of competition name
   * @param dto - create competition dto or update competition dto
   * @throws ConflictException if competition with name already exists
   */
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

  /**
   * Create many competitions
   * @param createCompetitionDtos - create competition dtos
   * @returns created competitions
   */
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

  /**
   * Add a club to a competition
   * @param competitionId - competition id
   * @param clubId - club id
   * @returns updated competition
   * @throws ConflictException if club already exists in competition
   */
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

  /**
   * Remove a club from a competition
   * @param competitionId - competition id
   * @param clubId - club id
   */
  async removeClubFromCompetition(competitionId: number, clubId: number) {
    const competition = await this.findOne(competitionId);
    const club = await this.clubsService.findOne(clubId);

    competition.clubs = competition.clubs?.filter((c) => c.id !== club.id);

    return await this.competitionsRepository.save(competition);
  }
}
