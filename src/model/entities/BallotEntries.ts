import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Elections } from './Elections';
import { Votables } from './Votables';
import { Votes } from './Votes';

@Index('ballot_entries_pkey', ['id'], { unique: true })
@Entity('ballot_entries', { schema: 'admin' })
export class BallotEntries {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('bigint', { name: 'row' })
  row: string;

  @Column('character varying', {
    name: 'created_by',
    nullable: true,
    length: 512,
  })
  createdBy: string | null;

  @ManyToOne(() => Elections, (elections) => elections.ballotEntries)
  @JoinColumn([{ name: 'election_id', referencedColumnName: 'id' }])
  election: Elections;

  @ManyToOne(() => Votables, (votables) => votables.ballotEntries)
  @JoinColumn([{ name: 'table_name', referencedColumnName: 'tableName' }])
  tableName: Votables;

  @OneToMany(() => Votes, (votes) => votes.ballotEntry)
  votes: Votes[];
}
