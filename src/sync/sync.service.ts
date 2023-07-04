import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { DEFAULT_SCHEMA, TableNameConst } from '../constants';
import { ConfigService } from '@nestjs/config';

import * as pako from 'pako';

import { type DatabaseDTO } from './sync.controller';

type SyncTableConfig = {
  localTableName: string;
  remoteTableName: string;
  localPK: string;
  schema: string;
  columns: {
    local: string;
    // Missing note tyoe means it equels to `local`
    remote?: string;
    convertToLocal?: (remoteValue: any) => any;
    convertToRemote?: (localValue: any) => any;
  }[];
};

// Make sure to have correct order of tables to satisfy foreign key constraints
const tableConfigFactory = (
  configService: ConfigService,
): SyncTableConfig[] => {
  const schema = configService.get('DB_SCHEMA') || DEFAULT_SCHEMA;
  return [
    {
      localTableName: TableNameConst.NODE_TYPES,
      remoteTableName: TableNameConst.NODE_TYPES,
      localPK: 'type_name',
      schema,
      columns: [
        { local: 'updated_at' },
        {
          local: 'type_name',
        },
      ],
    },
    {
      localTableName: TableNameConst.NODES,
      remoteTableName: TableNameConst.NODES,
      localPK: 'node_id',
      schema,
      columns: [
        { local: 'updated_at' },
        {
          local: 'node_id',
        },
        {
          local: 'node_type',
        },
      ],
    },
    {
      localTableName: TableNameConst.NODE_PROPERTY_KEYS,
      remoteTableName: TableNameConst.NODE_PROPERTY_KEYS,
      localPK: 'node_property_key_id',
      schema,
      columns: [
        { local: 'updated_at' },
        {
          local: 'node_property_key_id',
        },
        {
          local: 'node_id',
        },
        {
          local: 'property_key',
        },
      ],
    },
    {
      localTableName: TableNameConst.NODE_PROPERTY_VALUES,
      remoteTableName: TableNameConst.NODE_PROPERTY_VALUES,
      localPK: 'node_property_value_id',
      schema,
      columns: [
        { local: 'updated_at' },
        {
          local: 'node_property_value_id',
        },
        {
          local: 'node_property_key_id',
        },
        {
          local: 'property_value',
          // convertToLocal: textToJson,
          // convertToRemote: jsonToText,
        },
      ],
    },
    {
      localTableName: TableNameConst.RELATIONSHIP_TYPES,
      remoteTableName: TableNameConst.RELATIONSHIP_TYPES,
      localPK: 'type_name',
      schema,
      columns: [
        { local: 'updated_at' },
        {
          local: 'type_name',
        },
      ],
    },
    {
      localTableName: TableNameConst.RELATIONSHIPS,
      remoteTableName: TableNameConst.RELATIONSHIPS,
      localPK: 'relationship_id',
      schema,
      columns: [
        { local: 'updated_at' },
        {
          local: 'relationship_id',
        },
        {
          local: 'relationship_type',
        },
        {
          local: 'from_node_id',
        },
        {
          local: 'to_node_id',
        },
      ],
    },
    {
      localTableName: TableNameConst.RELATIONSHIP_PROPERTY_KEYS,
      remoteTableName: TableNameConst.RELATIONSHIP_PROPERTY_KEYS,
      localPK: 'relationship_property_key_id',
      schema,
      columns: [
        { local: 'updated_at' },
        {
          local: 'relationship_property_key_id',
        },
        {
          local: 'relationship_id',
        },
        {
          local: 'property_key',
        },
      ],
    },
    {
      localTableName: TableNameConst.RELATIONSHIP_PROPERTY_VALUES,
      remoteTableName: TableNameConst.RELATIONSHIP_PROPERTY_VALUES,
      localPK: 'relationship_property_value_id',
      schema,
      columns: [
        { local: 'updated_at' },
        {
          local: 'relationship_property_value_id',
        },
        {
          local: 'relationship_property_key_id',
        },
        {
          local: 'property_value',
          // convertToLocal: textToJson,
          // convertToRemote: jsonToText,
        },
      ],
    },
    {
      localTableName: TableNameConst.ELECTION_TYPES,
      remoteTableName: TableNameConst.ELECTION_TYPES,
      localPK: 'type_name',
      schema,
      columns: [
        { local: 'updated_at' },
        {
          local: 'type_name',
        },
      ],
    },
    {
      localTableName: TableNameConst.ELECTIONS,
      remoteTableName: TableNameConst.ELECTIONS,
      localPK: 'election_id',
      schema,
      columns: [
        { local: 'updated_at' },
        {
          local: 'election_id',
        },
        {
          local: 'election_type',
        },
        {
          local: 'election_ref',
        },
        {
          local: 'ref_table_name',
        },
        {
          local: 'candidate_ref_table_name',
        },
        {
          local: 'site_text',
        },
        {
          local: 'site_text_translation',
        },
        {
          local: 'app',
        },
      ],
    },
    {
      localTableName: TableNameConst.CANDIDATES,
      remoteTableName: TableNameConst.CANDIDATES,
      localPK: 'candidate_id',
      schema,
      columns: [
        { local: 'updated_at' },
        {
          local: 'candidate_id',
        },
        {
          local: 'election_id',
        },
        {
          local: 'candidate_ref',
        },
      ],
    },
    {
      localTableName: TableNameConst.VOTES,
      remoteTableName: TableNameConst.VOTES,
      localPK: 'vote_id',
      schema,
      columns: [
        { local: 'updated_at' },
        {
          local: 'vote_id',
        },
        {
          local: 'candidate_id',
        },
        {
          local: 'user_id',
        },
        {
          local: 'vote',
        },
      ],
    },
  ];
};

