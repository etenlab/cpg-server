import { Column, Entity, Index } from 'typeorm';

@Index('node_types_pkey', ['name'], { unique: true })
@Entity('node_types', { schema: 'public' })
export class NodeType {
  constructor() {
    this.updatedAt = this.updatedAt || new Date();
  }

  @Column('character varying', {
    primary: true,
    name: 'type_name',
    length: 32,
    unique: true,
  })
  name!: NodeTypeName;

  @Column('timestamp', {
    nullable: false,
    name: 'updated_at',
    default: () => new Date(),
  })
  updatedAt: Date;
}

export enum NodeTypeName {
  WORD = 'word',
  ADDITION = 'addition',
  WORD_SEQUENCE = 'word-sequence',
  SENTENCE = 'sentence',
  VERSE = 'verse',
  PARAGRAPH = 'paragraph',
  SECTION = 'section',
  CHAPTER = 'chapter',
  BOOK = 'book',
  BIBLE = 'bible',
  DEFINITION = 'definition',
  ARTICLE = 'article',
  LEXICAL_ENTRY = 'lexical-entry',
  STRONGS_ENTRY = 'strongs-entry',
  MAP = 'map',
  LANGUAGE = 'language',
  WORD_TO_LANG = 'word-to-language-entry',
  WORD_TO_TRANSLATION = 'word-to-translation',
  WORD_MAP = 'word-map',
  MAP_LANG = 'map-language',
}
