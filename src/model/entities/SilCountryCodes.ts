import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('sil_country_codes_pkey', ['id'], { unique: true })
@Entity('sil_country_codes', { schema: 'public' })
export class SilCountryCodes {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id!: string;

  @Column('varchar', { name: 'code', length: 2 })
  code!: string;

  @Column('varchar', { name: 'name', length: 200 })
  name!: string;

  @Column('varchar', { name: 'area', length: 200 })
  area!: string;
}
