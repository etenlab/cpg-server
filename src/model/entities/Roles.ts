import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Organizations } from './Organizations';

@Index('roles_pkey', ['id'], { unique: true })
@Index('roles_organization_name_key', ['name', 'organization'], {
  unique: true,
})
@Entity('roles', { schema: 'admin' })
export class Roles {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('bigint', { name: 'organization', unique: true })
  organization: string;

  @Column('character varying', { name: 'name', unique: true, length: 64 })
  name: string;

  @ManyToOne(() => Organizations, (organizations) => organizations.roles)
  @JoinColumn([{ name: 'organization', referencedColumnName: 'id' }])
  organization2: Organizations;
}
