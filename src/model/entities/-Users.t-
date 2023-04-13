import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Avatars } from './Avatars';
import { AvatarsHistory } from './AvatarsHistory';
import { EmailTokens } from './EmailTokens';
// import { Posts } from './Posts';
import { Reactions } from './Reactions';
import { ResetTokens } from './ResetTokens';
import { Tokens } from './Tokens';
import { WebsocketSessions } from './WebsocketSessions';

@Index('users_email_key', ['email'], { unique: true })
@Index('users_pkey', ['id'], { unique: true })
@Index('users_username_key', ['username'], { unique: true })
@Entity('users', { schema: 'admin' })
export class Users {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'user_id' })
  id: string;

  @Column('boolean', { name: 'active', default: () => 'true' })
  active: boolean;

  @Column('character varying', { name: 'email', unique: true, length: 255 })
  email: string;

  @Column('character varying', { name: 'username', unique: true, length: 255 })
  username: string;

  @Column('boolean', { name: 'is_email_verified', default: () => 'false' })
  isEmailVerified: boolean;

  @Column('character varying', { name: 'password', length: 128 })
  password: string;

  @Column('timestamp without time zone', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @OneToMany(() => Avatars, (avatars) => avatars.user)
  avatars: Avatars[];

  @OneToMany(() => AvatarsHistory, (avatarsHistory) => avatarsHistory.user)
  avatarsHistories: AvatarsHistory[];

  @OneToMany(() => EmailTokens, (emailTokens) => emailTokens.user)
  emailTokens: EmailTokens[];

  // @OneToMany(() => Posts, (posts) => posts.user)
  // posts: Posts[];

  @OneToMany(() => Reactions, (reactions) => reactions.user)
  reactions: Reactions[];

  @OneToMany(() => ResetTokens, (resetTokens) => resetTokens.user)
  resetTokens: ResetTokens[];

  @OneToMany(() => Tokens, (tokens) => tokens.user)
  tokens: Tokens[];

  @OneToMany(
    () => WebsocketSessions,
    (websocketSessions) => websocketSessions.user,
  )
  websocketSessions: WebsocketSessions[];
}
