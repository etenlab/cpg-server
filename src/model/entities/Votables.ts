import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BallotEntries } from './BallotEntries';

@Index('votables_table_name_key', ['tableName'], { unique: true })
@Entity('votables', { schema: 'admin' })
export class Votables {
  @Column('character varying', {
    name: 'table_name',
    unique: true,
    length: 64,
    primary: true,
  })
  tableName: string;

  @OneToMany(() => BallotEntries, (ballotEntries) => ballotEntries.tableName)
  ballotEntries: BallotEntries[];
}
