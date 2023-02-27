import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('emails_sent_pkey', ['emailSentId'], { unique: true })
@Index('emails_sent_message_id_idx', ['messageId'], {})
@Entity('emails_sent', { schema: 'admin' })
export class EmailsSent {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'email_sent_id' })
  emailSentId: string;

  @Column('character varying', { name: 'email', length: 255 })
  email: string;

  @Column('character varying', { name: 'message_id', length: 64 })
  messageId: string;

  @Column('enum', { name: 'type', enum: ['Register', 'PasswordReset'] })
  type: 'Register' | 'PasswordReset';

  @Column('enum', {
    name: 'response',
    nullable: true,
    enum: ['Bounce', 'Complaint', 'Delivery'],
  })
  response: 'Bounce' | 'Complaint' | 'Delivery' | null;

  @Column('timestamp without time zone', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
