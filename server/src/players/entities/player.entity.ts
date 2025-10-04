import { Club } from 'src/clubs/entities/club.entity';
import { Country } from 'src/countries/entities/country.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Position } from '../enums/position.enum';

@Entity('players')
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column({ type: 'enum', enum: Position })
  position: Position;

  @Column()
  rating: number;

  @Column({ type: 'float' })
  marketValue: number;

  @Column({ type: 'text' })
  imageUrl: string;

  @ManyToOne(() => Club, (club) => club.players, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'club_id' })
  club?: Club;

  @ManyToOne(() => Country, (country) => country.players, { eager: true })
  @JoinColumn({ name: 'nationality_id' })
  nationality: Country;
}
