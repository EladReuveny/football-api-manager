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
import { ClubsService } from './clubs.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';

@Controller('clubs')
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new club' })
  @ApiBearerAuth('jwtAccessToken')
  @Roles(Role.ADMIN)
  async create(@Body() createClubDto: CreateClubDto) {
    return await this.clubsService.create(createClubDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all clubs' })
  @Public()
  async findAll() {
    return await this.clubsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific club by ID' })
  @Public()
  async findOne(@Param('id') id: number) {
    return await this.clubsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a specific club by ID' })
  @ApiBearerAuth('jwtAccessToken')
  @Roles(Role.ADMIN)
  async update(@Param('id') id: number, @Body() updateClubDto: UpdateClubDto) {
    return await this.clubsService.update(id, updateClubDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific club by ID' })
  @ApiBearerAuth('jwtAccessToken')
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: number) {
    await this.clubsService.remove(id);
  }

  @Post('create-bulk')
  @ApiOperation({ summary: 'Create many clubs' })
  @ApiBearerAuth('jwtAccessToken')
  @Roles(Role.ADMIN)
  async createBulk(@Body() createClubDtos: CreateClubDto[]) {
    const clubs = await this.clubsService.createBulk(createClubDtos);
    return clubs;
  }

  @Post(':clubId/players/:playerId')
  @ApiOperation({ summary: 'Add a player to a specific club' })
  @ApiBearerAuth('jwtAccessToken')
  @Roles(Role.ADMIN)
  async addPlayerToClub(
    @Param('clubId') clubId: number,
    @Param('playerId') playerId: number,
  ) {
    return await this.clubsService.addPlayerToClub(clubId, playerId);
  }

  @Delete(':clubId/players/:playerId')
  @ApiOperation({ summary: 'Remove a player from a specific club' })
  @ApiBearerAuth('jwtAccessToken')
  @Roles(Role.ADMIN)
  async removePlayerFromClub(
    @Param('clubId') clubId: number,
    @Param('playerId') playerId: number,
  ) {
    return await this.clubsService.removePlayerFromClub(clubId, playerId);
  }
}
