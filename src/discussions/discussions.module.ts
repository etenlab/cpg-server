import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { PgNotifyClient } from 'nestjs-pg-notify';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { DiscussionsResolver } from './discussions.resolver';
import { DiscussionsService } from './discussions.service';
import { DiscussionsController } from './discussions.controller';

import { Discussion } from './discussion.model';
import { Post } from '../posts/post.model';
import { User } from '../users/user.model';
import { Token } from '../token';

@Module({
  imports: [TypeOrmModule.forFeature([Discussion, Post, User]), ConfigModule],
  controllers: [DiscussionsController],
  providers: [
    {
      provide: Token.PgNotifyClient,
      useFactory: (configService: ConfigService): ClientProxy =>
        new PgNotifyClient({
          connection: {
            host: configService.get('DB_HOST'),
            port: configService.get<number>('DB_PORT'),
            database: configService.get('DB_NAME'),
            user: configService.get('DB_USERNAME'),
            password: configService.get('DB_PASSWORD'),
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
