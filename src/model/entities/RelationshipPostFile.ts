import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Files } from './Files';
import { Posts } from './Posts';

@Index('UQ_c6a631dfec62a6471e1e250162b', ['fileId'], { unique: true })
@Entity('relationship_post_file', { schema: 'admin' })
export class RelationshipPostFile {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'file_id', unique: true })
  fileId: number;

  @OneToOne(() => Files, (files) => files.relationshipPostFile)
  @JoinColumn([{ name: 'file_id', referencedColumnName: 'id' }])
  file: Files;

  @ManyToOne(() => Posts, (posts) => posts.relationshipPostFiles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'post_id', referencedColumnName: 'id' }])
  post: Posts;
}
