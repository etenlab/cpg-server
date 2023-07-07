import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { Discussion } from './discussion.model';
import { Post } from '../posts/post.model';

import { DiscussionInput } from './discussion.input';
import { DiscussionSummary } from './dto/DiscussionSummary';

import { DiscussionDto } from './dto/discussion.dto';

@Injectable()
export class DiscussionsService {
  constructor(
    @InjectRepository(Discussion)
    private discussionRepository: Repository<Discussion>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async create(data: DiscussionInput): Promise<Discussion> {
    const discussion = await this.discussionRepository.findOne({
      where: {
        table_name: data.table_name,
        row_id: data.row_id,
      },
    });

    if (discussion) {
      return discussion;
    }

    const newDiscussion = this.discussionRepository.create({
      table_name: data.table_name,
      row_id: data.row_id,
    });

    return await this.discussionRepository.save(newDiscussion);
  }

  async findOneById(discussionId: string): Promise<Discussion> {
    const discussion = this.discussionRepository.findOne({
      relations: [
        'posts',
        'posts.user',
        'posts.reply',
        'posts.reply.user',
        'posts.reply.files',
        'posts.reactions',
        'posts.reactions.user',
        'posts.files',
        'posts.files.file',
      ],
      where: { discussion_id: discussionId },
    });

    if (!discussion) {
      throw new NotFoundException(`Discussion #${discussionId} not found`);
    }

    return discussion;
  }

  async findWithParams({
    table_name,
    row_id,
  }: {
    table_name: string;
    row_id: string;
  }): Promise<Discussion[]> {
    const discussions = this.discussionRepository.find({
      relations: [
        'posts',
        'posts.user',
        'posts.reply',
        'posts.reply.user',
        'posts.reply.files',
        'posts.reactions',
        'posts.reactions.user',
        'posts.files',
        'posts.files.file',
        'appList',
        'organization',
      ],
      order: {
        posts: {
          created_at: 'ASC',
        },
      },
      where: {
        table_name: table_name,
        row_id: row_id,
      },
    });

    if (!discussions) {
      throw new NotFoundException(
        `Discussion not found by table name#${table_name}, row#${row_id}`,
      );
    }

    return discussions;
  }

  async getDiscussionsSummaryByUserId(
    userId: string,
  ): Promise<DiscussionSummary[]> {
    const discussionIds = await this.postRepository
      .createQueryBuilder()
      .select('count(discussion_id) as total_posts, discussion_id')
      .where('user_id = :userId', {
        userId,
      })
      .groupBy('discussion_id')
      .execute();

    const discussions = await this.discussionRepository.findBy({
      discussion_id: In([
        ...discussionIds.map(
          (item: { total_posts: number; discussion_id: string }) =>
            item.discussion_id,
        ),
      ]),
    });

    // Following code will cause performance issue, should be updated.
    // I (hiroshi) am going to use this approach because we are in v2 step.
    return discussions.map((discussion) => {
      const total_posts = discussionIds.find(
        (item: { total_posts: number; discussion_id: string }) =>
          item.discussion_id === discussion.discussion_id,
      ).total_posts;

      return {
        discussion_id: discussion.discussion_id,
        table_name: discussion.table_name,
        row_id: discussion.row_id,
        total_posts,
      } as DiscussionSummary;
    });
  }

  async delete(id: string): Promise<boolean> {
    await this.discussionRepository.delete({ discussion_id: id });
    return true;
  }

  async findDiscussion(payload: DiscussionDto): Promise<Discussion> {
    const { operation, record } = payload;

    if (operation !== 'INSERT') {
      return;
    }

    const discussion = await this.discussionRepository.findOne({
      relations: [
        'posts',
        'posts.user',
        'posts.reply',
        'posts.reply.user',
        'posts.reply.files',
        'posts.reactions',
        'posts.reactions.user',
        'posts.files',
        'posts.files.file',
        'appList',
        'organization',
      ],
      where: { discussion_id: record.discussion_id },
    });

    if (!discussion) {
      throw new NotFoundException(
        `Discussion #${record.discussion_id} not found`,
      );
    }

    return discussion;
  }
}
