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

  @Column({ type: 'varchar', length: 21, primary: true, unique: true })
  id!: string;

  @ManyToOne(
    () => RelationshipType,
    (relationshipTypes) => relationshipTypes.relationships,
  )
  @JoinColumn([{ name: 'relationship_type', referencedColumnName: 'name' }])
  type!: RelationshipType;

  @Column('varchar', { name: 'relationship_type' })
  typeName!: RelationshipTypeName;

  @OneToMany(
    () => RelationshipPropertyKey,
    (relationshipPropertyKeys) => relationshipPropertyKeys.relationship,
  )
  propertyKeys!: RelationshipPropertyKey[];

  @ManyToOne(() => Node, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'from_node_id', referencedColumnName: 'id' }])
  fromNode!: Node;

  @Column('varchar', { name: 'from_node_id' })
  fromNodeId!: string;

  @ManyToOne(() => Node, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'to_node_id', referencedColumnName: 'id' }])
  toNode!: Node;

  @Column('varchar', { name: 'to_node_id' })
  toNodeId!: string;

  @Column('timestamp', {
    nullable: false,
    name: 'updated_at',
    default: () => new Date(),
  })
  updatedAt: Date;
}
