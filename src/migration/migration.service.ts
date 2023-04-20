import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { EntityManager } from 'typeorm';

@Injectable()
export class MigrationService {
  constructor(
    @InjectEntityManager()
    private readonly em: EntityManager,
  ) {
    this.migrate().catch((err) => {
      console.error(`Cannot migrate:`);
      console.error(err);

      process.exit(1);
    });
  }

  async migrate() {
    // placeholder for a migration system
  }
}
