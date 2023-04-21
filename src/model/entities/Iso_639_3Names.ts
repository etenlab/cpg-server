import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('iso_639_3_names_pkey', ['id'], { unique: true })
@Entity('iso_639_3_names', { schema: 'public' })
export class Iso_639_3Names {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id!: string;

  @Column('varchar', { name: 'iso_639_3', length: 3 })
  iso_639_3!: string;

  @Column('varchar', { name: 'print_name', length: 75 })
  printName!: string;

  @Column('varchar', { name: 'inverted_name', length: 75 })
  invertedName!: string;
}
