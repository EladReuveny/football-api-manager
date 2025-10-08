import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/users/enums/role.enum';
import { CountriesService } from './countries.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a country' })
  @ApiBearerAuth('jwtAccessToken')
  @Roles(Role.ADMIN)
  async create(@Body() createCountryDto: CreateCountryDto) {
    return await this.countriesService.create(createCountryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all countries' })
  @Public()
  async findAll() {
    return await this.countriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific country by ID' })
  @Public()
  async findOne(@Param('id') id: number) {
    return await this.countriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a specific country by ID' })
  @ApiBearerAuth('jwtAccessToken')
  @Roles(Role.ADMIN)
  async update(
    @Param('id') id: number,
    @Body() updateCountryDto: UpdateCountryDto,
  ) {
    return await this.countriesService.update(id, updateCountryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific country by ID' })
  @ApiBearerAuth('jwtAccessToken')
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: number) {
    return await this.countriesService.remove(id);
  }

  @Post('create-many')
  @ApiOperation({ summary: 'Create multiple countries' })
  @ApiBearerAuth('jwtAccessToken')
  @Roles(Role.ADMIN)
  async createMany(@Body() createCountriesDtos: CreateCountryDto[]) {
    return await this.countriesService.createMany(createCountriesDtos);
  }
}
