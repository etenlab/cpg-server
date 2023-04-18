import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Users } from './Users';

@Index('avatars_pkey', ['avatar', 'userId'], { unique: true })
@Index('avatars_avatar_key', ['avatar'], { unique: true })
@Entity('avatars', { schema: 'admin' })
export class Avatars {
  @Column('bigint', { primary: true, name: 'user_id' })
  userId: string;

  @Column('character varying', { primary: true, name: 'avatar', length: 64 })
  avatar: string;

  @Column('character varying', { name: 'url', nullable: true, length: 128 })
  url: string | null;

  @Column('timestamp without time zone', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => Users, (users) => users.avatars)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: Users;
}
