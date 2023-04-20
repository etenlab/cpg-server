import { Column, Entity } from 'typeorm';

@Entity('typeorm_metadata', { schema: 'public' })
export class TypeormMetadata {
  @Column('varchar', { name: 'type', length: 255 })
  type!: string;

  @Column('varchar', {
    name: 'database',
    nullable: true,
    length: 255,
    default: () => 'NULL::varchar',
  })
  database!: string | null;

  @Column('varchar', {
    name: 'schema',
    nullable: true,
    length: 255,
    default: () => 'NULL::varchar',
  })
  schema!: string | null;

  @Column('varchar', {
    name: 'table',
    nullable: true,
    length: 255,
    default: () => 'NULL::varchar',
  })
  table!: string | null;

  @Column('varchar', {
    name: 'name',
    nullable: true,
    length: 255,
    default: () => 'NULL::varchar',
  })
  name!: string | null;

  @Column('text', { name: 'value', nullable: true })
  value!: string | null;
}
