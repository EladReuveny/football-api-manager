import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubsModule } from 'src/clubs/clubs.module';
import { CountriesModule } from 'src/countries/countries.module';
import { Player } from './entities/player.entity';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Player]),
    forwardRef(() => ClubsModule),
    CountriesModule,
  ],
  controllers: [PlayersController],
  providers: [PlayersService],
  exports: [PlayersService],
})
export class PlayersModule {}
