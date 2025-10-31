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
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { PlayersService } from './players.service';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a player' })
  @ApiBearerAuth('jwtAccessToken')
  @Roles(Role.ADMIN)
  async create(@Body() createPlayerDto: CreatePlayerDto) {
    return await this.playersService.create(createPlayerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all players with pagination' })
  @Public()
  async findAll(@Query() query: PaginationQueryDto) {
    return await this.playersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific player by ID' })
  @Public()
  async findOne(@Param('id') id: number) {
    return await this.playersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a specific player by ID' })
  @ApiBearerAuth('jwtAccessToken')
  @Roles(Role.ADMIN)
  async update(
    @Param('id') id: number,
    @Body() updatePlayerDto: UpdatePlayerDto,
  ) {
    return await this.playersService.update(id, updatePlayerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific player by ID' })
  @ApiBearerAuth('jwtAccessToken')
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: number) {
    return await this.playersService.remove(id);
  }

  @Post('create-bulk')
  @ApiOperation({ summary: 'Create many players' })
  @ApiBearerAuth('jwtAccessToken')
  @Roles(Role.ADMIN)
  async createBulk(@Body() createPlayerDtos: CreatePlayerDto[]) {
    return await this.playersService.createBulk(createPlayerDtos);
  }
}
