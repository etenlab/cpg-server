import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
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

  @Column({
    type: 'varchar',
    length: 21,
    primary: true,
    unique: true,
  })
  id!: string;

  @Column('varchar', { name: 'property_key' })
  propertyKey!: string;

  @ManyToOne(() => Relationship, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'relationship_id', referencedColumnName: 'id' }])
  relationship!: Relationship;

  @Column({ type: 'varchar', name: 'relationship_id' })
  relationshipId!: string;

  @OneToOne(
    () => RelationshipPropertyValue,
    (relationshipPropertyValue) => relationshipPropertyValue.propertyKey,
  )
  propertyValue!: RelationshipPropertyValue;

  @Column('timestamp', {
    nullable: false,
    name: 'updated_at',
    default: () => new Date(),
  })
  updatedAt: Date;
}
