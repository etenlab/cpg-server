import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BallotEntries } from './BallotEntries';

@Index('UQ_158321ee72c8500afea8d69eec5', ['appId', 'name'], { unique: true })
@Index('elections_pkey', ['id'], { unique: true })
@Entity('elections', { schema: 'admin' })
export class Elections {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('integer', { name: 'app_id', unique: true })
  appId: number;

  @Column('character varying', { name: 'name', unique: true })
  name: string;

  @Column('character varying', { name: 'table_name' })
  tableName: string;

  @Column('integer', { name: 'row' })
  row: number;

  @Column('character varying', { name: 'created_by' })
  createdBy: string;

  @OneToMany(() => BallotEntries, (ballotEntries) => ballotEntries.election)
  ballotEntries: BallotEntries[];
}
