import { NotFoundException, Injectable, Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { PUB_SUB } from 'src/pubSub.module';
import { Token } from '../token';

import { Discussion } from './discussion.model';

import { DiscussionsService } from './discussions.service';

import { DiscussionInput } from './discussion.input';

import { DiscussionSummary } from './dto/DiscussionSummary';

@Resolver(() => Discussion)
@Injectable()
export class DiscussionsResolver {
  constructor(
    private readonly discussionsService: DiscussionsService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Query(() => Discussion)
  async discussion(
    @Args('id', { type: () => String }) id: string,
  ): Promise<Discussion> {
    const discussion = await this.discussionsService.findOneById(id);

    if (!discussion) {
      throw new NotFoundException(id);
    }

    return discussion;
  }

  @Query(() => [Discussion])
  async discussions(
    @Args('table_name') table_name: string,
    @Args('row_id') row_id: string,
  ): Promise<Discussion[]> {
    const discussions = await this.discussionsService.findWithParams({
      table_name,
      row_id,
    });

    if (!discussions) {
      return [];
    }

    return discussions;
  }

  @Query(() => [DiscussionSummary])
  async getDiscussionsSummaryByUserId(
    @Args('userId') userId: string,
  ): Promise<DiscussionSummary[]> {
    const discussions =
      await this.discussionsService.getDiscussionsSummaryByUserId(userId);
    if (!discussions) {
      return [];
    }
    return discussions;
  }

  @Mutation(() => Discussion)
  async createDiscussion(
    @Args('newDiscussionData') newDiscussionData: DiscussionInput,
  ): Promise<Discussion> {
    const { discussion_id } = await this.discussionsService.create(
      newDiscussionData,
    );
    const discussion = await this.discussionsService.findOneById(discussion_id);

    if (!discussion) {
      throw new NotFoundException(discussion_id);
    }

    return discussion;
  }

  @Mutation(() => Boolean)
  async deleteDiscussion(@Args('id') id: string) {
    return this.discussionsService.delete(id);
  }

  @Subscription(() => Discussion, {
    name: Token.DiscussionCreated,
    filter: (payload: Discussion, variables) => {
      return (
        payload.table_name === variables.table_name &&
        payload.row_id === variables.row_id
      );
    },
    resolve: (payload) => payload,
  })
  async subscribeDiscussionCreated(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Args('table_name') table_name: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Args('row_id') row_id: string,
  ) {
    return this.pubSub.asyncIterator<Discussion>(Token.DiscussionCreated);
  }
}
