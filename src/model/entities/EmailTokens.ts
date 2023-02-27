import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Users } from './Users';

@Index('email_tokens_pkey', ['token'], { unique: true })
@Entity('email_tokens', { schema: 'admin' })
export class EmailTokens {
  @Column('character varying', { primary: true, name: 'token', length: 64 })
  token: string;

  @Column('enum', { name: 'type', enum: ['Confirm', 'Deny'] })
  type: 'Confirm' | 'Deny';

  @Column('timestamp without time zone', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => Users, (users) => users.emailTokens)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: Users;
}
