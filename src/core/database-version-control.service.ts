import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { PostgresService } from './postgres.service';

@Injectable()
export class DatabaseVersionControlService {
  constructor(private pg: PostgresService) {
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
      SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE  table_name   = 'database_version_control');
    `,
      [],
    );

    return res.rows[0].exists;
  }

  async getSchemaVersion(): Promise<number> {
    const res = await this.pg.pool.query(
      `
      select version 
      from database_version_control 
      order by version 
      desc limit 1;
    `,
      [],
    );

    const version = res.rows[0].version;

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
      insert into database_version_control(version) values($1);
    `,
      [version],
    );
  }

  async runSqlFile(path: string) {
    console.log('loading SQL:', path);
    const data = readFileSync(path, 'utf8');
    await this.pg.pool.query(data, []);
  }
}
