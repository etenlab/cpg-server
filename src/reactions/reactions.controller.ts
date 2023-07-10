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

import { PUB_SUB } from '../pubSub.module';
import { Token } from '../token';

import { ReactionDto } from './dto/reaction.dto';
import { ReactionsService } from './reactions.service';

@Controller()
@UseFilters(ExceptionFilter)
@UseInterceptors(LoggingInterceptor)
export class ReactionsController {
  constructor(
    @Inject(Token.PgNotifyClient)
    private readonly client: ClientProxy,
    private readonly reactionsService: ReactionsService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @PgNotifyEventPattern('reaction_changed')
  @UsePipes(new ValidationPipe({ transform: true }))
  async onReactionChanged(@Payload() payload: ReactionDto): Promise<void> {
    const { operation } = payload;

    switch (operation) {
      case 'INSERT': {
        const reaction = await this.reactionsService.findReaction(payload);
        this.pubSub.publish(Token.ReactionCreated, reaction);
        break;
      }
      case 'DELETE': {
        const deletedReaction = await this.reactionsService.findDiscussion(
          payload,
        );
        this.pubSub.publish(Token.ReactionDeleted, deletedReaction);
        break;
      }
      default: {
        break;
      }
    }
  }
}
