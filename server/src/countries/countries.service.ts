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

@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(Country)
    private readonly countriesRepository: Repository<Country>,
  ) {}

  async create(createCountryDto: CreateCountryDto) {
    await this.validateUniqueness(createCountryDto);

    const country = this.countriesRepository.create(createCountryDto);
    return await this.countriesRepository.save(country);
  }

  async findAll() {
    return await this.countriesRepository.find();
  }

  async findOne(id: number) {
    const country = await this.countriesRepository.findOneBy({ id });
    if (!country) {
      throw new NotFoundException(`Country with id ${id} does not exist`);
    }
    return country;
  }

  async update(id: number, updateCountryDto: UpdateCountryDto) {
    const country = await this.findOne(id);
    await this.validateUniqueness(updateCountryDto);
    const updatedCountry = this.countriesRepository.merge(
      country,
      updateCountryDto,
    );

    return await this.countriesRepository.save(updatedCountry);
  }

  async remove(id: number) {
    const country = await this.findOne(id);
    await this.countriesRepository.remove(country);
  }

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
