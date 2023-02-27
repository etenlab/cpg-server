import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('progress_bible_language_details')
export class ProgressBibleLanguageDetail {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
  })
  id: number;

  @Column({
    nullable: false,
    default: '',
  })
  unit_code: string;

  @Column({
    nullable: false,
    default: '',
  })
  unit_type: string;

  @Column({
    nullable: false,
    default: '',
  })
  unit_name: string;

  @Column({
    nullable: false,
    default: '',
  })
  unit_full_name: string;

  @Column({
    nullable: true,
    default: '',
  })
  ethnologue_name: string;

  @Column({
    nullable: true,
    default: '',
  })
  iso_639_3_code: string;

  @Column({
    nullable: false,
    default: false,
  })
  is_sign_language: boolean;

  @Column({
    nullable: false,
    default: '',
  })
  code_status: string;

  @Column({
    nullable: false,
    default: '',
  })
  language_status: string;

  @Column({
    nullable: true,
    default: '',
  })
  language_scope: string;

  @Column({
    nullable: true,
    default: '',
  })
  primary_continent: string;

  @Column({
    nullable: true,
    default: '',
  })
  primary_country_name: string;

  @Column({
    nullable: true,
    default: '',
  })
  primary_country_code: string;

  @Column({
    nullable: true,
    default: '',
  })
  retirement_explanation: string;

  @Column({
    nullable: true,
    default: '',
  })
  how_to_fix: string;

  @Column({
    nullable: true,
    default: '',
  })
  retired_date: string;

  @Column({
    nullable: true,
    default: '',
  })
  show_active_language: boolean;

  @Column({
    nullable: true,
    default: '',
  })
  show_retired_language: boolean;

  @Column({
    nullable: true,
    default: '',
  })
  show_active_dialect: boolean;

  @Column({
    nullable: true,
    default: '',
  })
  show_retired_dialect: boolean;

  @Column({
    nullable: true,
    default: '',
  })
  show_sign_language: boolean;
}
