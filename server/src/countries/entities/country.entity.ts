import { Club } from 'src/clubs/entities/club.entity';
import { Competition } from 'src/competitions/entities/competition.entity';
import { Player } from 'src/players/entities/player.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('countries')
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  isoCode: string;

  @Column({ type: 'text' })
  flagUrl: string;

  @OneToMany(() => Player, (player) => player.nationality, {
    cascade: true,
    orphanedRowAction: 'delete',
  })
  players: Player[];

  @OneToMany(() => Club, (club) => club.country, {
    cascade: true,
    orphanedRowAction: 'delete',
  })
  clubs: Club[];

  @OneToMany(() => Competition, (competition) => competition.country, {
    cascade: true,
    orphanedRowAction: 'delete',
  })
  competitions: Competition[];
}
