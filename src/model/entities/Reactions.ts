import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './Users';
import { Posts } from './Posts';

@Index('UQ_29d6182ce029fec9c2dacf3c8f7', ['content', 'postId', 'userId'], {
  unique: true,
})
@Entity('reactions', { schema: 'admin' })
export class Reactions {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'post_id', unique: true })
  postId: number;

  @Column('integer', { name: 'user_id', unique: true })
  userId: number;

  @Column('character varying', { name: 'content', unique: true })
  content: string;

  @ManyToOne(() => Users, (users) => users.reactions, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: Users;

  @ManyToOne(() => Posts, (posts) => posts.reactions, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'post_id', referencedColumnName: 'id' }])
  post: Posts;
}
