import { Competition } from 'src/competitions/entities/competition.entity';
import { Country } from 'src/countries/entities/country.entity';
import { Player } from 'src/players/entities/player.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('clubs')
export class Club {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'text' })
  logoUrl: string;

  @Column({ type: 'date', update: false })
  establishedAt: Date;

  @ManyToOne(() => Country, (country) => country.clubs, { eager: true })
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @OneToMany(() => Player, (player) => player.club, {
    nullable: true,
  })
  players?: Player[] | null;

  @ManyToMany(() => Competition, (competition) => competition.clubs, {
    nullable: true,
  })
  competitions?: Competition[] | null;
}
