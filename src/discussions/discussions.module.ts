import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { PgNotifyClient } from 'nestjs-pg-notify';

import { DiscussionsResolver } from './discussions.resolver';
import { DiscussionsService } from './discussions.service';
import { DiscussionsController } from './discussions.controller';

import { Discussion, Post, User } from '@eten-lab/models';

import { Token } from '../token';

import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [TypeOrmModule.forFeature([Discussion, Post, User])],
  controllers: [DiscussionsController],
  providers: [
    {
      provide: Token.PgNotifyClient,
      useFactory: (): ClientProxy =>
        new PgNotifyClient({
          connection: {
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            database: process.env.DB_NAME,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
          },
          strategy: {
            retryInterval: 1_000,
            retryTimeout: Infinity,
          },
        }),
    },
    DiscussionsResolver,
    DiscussionsService,
  ],
  exports: [Token.PgNotifyClient],
})
export class DiscussionsModule {}
