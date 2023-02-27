import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './Users';

@Index('tokens_token_idx', ['token'], {})
@Index('tokens_user_id_token_idx', ['token', 'userId'], {})
@Index('tokens_pkey', ['tokenId'], { unique: true })
@Entity('tokens', { schema: 'admin' })
export class Tokens {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'token_id' })
  tokenId: string;

  @Column('bigint', { name: 'user_id', nullable: true })
  userId: string | null;

  @Column('timestamp without time zone', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('text', { name: 'token', nullable: true })
  token: string | null;

  @ManyToOne(() => Users, (users) => users.tokens)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: Users;
}
