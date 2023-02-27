import { ViewColumn, ViewEntity } from 'typeorm';

// materialized view
@ViewEntity('strongs_dictionary', { synchronize: false, schema: 'public' })
export class StrongsDictionary {
  @ViewColumn({ name: 'node_id' })
  nodeId: string;

  @ViewColumn({ name: 'lemma' })
  lemma!: string;

  @ViewColumn({ name: 'xlit' })
  xlit!: string;

  @ViewColumn({ name: 'pron' })
  pron!: string;

  @ViewColumn({ name: 'derivation' })
  derivation!: string;

  @ViewColumn({ name: 'strongs_def' })
  strongsDef!: string;

  @ViewColumn({ name: 'kjv_def' })
  kjvDef!: string;

  @ViewColumn({ name: 'strongs_id' })
  strongsId!: string;
}
