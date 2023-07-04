import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiQuery } from '@nestjs/swagger';

import * as pako from 'pako';

import { TableNameConst } from '@eten-lab/models';
import { SyncPayloadEntry, SyncService } from './sync.service';

export type DatabaseDTO = {
  [TableNameConst.NODE_TYPES]: unknown[];
  [TableNameConst.NODES]: unknown[];
  [TableNameConst.NODE_PROPERTY_KEYS]: unknown[];
  [TableNameConst.NODE_PROPERTY_VALUES]: unknown[];
  [TableNameConst.RELATIONSHIP_TYPES]: unknown[];
  [TableNameConst.RELATIONSHIPS]: unknown[];
  [TableNameConst.RELATIONSHIP_PROPERTY_KEYS]: unknown[];
  [TableNameConst.RELATIONSHIP_PROPERTY_VALUES]: unknown[];
  [TableNameConst.ELECTION_TYPES]: unknown[];
  [TableNameConst.ELECTIONS]: unknown[];
  [TableNameConst.CANDIDATES]: unknown[];
  [TableNameConst.VOTES]: unknown[];
};

@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post('to-server')
  async syncToServer(@Body() body: SyncPayloadEntry[]) {
    await this.syncService.syncFromClient(body);
  }

  @Get('from-server')
  @ApiQuery({
    name: 'last-sync',
    required: false,
    description: 'ISO date string. If missing, all available data is sent',
  })
  async syncFromServer(@Query('last-sync') lastSync: string | null = null) {
    const lastSyncDate: Date | null = lastSync ? new Date(lastSync) : null;

    const currentDate = new Date();

    const entries = await this.syncService.syncToClient(lastSyncDate);

    return {
      lastSync: currentDate.toISOString(),
      entries,
    };
  }

  @Post('to-server-via-json')
  @UseInterceptors(FileInterceptor('file'))
  async syncToServerViaJson(@UploadedFile() file: Express.Multer.File) {
    const reqDB = JSON.parse(pako.inflate(file.buffer, { to: 'string' }));

    const syncPayloadEntry: SyncPayloadEntry[] = Object.keys(reqDB.db).map(
      (key) => {
        return {
          table: key,
          rows: reqDB.db[key],
        };
      },
    );

    await this.syncService.syncFromClient(syncPayloadEntry);

    return await this.syncService.syncToClientViaJson();
  }

  @Get('from-server-via-json')
  async syncFromServerViaJson(): Promise<string> {
    return await this.syncService.syncToClientViaJson();
  }
}
