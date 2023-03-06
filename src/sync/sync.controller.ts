import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { SyncPayloadEntry, SyncService } from './sync.service';

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
}
