import { Module } from '@nestjs/common';
import { SesManagerService } from './ses-manager.service';
// import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import { AwsSdkModule } from 'aws-sdk-v3-nest';

@Module({
  imports: [AwsSdkModule],
  providers: [SesManagerService],
  exports: [SesManagerService],
})
export class SesManagerModule {}
