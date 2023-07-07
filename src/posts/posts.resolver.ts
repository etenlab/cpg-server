import {
  NotFoundException,
  ConflictException,
  Injectable,
  Inject,
} from '@nestjs/common';
import {
  Args,
  Int,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { PUB_SUB } from 'src/pubSub.module';
import { Token } from '../token';

import { Post } from './post.model';
import { PostsService } from './posts.service';
import { NewPostInput } from './new-post.input';

import { PostDto } from './dto/post.dto';

@Resolver(() => Post)
@Injectable()
export class PostsResolver {
  constructor(
    private readonly postsService: PostsService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Query(() => Post)
  async post(@Args('id') id: string): Promise<Post> {
    const post = await this.postsService.findPostById(id);

    if (!post) {
      throw new NotFoundException(id);
    }

    return post;
  }

  @Query(() => [Post])
  async postsByDiscussionId(
    @Args('discussionId') discussionId: string,
  ): Promise<Post[]> {
    const posts = await this.postsService.findPostsByDiscussionId(discussionId);

    if (!posts) {
      return [];
    }

    return posts;
  }

  @Mutation(() => Post)
  async createPost(
    @Args('newPostData') newPostData: NewPostInput,
    @Args('files', { type: () => [Int], nullable: 'items' }) files: number[],
  ): Promise<Post> {
    const { post_id } = await this.postsService.create(newPostData, files);

    const post = await this.postsService.findPostById(post_id);

    if (!post) {
      throw new NotFoundException(post_id);
    }

    return post;
  }

  @Mutation(() => Boolean)
  async deleteAttachment(
    @Args('attachmentId') attachmentId: string,
    @Args('post_id') post_id: string,
  ) {
    return await this.postsService.deleteAttachmentById(attachmentId, post_id);
  }

  @Mutation(() => Post)
  async updatePost(
    @Args('id') id: string,
    @Args('data') data: NewPostInput,
  ): Promise<Post> {
    const success = await this.postsService.update(id, data);

    if (!success) {
      throw new ConflictException(id);
    }

    const post = await this.postsService.findPostById(id);

    if (!post) {
      throw new NotFoundException(id);
    }

    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(@Args('id') id: string, @Args('userId') userId: string) {
    const isDeleted = await this.postsService.delete(id, userId);
    return isDeleted;
  }

  @Mutation(() => Boolean)
  async deletePostsByDiscussionId(@Args('discussionId') discussionId: string) {
    return this.postsService.deletePostsByDiscussionId(discussionId);
  }

  @Subscription(() => Post, {
    name: Token.PostCreated,
    filter: (payload, variables) => {
      return payload.discussion_id === variables.discussionId;
    },
    resolve: (payload) => payload,
  })
  async subscribePostCreated(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Args('discussionId') _discussionId: string,
  ) {
    return this.pubSub.asyncIterator(Token.PostCreated);
  }

  @Subscription(() => Post, {
    name: Token.PostUpdated,
    filter: (payload, variables) => {
      return payload.discussion_id === variables.discussionId;
    },
    resolve: (payload) => payload,
  })
  async subscribePostUpdated(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Args('discussionId') _discussionId: string,
  ) {
    return this.pubSub.asyncIterator(Token.PostUpdated);
  }

  @Subscription(() => String, {
    name: Token.PostDeleted,
    filter: (payload, variables) => {
      return payload.record.discussion_id === variables.discussionId;
    },
    resolve: (payload: PostDto) => {
      return payload.record.post_id;
    },
  })
  async subscribePostDeleted(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Args('discussionId') _discussionId: string,
  ) {
    return this.pubSub.asyncIterator(Token.PostDeleted);
  }
}
