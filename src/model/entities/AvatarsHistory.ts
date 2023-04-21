import {
  Column,
  Entity,
  Index,
  // JoinColumn,
  // ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
// import { User } from '../entities';

@Index('avatars_history_pkey', ['avatarHistoryId'], { unique: true })
@Entity('avatars_history', { schema: 'admin' })
export class AvatarsHistory {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'avatar_history_id' })
  avatarHistoryId: string;

  @Column('varchar', { name: 'avatar', length: 64 })
  avatar: string;

  @Column('varchar', { name: 'url', nullable: true, length: 128 })
  url: string | null;

  @Column('timestamp without time zone', { name: 'created_at' })
  createdAt: Date;

  @Column('timestamp without time zone', {
    name: 'changed_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  changedAt: Date;

  // comented out when harmonizing entities with crowd.bible
  // @ManyToOne(() => User, (users) => users.avatarsHistories)
  // @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  // user: User;
}
