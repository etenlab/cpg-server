import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RelationshipPostFile } from './RelationshipPostFile';

@Entity('files', { schema: 'admin' })
export class Files {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'file_name' })
  fileName: string;

  @Column('integer', { name: 'file_size' })
  fileSize: number;

  @Column('character varying', { name: 'file_type' })
  fileType: string;

  @Column('character varying', { name: 'file_url' })
  fileUrl: string;

  @OneToOne(
    () => RelationshipPostFile,
    (relationshipPostFile) => relationshipPostFile.file,
  )
  relationshipPostFile: RelationshipPostFile;
}
