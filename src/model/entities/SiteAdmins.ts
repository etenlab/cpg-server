import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('site_admins_pkey', ['id'], { unique: true })
@Index('site_admins_name_key', ['name'], { unique: true })
@Entity('site_admins', { schema: 'admin' })
export class SiteAdmins {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('character varying', { name: 'name', unique: true, length: 64 })
  name: string;
}
