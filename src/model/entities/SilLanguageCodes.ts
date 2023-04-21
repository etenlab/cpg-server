import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('sil_language_codes_pkey', ['id'], { unique: true })
@Entity('sil_language_codes', { schema: 'public' })
export class SilLanguageCodes {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id!: string;

  @Column('varchar', { name: 'code', length: 3 })
  code!: string;

  @Column('varchar', { name: 'country_code', length: 2 })
  countryCode!: string;

  @Column('enum', { name: 'status', enum: ['L', 'X'] })
  status!: 'L' | 'X';

  @Column('varchar', { name: 'name', length: 200 })
  name!: string;
}
