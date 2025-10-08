import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { Country } from './entities/country.entity';

/**
 * CountriesService
 *
 * This service provides functionality for managing countries.
 */
@Injectable()
export class CountriesService {
  /**
   * Constructor
   *
   * @param countriesRepository - country repository
   */
  constructor(
    @InjectRepository(Country)
    private readonly countriesRepository: Repository<Country>,
  ) {}

  /**
   * Creates a new country
   *
   * @param createCountryDto - country to create
   * @returns created country
   */
  async create(createCountryDto: CreateCountryDto) {
    await this.validateUniqueness(createCountryDto);

    const country = this.countriesRepository.create(createCountryDto);
    return await this.countriesRepository.save(country);
  }

  /**
   * Finds all countries
   *
   * @returns all countries
   */
  async findAll() {
    return await this.countriesRepository.find();
  }

  /**
   * Finds a country by id
   *
   * @param id - country id
   * @returns found country
   * @throws NotFoundException - if country with id does not exist
   */
  async findOne(id: number) {
    const country = await this.countriesRepository.findOneBy({ id });
    if (!country) {
      throw new NotFoundException(`Country with id ${id} does not exist`);
    }
    return country;
  }

  /**
   * Updates a country
   *
   * @param id - country id
   * @param updateCountryDto - country to update
   * @returns updated country
   */
  async update(id: number, updateCountryDto: UpdateCountryDto) {
    const country = await this.findOne(id);
    await this.validateUniqueness(updateCountryDto);
    const updatedCountry = this.countriesRepository.merge(
      country,
      updateCountryDto,
    );

    return await this.countriesRepository.save(updatedCountry);
  }

  /**
   * Removes a country
   *
   * @param id - country id
   */
  async remove(id: number) {
    const country = await this.findOne(id);
    await this.countriesRepository.remove(country);
  }

  /**
   * Creates many countries
   *
   * @param createCountriesDtos - countries to create
   * @returns created countries
   */
  async createMany(createCountriesDtos: CreateCountryDto[]) {
    // const countries = this.countriesRepository.create(createCountriesDtos);
    // return await this.countriesRepository.save(countries);
    const countries = await Promise.all(
      createCountriesDtos.map((createCountryDto) =>
        this.create(createCountryDto),
      ),
    );

    return countries;
  }

  /**
   * Validates uniqueness of country
   *
   * @param dto - country to validate
   * @throws ConflictException - if country with name or ISO code already exists
   */
  private async validateUniqueness(dto: CreateCountryDto | UpdateCountryDto) {
    const { name, isoCode } = dto;

    const isNameExists = await this.countriesRepository.existsBy({
      name,
    });

    if (isNameExists) {
      throw new ConflictException(`Country with name ${name} already exists`);
    }

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
