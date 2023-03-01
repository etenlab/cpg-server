import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

export type TableSyncSchema = {
  pkField: string;
};

@Injectable()
export class SyncService {
  constructor(
    @InjectEntityManager()
    private readonly em: EntityManager,
  ) {}
}
