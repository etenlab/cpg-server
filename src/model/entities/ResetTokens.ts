import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Users } from './Users';

@Index('reset_tokens_pkey', ['token'], { unique: true })
@Entity('reset_tokens', { schema: 'admin' })
export class ResetTokens {
  @Column('character varying', { primary: true, name: 'token', length: 64 })
  token: string;

  @Column('timestamp without time zone', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => Users, (users) => users.resetTokens)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: Users;
}
