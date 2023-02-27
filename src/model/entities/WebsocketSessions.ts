import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Users } from './Users';

@Index('websocket_sessions_user_id_idx', ['userId'], {})
@Index('websocket_sessions_pkey', ['websocketSessionId'], { unique: true })
@Entity('websocket_sessions', { schema: 'admin' })
export class WebsocketSessions {
  @Column('character varying', {
    primary: true,
    name: 'websocket_session_id',
    length: 64,
  })
  websocketSessionId: string;

  @Column('bigint', { name: 'user_id', nullable: true })
  userId: string | null;

  @Column('timestamp without time zone', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('text', { name: 'token' })
  token: string;

  @ManyToOne(() => Users, (users) => users.websocketSessions)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: Users;
}
