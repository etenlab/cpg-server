import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Roles } from './Roles';

@Index('organizations_pkey', ['id'], { unique: true })
@Index('organizations_name_key', ['name'], { unique: true })
@Entity('organizations', { schema: 'admin' })
export class Organizations {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('character varying', { name: 'name', unique: true, length: 128 })
  name: string;

  @OneToMany(() => Roles, (roles) => roles.organization2)
  roles: Roles[];
}
