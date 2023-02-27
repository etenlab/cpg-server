import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('language_skills_pkey', ['id'], { unique: true })
@Index(
  'language_skills_user_id_language_table_language_id_key',
  ['languageId', 'languageTable', 'userId'],
  { unique: true },
)
@Entity('language_skills', { schema: 'admin' })
export class LanguageSkills {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('character varying', { name: 'user_id', unique: true, length: 512 })
  userId: string;

  @Column('character varying', {
    name: 'language_table',
    unique: true,
    length: 64,
  })
  languageTable: string;

  @Column('bigint', { name: 'language_id', unique: true })
  languageId: string;

  @Column('enum', { name: 'skill_level', enum: ['1', '2', '3', '4', '5'] })
  skillLevel: '1' | '2' | '3' | '4' | '5';
}
