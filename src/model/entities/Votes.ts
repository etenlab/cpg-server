import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BallotEntries } from './BallotEntries';

@Index('UQ_6f4b14dd22823738596576b3374', ['ballotEntryId', 'userId'], {
  unique: true,
})
@Entity('votes', { schema: 'admin' })
export class Votes {
  @Column('boolean', { name: 'up' })
  up: boolean;

  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'ballot_entry_id', unique: true })
  ballotEntryId: number;

  @Column('character varying', { name: 'user_id', unique: true })
  userId: string;

  @ManyToOne(() => BallotEntries, (ballotEntries) => ballotEntries.votes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'ballot_entry_id', referencedColumnName: 'id' }])
  ballotEntry: BallotEntries;
}
