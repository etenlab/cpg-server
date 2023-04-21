import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('uf_langnames_pkey', ['id'], { unique: true })
@Entity('uf_langnames', { schema: 'public' })
export class UfLangnames {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id!: string;

  @Column('varchar', { name: 'code', nullable: true, length: 100 })
  code!: string | null;

  @Column('varchar', { name: 'name', nullable: true, length: 200 })
  name!: string | null;
}
