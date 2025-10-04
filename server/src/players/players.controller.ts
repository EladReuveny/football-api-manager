import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { PlayersService } from './players.service';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  async create(@Body() createPlayerDto: CreatePlayerDto) {
    return await this.playersService.create(createPlayerDto);
  }

  @Get()
  async findAll() {
    return await this.playersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.playersService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updatePlayerDto: UpdatePlayerDto,
  ) {
    return await this.playersService.update(id, updatePlayerDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.playersService.remove(id);
  }

  @Post('create-many')
  async createMany(@Body() createPlayerDtos: CreatePlayerDto[]) {
    return await this.playersService.createMany(createPlayerDtos);
  }
}
