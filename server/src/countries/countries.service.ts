import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';
import { Repository } from 'typeorm';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { Country } from './entities/country.entity';

/**
 * CountriesService
 * This service provides functionality for managing countries.
 */
@Injectable()
export class CountriesService {
  /**
   * Constructor
   * @param countriesRepository Country repository
   */
  constructor(
    @InjectRepository(Country)
    private readonly countriesRepository: Repository<Country>,
  ) {}

  /**
   * Creates a new country
   * @param createCountryDto Country to create
   * @returns Created country
   */
  async create(createCountryDto: CreateCountryDto) {
    await this.validateName(createCountryDto.name);
    await this.validateIsoCode(createCountryDto.isoCode);

    const country = this.countriesRepository.create(createCountryDto);
    return await this.countriesRepository.save(country);
  }

  /**
   * Get all countries with pagination.
   *
   * @param {PaginationQueryDto} query - The pagination query parameters.
   * @returns The paginated list of countries.
   */
  async findAll(query: PaginationQueryDto) {
    const { page, limit } = query;

    const offset = (page - 1) * limit;

    const [items, total] = await this.countriesRepository.findAndCount({
      take: limit,
      skip: offset,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      items,
      currentPage: page,
      limit,
      totalItems: total,
      totalPages,
    } as PaginationResponseDto<Country>;
  }

  /**
   * Finds a country by id
   * @param id Country id
   * @returns Found country
   * @throws NotFoundException - if country with id does not exist
   */
  async findOne(id: number) {
    const country = await this.countriesRepository.findOne({
      where: { id },
      relations: ['players', 'clubs', 'competitions'],
    });
    if (!country) {
      throw new NotFoundException(`Country with id ${id} does not exist`);
    }

    return country;
  }

  /**
   * Updates a country
   * @param id Country id
   * @param updateCountryDto Country to update
   * @returns Updated country
   */
  async update(id: number, updateCountryDto: UpdateCountryDto) {
    const country = await this.findOne(id);

    const isNameChanged = updateCountryDto.name !== country.name;
    if (isNameChanged && updateCountryDto.name) {
      await this.validateName(updateCountryDto.name);
      country.name = updateCountryDto.name;
    }

    const isIsoCodeChanged = updateCountryDto.isoCode !== country.isoCode;
    if (isIsoCodeChanged && updateCountryDto.isoCode) {
      await this.validateIsoCode(updateCountryDto.isoCode);
      country.isoCode = updateCountryDto.isoCode;
    }

    if (updateCountryDto.flagUrl) {
      country.flagUrl = updateCountryDto.flagUrl;
    }

    return await this.countriesRepository.save(country);
  }

  /**
   * Removes a country
   * @param id Country id
   */
  async remove(id: number) {
    const country = await this.findOne(id);
    await this.countriesRepository.remove(country);
  }

  /**
   * Creates many countries
   * @param createCountriesDtos Countries to create
   * @returns Created countries
   */
  async createBulk(createCountriesDtos: CreateCountryDto[]) {
    const countries = await Promise.all(
      createCountriesDtos.map((createCountryDto) =>
        this.create(createCountryDto),
      ),
    );

    return countries;
  }

  /**
   * Validates uniqueness of country name
   * @param name Country name
   * @throws ConflictException - if country with name already exists
   */
  private async validateName(name: string) {
    const isNameExists = await this.countriesRepository.existsBy({
      name,
    });

    if (isNameExists) {
      throw new ConflictException(`Country with name ${name} already exists`);
    }
  }

  /**
   * Validates uniqueness of country ISO code
   * @param isoCode Country ISO code
   * @throws ConflictException - if country with ISO code already exists
   */
  private async validateIsoCode(isoCode: string) {
    const isIsoCodeExists = await this.countriesRepository.existsBy({
      isoCode,
    });

    if (isIsoCodeExists) {
      throw new ConflictException(
        `Country with ISO code ${isoCode} already exists`,
      );
    }
  }
}
