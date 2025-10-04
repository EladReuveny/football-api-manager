import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ClubsService } from './clubs.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';

@Controller('clubs')
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  @Post()
  async create(@Body() createClubDto: CreateClubDto) {
    return await this.clubsService.create(createClubDto);
  }

  @Get()
  async findAll() {
    return await this.clubsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.clubsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateClubDto: UpdateClubDto) {
    return await this.clubsService.update(id, updateClubDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.clubsService.remove(id);
  }

  @Post('create-many')
  async createMany(@Body() createClubDtos: CreateClubDto[]) {
    const clubs = await this.clubsService.createMany(createClubDtos);
    return clubs;
  }

  @Post(':clubId/players/:playerId')
  async addPlayerToClub(
    @Param('clubId') clubId: number,
    @Param('playerId') playerId: number,
  ) {
    return await this.clubsService.addPlayerToClub(clubId, playerId);
  }

  @Delete(':clubId/players/:playerId')
  async removePlayerFromClub(
    @Param('clubId') clubId: number,
    @Param('playerId') playerId: number,
  ) {
    return await this.clubsService.removePlayerFromClub(clubId, playerId);
  }
}
