import { Module } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PgNotifyClient } from 'nestjs-pg-notify';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ReactionsResolver } from './reactions.resolver';

import { ReactionsService } from './reactions.service';

import { ReactionsController } from './reactions.controller';

import { Reaction } from './reaction.model';

import { PostsModule } from '../posts/posts.module';

import { Token } from '../token';

@Module({
  imports: [TypeOrmModule.forFeature([Reaction]), PostsModule, ConfigModule],
  controllers: [ReactionsController],
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
    ReactionsResolver,
    ReactionsService,
  ],
  exports: [Token.PgNotifyClient],
})
export class ReactionsModule {}
