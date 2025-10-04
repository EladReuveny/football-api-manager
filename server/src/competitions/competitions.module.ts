import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubsModule } from 'src/clubs/clubs.module';
import { CountriesModule } from 'src/countries/countries.module';
import { CompetitionsController } from './competitions.controller';
import { CompetitionsService } from './competitions.service';
import { Competition } from './entities/competition.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Competition]),
    ClubsModule,
    CountriesModule,
  ],
  controllers: [CompetitionsController],
  providers: [CompetitionsService],
})
export class CompetitionsModule {}
