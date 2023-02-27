import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AppList } from './AppList';
import { SiteTextTranslations } from './SiteTextTranslations';

@Index('site_text_keys_app_site_text_key_key', ['app', 'siteTextKey'], {
  unique: true,
})
@Index('site_text_keys_pkey', ['id'], { unique: true })
@Entity('site_text_keys', { schema: 'admin' })
export class SiteTextKeys {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('bigint', { name: 'app', unique: true })
  app: string;

  @Column('character varying', { name: 'language_table', length: 64 })
  languageTable: string;

  @Column('bigint', { name: 'language_id' })
  languageId: string;

  @Column('character varying', {
    name: 'site_text_key',
    unique: true,
    length: 512,
  })
  siteTextKey: string;

  @Column('character varying', {
    name: 'description',
    nullable: true,
    length: 512,
  })
  description: string | null;

  @ManyToOne(() => AppList, (appList) => appList.siteTextKeys)
  @JoinColumn([{ name: 'app', referencedColumnName: 'id' }])
  app2: AppList;

  @OneToMany(
    () => SiteTextTranslations,
    (siteTextTranslations) => siteTextTranslations.siteText2,
  )
  siteTextTranslations: SiteTextTranslations[];
}
