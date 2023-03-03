import { nanoid } from 'nanoid';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RelationshipPropertyKey } from './RelationshipPropertyKeys';

@Index('relationship_property_values_pkey', ['id'], {
  unique: true,
})
@Entity('relationship_property_values', { schema: 'admin' })
export class RelationshipPropertyValue {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'relationship_property_value_id',
  })
  id!: string;

  @Column({ length: 21, unique: true, default: () => nanoid() })
  uuid!: string;

  @Column('jsonb', { name: 'property_value', nullable: true })
  value!: { [key: string]: any } | null;

  @ManyToOne(
    () => RelationshipPropertyKey,
    (relationshipPropertyKeys) => relationshipPropertyKeys.values,
  )
  @JoinColumn([
    {
      name: 'relationship_property_key_id',
      referencedColumnName: 'id',
    },
  ])
  relationshipPropertyKey!: RelationshipPropertyKey;

  @Column('datetime', { nullable: false, name: 'updated_at' })
  updatedAt: Date;
}
