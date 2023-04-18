import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileResolver } from './file.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Files } from '../model/entities/Files';
@Module({
  imports: [TypeOrmModule.forFeature([Files])],
  providers: [FileResolver, FileService],
})
export class FileModule {}
