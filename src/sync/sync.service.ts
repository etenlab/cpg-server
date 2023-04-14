import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { DEFAULT_SCHEMA } from '../constants';
import { ConfigService } from '@nestjs/config';

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

function textToJson(value: string | null) {
  if (value === null) {
    return null;
  }
  return JSON.parse(value);
}

function jsonToText(value: string | null) {
  if (value === null) {
    return null;
  }
  return JSON.stringify(value);
}

// Make sure to have correct order of tables to satisfy foreign key constraints
const tableConfigFactory = (
  configService: ConfigService,
): SyncTableConfig[] => {
  return [
    {
      localTableName: 'node_types',
      remoteTableName: 'node_types',
      localPK: 'type_name',
      schema: configService.get('DB_SCHEMA') || DEFAULT_SCHEMA,
      columns: [
        {
          local: 'type_name',
        },
      ],
    },
    {
      localTableName: 'nodes',
      remoteTableName: 'nodes',
      localPK: 'id',
      schema: 'admin',
      columns: [
        {
          local: 'id',
        },
        {
          local: 'node_type',
        },
      ],
    },
    {
      localTableName: 'node_property_keys',
      remoteTableName: 'node_property_keys',
      localPK: 'id',
      schema: 'admin',
      columns: [
        {
          local: 'id',
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
      localTableName: 'node_property_values',
      remoteTableName: 'node_property_values',
      localPK: 'id',
      schema: 'admin',
      columns: [
        {
          local: 'id',
        },
        {
          local: 'node_property_key_id',
        },
        {
          local: 'property_value',
          convertToLocal: textToJson,
          convertToRemote: jsonToText,
        },
      ],
    },
    {
      localTableName: 'relationship_types',
      remoteTableName: 'relationship_types',
      localPK: 'type_name',
      schema: 'admin',
      columns: [
        {
          local: 'type_name',
        },
      ],
    },
    {
      localTableName: 'relationships',
      remoteTableName: 'relationships',
      localPK: 'id',
      schema: 'admin',
      columns: [
        {
          local: 'id',
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
      localTableName: 'relationship_property_keys',
      remoteTableName: 'relationship_property_keys',
      localPK: 'id',
      schema: 'admin',
      columns: [
        {
          local: 'id',
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
      localTableName: 'relationship_property_values',
      remoteTableName: 'relationship_property_values',
      localPK: 'id',
      schema: 'admin',
      columns: [
        {
          local: 'id',
        },
        {
          local: 'relationship_property_key_id',
        },
        {
          local: 'property_value',
          convertToLocal: textToJson,
          convertToRemote: jsonToText,
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

      await this.em.transaction(async (em) => {
        const remoteTableName = entry.table;

        const config = Object.values(this.tableConfig).find(
          (config) => config.remoteTableName === remoteTableName,
        );

        if (!config) {
          throw new Error(`Cannot find config for table ${entry.table}`);
        }

        const { localTableName, localPK, columns } = config;
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
                `Cannot find column for key ${key} in table ${entry.table}`,
              );
            }

            acc['updated_at'] = new Date();

            return acc;
          }, {} as any);

          localRows.push(localRow);
        }

        const columnsOrder = Object.keys(localRows[0]);

        const tablePlaceholder = 'TABLENAME_PLACEHOLDER_123123123123123123123';

        const sql = em
          .createQueryBuilder()
          .insert()
          .into(tablePlaceholder, columnsOrder)
          .values(localRows)
          .orUpdate(columnsOrder, [localPK], {
            upsertType: 'on-conflict-do-update',
          });

        const [query, params] = sql.getQueryAndParameters();

        await em.query(query.replace(tablePlaceholder, localTableName), params);
      });
    }
  }

  async syncToClient(lastSyncDate: Date | null): Promise<SyncPayloadEntry[]> {
    const result = [] as SyncPayloadEntry[];

    for (const config of this.tableConfig) {
      const { localTableName, columns, remoteTableName, schema } = config;

      let rows: any[] = [];

      if (lastSyncDate) {
        rows = await this.em.query(
          `SELECT * FROM ${schema}.${localTableName} WHERE updated_at > $1`,
          [lastSyncDate],
        );
      } else {
        rows = await this.em.query(`SELECT * FROM ${schema}.${localTableName}`);
      }

      const remoteRows = rows.map((row: any) => {
        return Object.entries(row).reduce((acc, [key, value]) => {
          const column = columns.find((column) => column.local === key);
          if (!column) {
            return acc;
          }

          if (column.convertToRemote) {
            acc[column.remote || column.local] = column.convertToRemote(value);
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
    }

    return result;
  }
}
