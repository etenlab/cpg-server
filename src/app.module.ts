import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MulterModule } from '@nestjs/platform-express';

import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { join } from 'path';

import { AwsSdkModule } from 'aws-sdk-v3-nest';
import { SESClient } from '@aws-sdk/client-ses';

import { SesManagerModule } from './ses-manager/ses-manager.module';
import { SesManagerService } from './ses-manager/ses-manager.service';

import { AppController } from './app.controller';
import { SyncController } from './sync/sync.controller';
import { SeedController } from './seed/seed.controller';

import { AppService } from './app.service';
import { SyncService } from './sync/sync.service';
import { SeedService } from './seed/seed.service';

import { CoreModule } from './core/core.module';
import { FileModule } from './file/file.module';
import { PubSubModule } from './pubSub.module';
import { DiscussionsModule } from './discussions/discussions.module';
import { PostsModule } from './posts/posts.module';
import { ReactionsModule } from './reactions/reactions.module';
import { UsersModule } from './users/users.module';

import entities from './model/entities';

import { DEFAULT_SCHEMA } from './constants';

@Module({
  imports: [
    AwsSdkModule.register({
      isGlobal: true,
      client: new SESClient({
        region: 'us-east-2',
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      }),
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: true,
      playground: false,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      subscriptions: {
        'graphql-ws': true,
      },
    }),
    MulterModule.register({}),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        schema: configService.get('DB_SCHEMA') || DEFAULT_SCHEMA,
        entities,
        synchronize: false,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature(entities),
    CoreModule,
    PubSubModule,
    FileModule,
    HttpModule,
    SesManagerModule,
    DiscussionsModule,
    PostsModule,
    ReactionsModule,
    UsersModule,
  ],
  controllers: [AppController, SyncController, SeedController],
  providers: [AppService, SyncService, SeedService, SesManagerService],
  exports: [],
})
export class AppModule {
  constructor(private readonly config: ConfigService) {}
}
