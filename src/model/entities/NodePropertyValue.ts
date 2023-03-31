import { nanoid } from 'nanoid';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { NodePropertyKey } from './NodePropertyKey';

@Index('node_property_values_pkey', ['id'], { unique: true })
@Entity('node_property_values', { schema: 'public' })
export class NodePropertyValue {
  constructor() {
    this.id = this.id || nanoid();
    this.updatedAt = this.updatedAt || new Date();
  }

  @Column({ type: 'varchar', length: 21, unique: true, primary: true })
  id!: string;

  @Column('jsonb', { name: 'property_value', nullable: true })
  value!: { value: any } | null;

  @ManyToOne(
    () => NodePropertyKey,
    (nodePropertyKeys) => nodePropertyKeys.value,
  )
  @JoinColumn([{ name: 'node_property_key_id', referencedColumnName: 'id' }])
  nodePropertyKey!: NodePropertyKey;

  @Column({ type: 'varchar', length: 21, name: 'node_property_key_id' })
  nodePropertyKeyId!: string;

  @Column('timestamp', {
    nullable: false,
    name: 'updated_at',
    default: () => new Date(),
  })
  updatedAt: Date;
}
