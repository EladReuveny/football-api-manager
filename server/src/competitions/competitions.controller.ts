import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CompetitionsService } from './competitions.service';
import { CreateCompetitionDto } from './dto/create-competition.dto';
import { UpdateCompetitionDto } from './dto/update-competition.dto';

@Controller('competitions')
export class CompetitionsController {
  constructor(private readonly competitionsService: CompetitionsService) {}

  @Post()
  async create(@Body() createCompetitionDto: CreateCompetitionDto) {
    return await this.competitionsService.create(createCompetitionDto);
  }

  @Get()
  async findAll() {
    return await this.competitionsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.competitionsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCompetitionDto: UpdateCompetitionDto,
  ) {
    return await this.competitionsService.update(id, updateCompetitionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.competitionsService.remove(id);
  }

  @Post('create-many')
  async createMany(@Body() createCompetitionDtos: CreateCompetitionDto[]) {
    return await this.competitionsService.createMany(createCompetitionDtos);
  }

  @Post(':competitionId/clubs/:clubId')
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
