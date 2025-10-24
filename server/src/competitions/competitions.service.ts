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
   * @param competitionsRepository Competition repository
   * @param clubsService Clubs service
   * @param countriesService Countries service
   */
  constructor(
    @InjectRepository(Competition)
    private readonly competitionsRepository: Repository<Competition>,
    private readonly clubsService: ClubsService,
    private readonly countriesService: CountriesService,
  ) {}

  /**
   * Create a competition
   * @param createCompetitionDto Create competition dto
   * @returns Created competition
   */
  async create(createCompetitionDto: CreateCompetitionDto) {
    await this.validateName(createCompetitionDto.name);

    let country: Country | undefined = undefined;
    if (createCompetitionDto.countryId) {
      country = await this.countriesService.findOne(
        createCompetitionDto.countryId,
      );
    }

    let clubs: Club[] = [];
    if (createCompetitionDto.clubsIds) {
      clubs = await this.clubsService.findMany(createCompetitionDto.clubsIds);
    }

    const establishedAt = createCompetitionDto.establishedAt || new Date();

    const competition = this.competitionsRepository.create({
      ...createCompetitionDto,
      establishedAt,
      country,
      clubs,
    });
    return await this.competitionsRepository.save(competition);
  }

  /**
   * Get all competitions
   * @returns All competitions
   */
  async findAll() {
    return this.competitionsRepository.find({
      relations: ['country', 'clubs'],
    });
  }

  /**
   * Get a competition by id
   * @param id Competition id
   * @returns Competition
   * @throws NotFoundException - if competition not found
   */
  async findOne(id: number) {
    const competition = await this.competitionsRepository.findOne({
      where: { id },
      relations: ['country', 'clubs'],
    });

    if (!competition) {
      throw new NotFoundException(`Competition with id ${id} does not exist`);
    }

    return competition;
  }

  /**
   * Update a competition
   * @param id Competition id
   * @param updateCompetitionDto Update competition dto
   * @returns Updated competition
   */
  async update(id: number, updateCompetitionDto: UpdateCompetitionDto) {
    const competition = await this.findOne(id);

    const isNameChanged = updateCompetitionDto.name !== competition.name;
    if (isNameChanged && updateCompetitionDto.name) {
      await this.validateName(updateCompetitionDto.name);
      competition.name = updateCompetitionDto.name;
    }

    if (updateCompetitionDto.logoUrl) {
      competition.logoUrl = updateCompetitionDto.logoUrl;
    }

    if (updateCompetitionDto.competitionType) {
      competition.competitionType = updateCompetitionDto.competitionType;
    }

    if (updateCompetitionDto.countryId) {
      const country = await this.countriesService.findOne(
        updateCompetitionDto.countryId,
      );
      competition.country = country;
    } else {
      competition.country = null;
    }

    if (updateCompetitionDto.clubsIds) {
      const clubs = await this.clubsService.findMany(
        updateCompetitionDto.clubsIds,
      );
      competition.clubs = clubs;
    } else {
      competition.clubs = null;
    }

    return await this.competitionsRepository.save(competition);
  }

  /**
   * Remove a competition
   * @param id Competition id
   */
  async remove(id: number) {
    const competition = await this.findOne(id);
    await this.competitionsRepository.remove(competition);
  }

  /**
   * Validates uniqueness of competition name
   * @param name Competition name
   * @throws ConflictException - if competition with name already exists
   */
  private async validateName(name: string) {
    const isNameExists = await this.competitionsRepository.existsBy({
      name,
    });

    if (isNameExists) {
      throw new ConflictException(
        `Competition with name ${name} already exists`,
      );
    }
  }

  /**
   * Create many competitions
   * @param createCompetitionDtos Create competition dtos
   * @returns Created competitions
   */
  async createBulk(createCompetitionDtos: CreateCompetitionDto[]) {
    const competitions = await Promise.all(
      createCompetitionDtos.map((createCompetitionDto) =>
        this.create(createCompetitionDto),
      ),
    );

    return competitions;
  }

  /**
   * Add a club to a competition
   * @param competitionId Competition id
   * @param clubId Club id
   * @returns Updated competition
   * @throws ConflictException - if club already exists in competition
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
   * @param competitionId Competition id
   * @param clubId Club id
   */
  async removeClubFromCompetition(competitionId: number, clubId: number) {
    const competition = await this.findOne(competitionId);
    const club = await this.clubsService.findOne(clubId);

    competition.clubs = competition.clubs?.filter((c) => c.id !== club.id);

    return await this.competitionsRepository.save(competition);
  }
}
