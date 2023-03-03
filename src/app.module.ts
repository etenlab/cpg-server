import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SyncService } from './sync/sync.service';
import { SyncController } from './sync/sync.controller';
import { MigrationService } from './migration/migration.service';
import entities from './model/entities';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        schema: configService.get('DB_SCHEMA') || 'public',
        entities,
        synchronize: false,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature(entities),
    HttpModule,
  ],
  controllers: [AppController, SyncController],
  providers: [AppService, SyncService, MigrationService],
  // entities: [ProgressBibleLanguageDetail],
  exports: [],
})
export class AppModule {
  constructor(private readonly config: ConfigService) {}
}
