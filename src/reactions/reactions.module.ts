import { Module } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PgNotifyClient } from 'nestjs-pg-notify';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReactionsResolver } from './reactions.resolver';

import { ReactionsService } from './reactions.service';

import { ReactionsController } from './reactions.controller';

import { Reaction, Post } from '@eten-lab/models';

import { PostsModule } from '../posts/posts.module';

import { Token } from '../token';

import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [TypeOrmModule.forFeature([Reaction, Post]), PostsModule],
  controllers: [ReactionsController],
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
    ReactionsResolver,
    ReactionsService,
  ],
  exports: [Token.PgNotifyClient],
})
export class ReactionsModule {}
