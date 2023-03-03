import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

type SyncTableConfig = {
  localTableName: string;
  remoteTableName: string;
  localPK: string;
  columns: {
    local: string;
    // Missing note tyoe means it equels to `local`
    remote?: string;
    convertToLocal?: (remoteValue: any) => any;
    convertToRemote?: (localValue: any) => any;
  }[];
};

function textToJson(value) {
  if (value === null) {
    return null;
  }
  return JSON.parse(value);
}

function jsonToText(value) {
  if (value === null) {
    return null;
  }
  return JSON.stringify(value);
}

// Make sure to have correct order of tables to satisfy foreign key constraints
const tableConfig: SyncTableConfig[] = [
  {
    localTableName: 'node_type',
    remoteTableName: 'node_type',
    localPK: 'type_name',
    columns: [
      {
        local: 'type_name',
      },
    ],
  },
  {
    localTableName: 'node',
    remoteTableName: 'node',
    localPK: 'id',
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
    localTableName: 'node_property_key',
    remoteTableName: 'node_property_key',
    localPK: 'id',
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
    localTableName: 'node_property_value',
    remoteTableName: 'node_property_value',
    localPK: 'id',
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
    localTableName: 'relationship_type',
    remoteTableName: 'relationship_type',
    localPK: 'type_name',
    columns: [
      {
        local: 'type_name',
      },
    ],
  },
  {
    localTableName: 'relationship',
    remoteTableName: 'relationship',
    localPK: 'id',
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
    localTableName: 'relationship_property_key',
    remoteTableName: 'relationship_property_key',
    localPK: 'id',
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
    localTableName: 'relationship_property_value',
    remoteTableName: 'relationship_property_value',
    localPK: 'id',
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

export type TableSyncSchema = {
  pkField: string;
};

export type SyncIncomingEntry = {
  table: string;
  rows: {
    [key: string]: any;
  }[];
};

@Injectable()
export class SyncService {
  constructor(
    @InjectEntityManager()
    private readonly em: EntityManager,
  ) {}

  async syncFromClient(entries: SyncIncomingEntry[]) {
    const sortedEntries = entries.sort((a, b) => {
      const aIndex = tableConfig.findIndex(
        (cfg) => cfg.remoteTableName === a.table,
      );
      const bIndex = tableConfig.findIndex(
        (cfg) => cfg.remoteTableName === b.table,
      );

      return aIndex - bIndex;
    });

    for (const entry of sortedEntries) {
      if (!entry.rows.length) {
        continue;
      }

      await this.em.transaction(async (em) => {
        const remoteTableName = entry.table;

        const config = Object.values(tableConfig).find(
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
            return acc;
          }, {});

          localRows.push(localRow);
        }

        const columnsOrder = Object.keys(localRows[0]);

        await em
          .createQueryBuilder()
          .insert()
          .into(localTableName, columnsOrder)
          .values(localRows)
          .orUpdate(columnsOrder, [localPK], {
            upsertType: 'on-conflict-do-update',
          })
          .execute();
      });
    }
  }
}
