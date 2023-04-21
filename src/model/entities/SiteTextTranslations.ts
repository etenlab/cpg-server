import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SiteTextKeys } from './SiteTextKeys';

@Index('site_text_translations_pkey', ['id'], { unique: true })
@Index(
  'site_text_translations_site_text_site_text_translation_key',
  ['siteText', 'siteTextTranslation'],
  { unique: true },
)
@Entity('site_text_translations', { schema: 'admin' })
export class SiteTextTranslations {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('bigint', { name: 'site_text', unique: true })
  siteText: string;

  @Column('varchar', { name: 'language_table', length: 64 })
  languageTable: string;

  @Column('bigint', { name: 'language_id' })
  languageId: string;

  @Column('varchar', { name: 'user_id', length: 512 })
  userId: string;

  @Column('varchar', {
    name: 'site_text_translation',
    unique: true,
    length: 512,
  })
  siteTextTranslation: string;

  @Column('varchar', { name: 'description_translation', length: 512 })
  descriptionTranslation: string;

  @ManyToOne(
    () => SiteTextKeys,
    (siteTextKeys) => siteTextKeys.siteTextTranslations,
  )
  @JoinColumn([{ name: 'site_text', referencedColumnName: 'id' }])
  siteText2: SiteTextKeys;
}
