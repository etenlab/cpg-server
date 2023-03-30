import { Column, Entity, Index, OneToMany } from 'typeorm';
import { NodePropertyKey } from './NodePropertyKey';
import { NodeTypeName } from './NodeType';
import { Relationship } from './Relationship';
import { nanoid } from 'nanoid';

@Index('nodes_pkey', ['id'], { unique: true })
@Entity('node', { schema: 'public' })
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
    nullable: false,
    // This won't work:
    // default: () => nanoid(),
  })
  id!: string;

  @OneToMany(() => NodePropertyKey, (nodePropertyKeys) => nodePropertyKeys.node)
  propertyKeys!: NodePropertyKey[];

  // @ManyToOne(() => NodeType, (nodeTypes) => nodeTypes.nodes)
  // @JoinColumn([{ name: 'node_type', referencedColumnName: 'name' }])
  // type!: NodeType;

  @Column('character varying', { name: 'node_type', length: 32 })
  nodeType!: NodeTypeName;

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
