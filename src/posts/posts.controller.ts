import {
  Controller,
  Inject,
  UseFilters,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxy, Payload } from '@nestjs/microservices';
import { PgNotifyEventPattern } from 'nestjs-pg-notify';
import { PubSub } from 'graphql-subscriptions';

import { ExceptionFilter } from '../exception.filter';
import { LoggingInterceptor } from '../logging.interceptor';

import { Token } from '../token';

import { PostsService } from './posts.service';
import { PUB_SUB } from 'src/pubSub.module';

import { PostDto } from './dto/post.dto';
import { RelationshipPostFileDto } from './dto/relationship-post-file.dto';

@Controller()
@UseFilters(ExceptionFilter)
@UseInterceptors(LoggingInterceptor)
export class PostsController {
  constructor(
    @Inject(Token.PgNotifyClient)
    private readonly client: ClientProxy,
    private readonly postsService: PostsService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @PgNotifyEventPattern('post_changed')
  @UsePipes(new ValidationPipe({ transform: true }))
  async onPostChanged(@Payload() payload: PostDto): Promise<void> {
    const { operation } = payload;

    switch (operation) {
      case 'INSERT': {
        const post = await this.postsService.findPost(payload);
        this.pubSub.publish(Token.PostCreated, post);
        break;
      }
      case 'UPDATE': {
        const post = await this.postsService.findPost(payload);
        this.pubSub.publish(Token.PostUpdated, post);
        break;
      }
      case 'DELETE': {
        this.pubSub.publish(Token.PostDeleted, payload);
        break;
      }
      default: {
        break;
      }
    }
  }

  @PgNotifyEventPattern('relationship_post_file_deleted')
  @UsePipes(new ValidationPipe({ transform: true }))
  async onRelationshipPostFileDeleted(
    @Payload() payload: RelationshipPostFileDto,
  ): Promise<void> {
    const { operation, record } = payload;

    switch (operation) {
      case 'DELETE': {
        const post = await this.postsService.findPostById(record.post_id);
        this.pubSub.publish(Token.PostUpdated, post);
      }
    }
  }
}
