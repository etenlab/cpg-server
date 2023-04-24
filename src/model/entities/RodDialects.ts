import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('rod_dialects_pkey', ['id'], { unique: true })
@Entity('rod_dialects', { schema: 'public' })
export class RodDialects {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id!: string;

  @Column('varchar', {
    name: 'dialect_code',
    nullable: true,
    length: 10,
  })
  dialectCode!: string | null;

  @Column('varchar', {
    name: 'language_code',
    nullable: true,
    length: 3,
  })
  languageCode!: string | null;

  @Column('varchar', {
    name: 'country_code',
    nullable: true,
    length: 2,
  })
  countryCode!: string | null;

  @Column('varchar', {
    name: 'dialect_name',
    nullable: true,
    length: 200,
  })
  dialectName!: string | null;

  @Column('varchar', {
    name: 'language_name',
    nullable: true,
    length: 200,
  })
  languageName!: string | null;

  @Column('varchar', {
    name: 'location_name',
    nullable: true,
    length: 200,
  })
  locationName!: string | null;
}
