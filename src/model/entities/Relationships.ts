import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RelationshipPropertyKey } from './RelationshipPropertyKeys';
import { Node } from './Nodes';
import { RelationshipType, RelationshipTypeName } from './RelationshipTypes';
import { nanoid } from 'nanoid';

@Index('relationships_pkey', ['id'], { unique: true })
@Entity('relationships', { schema: 'admin' })
export class Relationship {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'relationship_id' })
  id!: string;

  @Column({ length: 21, unique: true, default: () => nanoid() })
  uuid!: string;

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

  @Column('datetime', { nullable: false, name: 'updated_at' })
  updatedAt: Date;
}
