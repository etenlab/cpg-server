import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Node } from './Node';
import { NodePropertyValue } from './NodePropertyValue';
import { nanoid } from 'nanoid';

@Index('node_property_keys_pkey', ['id'], { unique: true })
@Entity('node_property_key', { schema: 'public' })
export class NodePropertyKey {
  constructor() {
    this.id = this.id || nanoid();
    this.updatedAt = this.updatedAt || new Date();
  }

  @Column({ length: 21, primary: true, unique: true, nullable: false })
  id!: string;

  @Column('character varying', {
    name: 'property_key',
    nullable: true,
    length: 64,
  })
  key!: string | null;

  @ManyToOne(() => Node, (nodes) => nodes.propertyKeys)
  @JoinColumn([{ name: 'node_id', referencedColumnName: 'id' }])
  node!: Node;

  @OneToOne(
    () => NodePropertyValue,
    (nodePropertyValues) => nodePropertyValues.nodePropertyKey,
  )
  value!: NodePropertyValue;

  @Column('timestamp', {
    nullable: false,
    name: 'updated_at',
    default: () => new Date(),
  })
  updatedAt: Date;
}
