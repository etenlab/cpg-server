import { Column, Entity, Index } from 'typeorm';

@Index('emails_blocked_pkey', ['email'], { unique: true })
@Entity('emails_blocked', { schema: 'admin' })
export class EmailsBlocked {
  @Column('character varying', { primary: true, name: 'email', length: 255 })
  email: string;

  @Column('timestamp without time zone', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
