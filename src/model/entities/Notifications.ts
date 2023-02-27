import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('notifications', { schema: 'admin' })
export class Notifications {
  @Column('boolean', { name: 'acknowledged', default: () => 'false' })
  acknowledged: boolean;

  @Column('timestamp without time zone', {
    name: 'created_at',
    default: () => 'now()',
  })
  createdAt: Date;

  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'user_id' })
  userId: number;

  @Column('character varying', { name: 'table_name' })
  tableName: string;

  @Column('integer', { name: 'row' })
  row: number;

  @Column('character varying', { name: 'content' })
  content: string;
}
