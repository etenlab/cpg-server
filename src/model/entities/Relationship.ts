import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { RelationshipPropertyKey } from './RelationshipPropertyKey';
import { Node } from './Node';
import { RelationshipType, RelationshipTypeName } from './RelationshipType';
import { nanoid } from 'nanoid';

@Index('relationships_pkey', ['id'], { unique: true })
@Entity('relationship', { schema: 'public' })
export class Relationship {
  constructor() {
    this.id = this.id || nanoid();
    this.updatedAt = this.updatedAt || new Date();
  }

  @Column({ length: 21, primary: true, unique: true, default: () => nanoid() })
  id!: string;

  @OneToMany(
    () => RelationshipPropertyKey,
    (relationshipPropertyKeys) => relationshipPropertyKeys.relationship,
  )
  relationshipPropertyKeys!: RelationshipPropertyKey[];

  @ManyToOne(() => Node, (nodes) => nodes.outgoingRelationships)
  @JoinColumn([{ name: 'from_node_id', referencedColumnName: 'id' }])
  fromNode!: Node;

  @ManyToOne(
    () => RelationshipType,
    (relationshipTypes) => relationshipTypes.relationships,
  )
  @JoinColumn([{ name: 'relationship_type', referencedColumnName: 'name' }])
  type!: RelationshipType;

  @Column('character varying', { name: 'relationship_type', length: 32 })
  typeName!: RelationshipTypeName;

  @ManyToOne(() => Node, (nodes) => nodes.incomingRelationships)
  @JoinColumn([{ name: 'to_node_id', referencedColumnName: 'id' }])
  toNode!: Node;

  @Column('timestamp', {
    nullable: false,
    name: 'updated_at',
    default: () => new Date(),
  })
  updatedAt: Date;
}
