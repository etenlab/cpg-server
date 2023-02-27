import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './Users';

@Index('avatars_history_pkey', ['avatarHistoryId'], { unique: true })
@Entity('avatars_history', { schema: 'admin' })
export class AvatarsHistory {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'avatar_history_id' })
  avatarHistoryId: string;

  @Column('character varying', { name: 'avatar', length: 64 })
  avatar: string;

  @Column('character varying', { name: 'url', nullable: true, length: 128 })
  url: string | null;

  @Column('timestamp without time zone', { name: 'created_at' })
  createdAt: Date;

  @Column('timestamp without time zone', {
    name: 'changed_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  changedAt: Date;

  @ManyToOne(() => Users, (users) => users.avatarsHistories)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: Users;
}
