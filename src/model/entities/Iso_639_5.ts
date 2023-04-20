import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('iso_639_5_pkey', ['id'], { unique: true })
@Entity('iso_639_5', { schema: 'public' })
export class Iso_639_5 {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id!: string;

  @Column('varchar', { name: 'identifier', length: 3 })
  identifier!: string;

  @Column('varchar', {
    name: 'english_name',
    nullable: true,
    length: 128,
  })
  englishName!: string | null;

  @Column('varchar', {
    name: 'french_name',
    nullable: true,
    length: 128,
  })
  frenchName!: string | null;

  @Column('varchar', {
    name: 'iso_639_2',
    nullable: true,
    length: 128,
  })
  iso_639_2!: string | null;

  @Column('varchar', {
    name: 'hierarchy',
    nullable: true,
    length: 128,
  })
  hierarchy!: string | null;

  @Column('varchar', { name: 'notes', nullable: true, length: 128 })
  notes!: string | null;
}
