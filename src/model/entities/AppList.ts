import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SiteTextKeys } from './SiteTextKeys';

@Index('app_list_pkey', ['id'], { unique: true })
@Entity('app_list', { schema: 'admin' })
export class AppList {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('character varying', {
    name: 'app_name',
    nullable: true,
    length: 128,
  })
  appName: string | null;

  @OneToMany(() => SiteTextKeys, (siteTextKeys) => siteTextKeys.app2)
  siteTextKeys: SiteTextKeys[];
}
