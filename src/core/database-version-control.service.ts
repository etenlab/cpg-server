import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { PostgresService } from './postgres.service';
import { ConfigService } from '@nestjs/config';
import { DEFAULT_SCHEMA } from '../constants';

@Injectable()
export class DatabaseVersionControlService {
  private schema: string;
  constructor(
    private pg: PostgresService,
    protected configService: ConfigService,
  ) {
    this.schema = this.configService.get('DB_SCHEMA') || DEFAULT_SCHEMA;
    console.log('Database Version Control');
    this.init();
  }

  async init() {
    const exists = await this.getIsDbInit();

    if (exists) {
      const version = await this.getSchemaVersion();
      console.log('Database schema version:', version);
    } else {
      console.log('Creating database schema');
      await this.toVersion1();
    }

    console.log('Database version check complete');
  }

  async getIsDbInit(): Promise<boolean> {
    const res = await this.pg.pool.query(
      `
      SELECT table_schema FROM information_schema.tables 
      WHERE  table_name   = 'database_version_control';
    `,
      [],
    );
    const existIndex = res.rows.findIndex(
      (r) => r.table_schema === this.schema,
    );

    return existIndex >= 0;
  }

  async getSchemaVersion(): Promise<number> {
    const res = await this.pg.pool.query(
      `
      select version 
      from ${this.schema}.database_version_control 
      order by version 
      desc limit 1;
    `,
      [],
    );

    const version = res.rows.at(0)?.version;

    if (version) {
      return version;
    }

    return 0;
  }

  async toVersion1() {
    // schema
    await this.runSqlFile('./src/core/sql/schema/v1.schema.sql');

    // update db version
    await this.setVersionNumber(1);
  }

  async setVersionNumber(version: number) {
    await this.pg.pool.query(
      `
      insert into ${this.schema}.database_version_control(version) values($1);
    `,
      [version],
    );
  }

  async runSqlFile(path: string) {
    console.log('loading SQL:', path);
    const data = readFileSync(path, 'utf8');
    const processedSqlScript = data.replace(/\$1/g, this.schema);
    const res = await this.pg.pool.query(processedSqlScript, []);
  }
}
