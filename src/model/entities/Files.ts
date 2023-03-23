import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { RelationshipPostFile } from './RelationshipPostFile';

@Entity('files', { schema: 'admin' })
@ObjectType()
export class Files {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  @Field(() => Int)
  id: number;

  @Column('character varying', { name: 'file_name' })
  @Field(() => String)
  file_name: string;

  @Column('integer', { name: 'file_size' })
  @Field(() => Int)
  file_size: number;

  @Column('character varying', { name: 'file_type' })
  @Field(() => String)
  file_type: string;

  @Column('character varying', { name: 'file_url' })
  @Field(() => String)
  file_url: string;

  @OneToOne(
    () => RelationshipPostFile,
    (relationshipPostFile) => relationshipPostFile.file,
  )
  relationshipPostFile: RelationshipPostFile;
}
