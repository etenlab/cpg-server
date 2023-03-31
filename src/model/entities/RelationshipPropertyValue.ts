import { nanoid } from 'nanoid';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { RelationshipPropertyKey } from './RelationshipPropertyKey';

@Index('relationship_property_values_pkey', ['id'], {
  unique: true,
})
@Entity('relationship_property_values', { schema: 'public' })
export class RelationshipPropertyValue {
  constructor() {
    this.id = this.id || nanoid();
    this.updatedAt = this.updatedAt || new Date();
  }

  @Column({
    type: 'character varying',
    length: 21,
    primary: true,
    unique: true,
  })
  id!: string;

  @Column('jsonb', { name: 'property_value', nullable: true })
  value!: { [key: string]: any } | null;

  @ManyToOne(
    () => RelationshipPropertyKey,
    (relationshipPropertyKeys) => relationshipPropertyKeys.propertyValue,
  )
  @JoinColumn([
    {
      name: 'property_key_id',
      referencedColumnName: 'id',
    },
  ])
  propertyKey!: RelationshipPropertyKey;

  @Column('varchar', { name: 'property_key_id' })
  propertyKeyId!: string;

  @Column('timestamp', {
    nullable: false,
    name: 'updated_at',
    default: () => new Date(),
  })
  updatedAt: Date;
}
