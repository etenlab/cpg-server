import { Body, Controller, Post } from '@nestjs/common';
import { SyncIncomingEntry, SyncService } from './sync.service';

@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post('to-server')
  async syncClient(@Body() body: SyncIncomingEntry[]) {
    await this.syncService.syncFromClient(body);
  }
}
