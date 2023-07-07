import { Module } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PgNotifyClient } from 'nestjs-pg-notify';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { PostsResolver } from './posts.resolver';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

import { DiscussionsService } from '../discussions/discussions.service';

import { Post } from './post.model';
import { Discussion } from '../discussions/discussion.model';
import { RelationshipPostFile } from './relationship-post-file.model';
import { File } from '@eten-lab/models';

import { Token } from '../token';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Discussion, RelationshipPostFile, File]),
    ConfigModule,
  ],
  controllers: [PostsController],
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
    PostsResolver,
    PostsService,
    DiscussionsService,
  ],
  exports: [Token.PgNotifyClient, PostsService],
})
export class PostsModule {}
