import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Role } from 'src/users/enums/role.enum';
import { CompetitionsService } from './competitions.service';
import { CreateCompetitionDto } from './dto/create-competition.dto';
import { UpdateCompetitionDto } from './dto/update-competition.dto';

@Controller('competitions')
export class CompetitionsController {
  constructor(private readonly competitionsService: CompetitionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a competition' })
  @ApiBearerAuth('jwtAccessToken')
  @Roles(Role.ADMIN)
  async create(@Body() createCompetitionDto: CreateCompetitionDto) {
    return await this.competitionsService.create(createCompetitionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all competitions with pagination' })
  @Public()
  async findAll(@Query() query: PaginationQueryDto) {
    return await this.competitionsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific competition by ID' })
  @Public()
  async findOne(@Param('id') id: number) {
    return await this.competitionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a specific competition by ID' })
  @ApiBearerAuth('jwtAccessToken')
  @Roles(Role.ADMIN)
  async update(
    @Param('id') id: number,
    @Body() updateCompetitionDto: UpdateCompetitionDto,
  ) {
    return await this.competitionsService.update(id, updateCompetitionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific competition by ID' })
  @ApiBearerAuth('jwtAccessToken')
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: number) {
    await this.competitionsService.remove(id);
  }

  @Post('create-bulk')
  @ApiOperation({ summary: 'Create multiple competitions' })
  @ApiBearerAuth('jwtAccessToken')
  @Roles(Role.ADMIN)
  async createBulk(@Body() createCompetitionDtos: CreateCompetitionDto[]) {
    return await this.competitionsService.createBulk(createCompetitionDtos);
  }

  @Post(':competitionId/clubs/:clubId')
  @ApiOperation({ summary: 'Add a club to a specific competition' })
  @ApiBearerAuth('jwtAccessToken')
  @Roles(Role.ADMIN)
  async addClubToCompetition(
    @Param('competitionId') competitionId: number,
    @Param('clubId') clubId: number,
  ) {
    return await this.competitionsService.addClubToCompetition(
      competitionId,
      clubId,
    );
  }

  @Delete(':competitionId/clubs/:clubId')
  @ApiOperation({ summary: 'Remove a club from a specific competition' })
  @ApiBearerAuth('jwtAccessToken')
  @Roles(Role.ADMIN)
  async removeClubFromCompetition(
    @Param('competitionId') competitionId: number,
    @Param('clubId') clubId: number,
  ) {
    return await this.competitionsService.removeClubFromCompetition(
      competitionId,
      clubId,
    );
  }
}
