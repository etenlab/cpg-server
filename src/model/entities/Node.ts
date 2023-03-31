import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { NodePropertyKey } from './NodePropertyKey';
import { NodeType, NodeTypeName } from './NodeType';
import { Relationship } from './Relationship';
import { nanoid } from 'nanoid';

@Index('nodes_pkey', ['id'], { unique: true })
@Entity('nodes', { schema: 'public' })
export class Node {
  constructor() {
    this.id = this.id || nanoid();
    this.updatedAt = this.updatedAt || new Date();
  }

  @Column({
    type: 'varchar',
    length: 21,
    primary: true,
    unique: true,
  })
  id!: string;

  @ManyToOne(() => NodeType, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'node_type', referencedColumnName: 'name' }])
  type!: NodeType;

  @Column('varchar', { name: 'node_type' })
  typeName!: NodeTypeName;

  @OneToMany(() => NodePropertyKey, (nodePropertyKey) => nodePropertyKey.node)
  propertyKeys!: NodePropertyKey[];

  @OneToMany(() => Relationship, (relationships) => relationships.fromNode)
  outgoingRelationships!: Relationship[];

  @OneToMany(() => Relationship, (relationships) => relationships.toNode)
  incomingRelationships!: Relationship[];

  @Column('timestamp', {
    nullable: false,
    name: 'updated_at',
    default: () => new Date(),
  })
  updatedAt: Date;
}
