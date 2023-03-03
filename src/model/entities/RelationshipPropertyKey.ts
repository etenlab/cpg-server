import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Relationship } from './Relationship';
import { RelationshipPropertyValue } from './RelationshipPropertyValue';
import { nanoid } from 'nanoid';

@Index('relationship_property_keys_pkey', ['id'], {
  unique: true,
})
@Entity('relationship_property_key', { schema: 'public' })
export class RelationshipPropertyKey {
  constructor() {
    this.id = this.id || nanoid();
    this.updatedAt = this.updatedAt || new Date();
  }

  @Column({ length: 21, primary: true, unique: true, default: () => nanoid() })
  id!: string;

  @Column('character varying', {
    name: 'property_key',
    nullable: true,
    length: 64,
  })
  key!: string | null;

  @ManyToOne(
    () => Relationship,
    (relationships) => relationships.relationshipPropertyKeys,
  )
  @JoinColumn([{ name: 'relationship_id', referencedColumnName: 'id' }])
  relationship!: Relationship;

  @OneToMany(
    () => RelationshipPropertyValue,
    (relationshipPropertyValues) =>
      relationshipPropertyValues.relationshipPropertyKey,
  )
  values!: RelationshipPropertyValue[];

  @Column('timestamp', {
    nullable: false,
    name: 'updated_at',
    default: () => new Date(),
  })
  updatedAt: Date;
}
