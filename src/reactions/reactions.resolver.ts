import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { Reaction } from '@eten-lab/models';
import { PostsService } from '../posts/posts.service';
import { ReactionsService } from './reactions.service';
import { NewReactionInput } from './new-reaction.input';

import { DeletedReaction } from './dto/reaction.dto';

import { PUB_SUB } from 'src/pubSub.module';
import { Token } from '../token';

@Resolver(() => Reaction)
@Injectable()
export class ReactionsResolver {
  constructor(
    private readonly reactionsService: ReactionsService,
    private readonly postsService: PostsService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Query(() => Reaction)
  async reaction(@Args('id') id: string): Promise<Reaction> {
    const reaction = await this.reactionsService.findById(id);

    if (!reaction) {
      throw new NotFoundException(id);
    }

    return reaction;
  }

  @Query(() => [Reaction])
  async reactionsByPostId(@Args('postId') postId: string): Promise<Reaction[]> {
    const reactions = await this.reactionsService.findReactionsByPostId(postId);

    if (!reactions) {
      return [];
    }

    return reactions;
  }

  @Mutation(() => Reaction)
  async createReaction(
    @Args('newReactionData') newReactionData: NewReactionInput,
  ): Promise<Reaction> {
    const { reaction_id } = await this.reactionsService.create(newReactionData);
    const reaction = await this.reactionsService.findById(reaction_id);

    if (!reaction) {
      throw new NotFoundException(reaction_id);
    }

    return reaction;
  }

  @Mutation(() => Reaction)
  async updateReaction(
    @Args('id') id: string,
    @Args('data') data: NewReactionInput,
    @Args('userId') userId: string,
  ): Promise<Reaction> {
    const reaction = await this.reactionsService.update(id, data, userId);
    return reaction;
  }

  @Mutation(() => Boolean)
  async deleteReaction(@Args('id') id: string, @Args('userId') userId: string) {
    const isDeleted = await this.reactionsService.delete(id, userId);
    return isDeleted;
  }

  @Subscription(() => Reaction, {
    name: Token.ReactionCreated,
    filter: (payload: Reaction, variables) => {
      return payload.post.discussion_id === variables.discussionId;
    },
    resolve: (payload) => payload,
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async subscribeReactionCreated(@Args('discussionId') _discussionId: string) {
    return this.pubSub.asyncIterator(Token.ReactionCreated);
  }

  @Subscription(() => String, {
    name: Token.ReactionDeleted,
    filter: (payload: DeletedReaction, variables) => {
      return payload.discussion_id === variables.discussionId;
    },
    resolve: (payload: DeletedReaction) => payload.reaction_id,
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async subscribeReactionDeleted(@Args('discussionId') _discussionId: string) {
    return this.pubSub.asyncIterator(Token.ReactionDeleted);
  }
}
