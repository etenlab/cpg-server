import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Posts } from './Posts';

@Entity('discussions', { schema: 'admin' })
export class Discussions {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'app', default: () => '0' })
  app: number;

  @Column('integer', { name: 'org', default: () => '0' })
  org: number;

  @Column('character varying', { name: 'table_name' })
  tableName: string;

  @Column('integer', { name: 'row' })
  row: number;

  @OneToMany(() => Posts, (posts) => posts.discussion)
  posts: Posts[];
}
