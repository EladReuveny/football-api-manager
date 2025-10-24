import { Club } from 'src/clubs/entities/club.entity';
import { Country } from 'src/countries/entities/country.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CompetitionType } from '../enums/competition-type.enum';

@Entity('competitions')
export class Competition {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'text' })
  logoUrl: string;

  @Column({ type: 'date', update: false })
  establishedAt: Date;

  @Column({ type: 'enum', enum: CompetitionType })
  competitionType: CompetitionType;

  @ManyToOne(() => Country, (country) => country.competitions, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'country_id' })
  country?: Country | null;

  @ManyToMany(() => Club, (club) => club.competitions, {
    nullable: true,
  })
  @JoinTable({
    name: 'competitions_clubs',
    joinColumn: { name: 'competition_id' },
    inverseJoinColumn: { name: 'club_id' },
  })
  clubs?: Club[] | null;
}
