import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Relationship } from './Relationships';
import { RelationshipPropertyValue } from './RelationshipPropertyValues';
import { nanoid } from 'nanoid';

@Index('relationship_property_keys_pkey', ['id'], {
  unique: true,
})
@Entity('relationship_property_keys', { schema: 'admin' })
export class RelationshipPropertyKey {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'relationship_property_key_id',
  })
  id!: string;

  @Column({ length: 21, unique: true, default: () => nanoid() })
  uuid!: string;

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
}
