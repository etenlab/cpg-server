import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { join } from 'path';

import { AppController } from './app.controller';
import { SyncController } from './sync/sync.controller';
import { SeedController } from './seed/seed.controller';

import { AppService } from './app.service';
import { SyncService } from './sync/sync.service';
import { MigrationService } from './migration/migration.service';
import { SeedService } from './seed/seed.service';

import { CoreModule } from './core/core.module';
import { FileModule } from './file/file.module';

import entities from './model/entities';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: true,
      playground: false,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
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
    CoreModule,
    FileModule,
    HttpModule,
  ],
  controllers: [AppController, SyncController, SeedController],
  providers: [AppService, SyncService, MigrationService, SeedService],
  // entities: [ProgressBibleLanguageDetail],
  exports: [],
})
export class AppModule {
  constructor(private readonly config: ConfigService) {}
}
