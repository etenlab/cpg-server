import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('progress_bible_language_details_pkey', ['id'], { unique: true })
@Entity('progress_bible_language_details', { schema: 'public' })
export class ProgressBibleLanguageDetails {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id!: string;

  @Column('varchar', { name: 'unit_code', length: 5 })
  unitCode!: string;

  @Column('enum', { name: 'unit_type', enum: ['L', 'S', 'D'] })
  unitType!: 'L' | 'S' | 'D';

  @Column('varchar', { name: 'unit_name', length: 200 })
  unitName!: string;

  @Column('varchar', { name: 'unit_full_name', length: 200 })
  unitFullName!: string;

  @Column('varchar', {
    name: 'ethnologue_name',
    nullable: true,
    length: 200,
  })
  ethnologueName!: string | null;

  @Column('varchar', {
    name: 'iso_639_3_code',
    nullable: true,
    length: 5,
  })
  iso_639_3Code!: string | null;

  @Column('boolean', { name: 'is_sign_language', nullable: true })
  isSignLanguage!: boolean | null;

  @Column('enum', { name: 'code_status', enum: ['Active', 'Retired'] })
  codeStatus!: 'Active' | 'Retired';

  @Column('enum', { name: 'language_status', enum: ['Living', 'Extinct'] })
  languageStatus!: 'Living' | 'Extinct';

  @Column('varchar', {
    name: 'language_scope',
    nullable: true,
    length: 20,
  })
  languageScope!: string | null;

  @Column('varchar', {
    name: 'primary_continent',
    nullable: true,
    length: 200,
  })
  primaryContinent!: string | null;

  @Column('varchar', {
    name: 'primary_country_name',
    nullable: true,
    length: 200,
  })
  primaryCountryName!: string | null;

  @Column('varchar', {
    name: 'primary_country_code',
    nullable: true,
    length: 2,
  })
  primaryCountryCode!: string | null;

  @Column('varchar', {
    name: 'retirement_explanation',
    nullable: true,
    length: 500,
  })
  retirementExplanation!: string | null;

  @Column('varchar', {
    name: 'how_to_fix',
    nullable: true,
    length: 500,
  })
  howToFix!: string | null;

  @Column('timestamp without time zone', {
    name: 'retired_date',
    nullable: true,
  })
  retiredDate!: Date | null;

  @Column('boolean', { name: 'show_active_language', nullable: true })
  showActiveLanguage!: boolean | null;

  @Column('boolean', { name: 'show_retired_language', nullable: true })
  showRetiredLanguage!: boolean | null;

  @Column('boolean', { name: 'show_active_dialect', nullable: true })
  showActiveDialect!: boolean | null;

  @Column('boolean', { name: 'show_retired_dialect', nullable: true })
  showRetiredDialect!: boolean | null;

  @Column('boolean', { name: 'show_sign_language', nullable: true })
  showSignLanguage!: boolean | null;
}