export type TableSyncSchema = {
  pkField: string;
};

export type SyncPayloadEntry = {
  table: string;
  rows: {
    [key: string]: any;
  }[];
};

@Injectable()
export class SyncService {
  private tableConfig: SyncTableConfig[];
  constructor(
    @InjectEntityManager()
    private readonly em: EntityManager,
    private readonly configService: ConfigService,
  ) {
    this.tableConfig = tableConfigFactory(configService);
  }

  async syncFromClient(entries: SyncPayloadEntry[]) {
    const sortedEntries = entries.sort((a, b) => {
      const aIndex = this.tableConfig.findIndex(
        (cfg) => cfg.remoteTableName === a.table,
      );
      const bIndex = this.tableConfig.findIndex(
        (cfg) => cfg.remoteTableName === b.table,
      );

      return aIndex - bIndex;
    });

    for (const entry of sortedEntries) {
      if (!entry?.rows?.length) {
        continue;
      }

      try {
        await this.em.transaction(async (em) => {
          const remoteTableName = entry.table;

          const config = Object.values(this.tableConfig).find(
            (config) => config.remoteTableName === remoteTableName,
          );

          if (!config) {
            throw new Error(`Cannot find config for table ${entry.table}`);
          }

          const { localTableName, localPK, columns, schema } = config;
          const localRows = [] as any[];

          for (const row of entry.rows) {
            const localRow = Object.entries(row).reduce((acc, [key, value]) => {
              const column = columns.find(
                (column) => (column.remote || column.local) === key,
              );
              if (column) {
                if (column.convertToLocal) {
                  acc[column.local] = column.convertToLocal(value);
                } else {
                  acc[column.local] = value;
                }
              } else {
                console.error(
                  `Cannot find column for key ${key} in the config of table ${entry.table}`,
                );
              }

              acc['updated_at'] = new Date();

              return acc;
            }, {} as any);

            localRows.push(localRow);
          }

          const columnsOrder = Object.keys(localRows[0]);

          const tablePlaceholder =
            'TABLENAME_PLACEHOLDER_123123123123123123123';

          const sql = em
            .createQueryBuilder()
            .insert()
            .into(tablePlaceholder, columnsOrder)
            .values(localRows)
            .orUpdate(columnsOrder, [localPK], {
              upsertType: 'on-conflict-do-update',
            });

          const [query, params] = sql.getQueryAndParameters();
          const qr = query.replace(
            tablePlaceholder,
            `${schema}"."${localTableName}`,
          );

          await em.query(qr, params);
        });
      } catch (err) {
        console.log(err);
      }
    }
  }

  async syncToClient(lastSyncDate: Date | null): Promise<SyncPayloadEntry[]> {
    const result = [] as SyncPayloadEntry[];

    for (const config of this.tableConfig) {
      const { localTableName, columns, remoteTableName, schema } = config;

      let rows: any[] = [];

      try {
        if (lastSyncDate) {
          rows = await this.em.query(
            `SELECT * FROM ${schema}.${localTableName} WHERE updated_at > $1`,
            [lastSyncDate],
          );
        } else {
          rows = await this.em.query(
            `SELECT * FROM ${schema}.${localTableName}`,
          );
        }

        const remoteRows = rows.map((row: any) => {
          return Object.entries(row).reduce((acc, [key, value]) => {
            const column = columns.find((column) => column.local === key);
            if (!column) {
              return acc;
            }

            if (column.convertToRemote) {
              acc[column.remote || column.local] =
                column.convertToRemote(value);
            } else {
              acc[column.remote || column.local] = value;
            }

            return acc;
          }, {} as any);
        });

        if (!remoteRows.length) {
          continue;
        }

        result.push({
          table: remoteTableName,
          rows: remoteRows,
        });
      } catch (err) {
        console.log(err);
      }
    }

    return result;
  }

  async syncToClientViaJson(): Promise<string> {
    const entries = await this.syncToClient(null);

    const resDB: DatabaseDTO = {
      [TableNameConst.NODE_TYPES]: [],
      [TableNameConst.NODES]: [],
      [TableNameConst.NODE_PROPERTY_KEYS]: [],
      [TableNameConst.NODE_PROPERTY_VALUES]: [],
      [TableNameConst.RELATIONSHIP_TYPES]: [],
      [TableNameConst.RELATIONSHIPS]: [],
      [TableNameConst.RELATIONSHIP_PROPERTY_KEYS]: [],
      [TableNameConst.RELATIONSHIP_PROPERTY_VALUES]: [],
      [TableNameConst.ELECTION_TYPES]: [],
      [TableNameConst.ELECTIONS]: [],
      [TableNameConst.CANDIDATES]: [],
      [TableNameConst.VOTES]: [],
    };

    entries.forEach(
      (entry) => (resDB[entry.table as keyof typeof resDB] = entry.rows),
    );

    const currentDate = new Date();

    const compressed = pako.deflate(
      JSON.stringify({
        lastSync: currentDate.toISOString(),
        db: resDB,
      }),
    );

    return Buffer.from(compressed).toString('binary');
  }
}
