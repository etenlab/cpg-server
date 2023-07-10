import { InjectRepository } from '@nestjs/typeorm';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { nanoid } from 'nanoid';

import { NewPostInput } from './new-post.input';

import { Post, RelationshipPostFile } from '@eten-lab/models';

import { PostDto } from './dto/post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(RelationshipPostFile)
    private relationshipPostFileRepository: Repository<RelationshipPostFile>,
  ) {}

  async create(data: NewPostInput, files: number[]): Promise<Post> {
    const post = this.postRepository.create(data);
    const savedPost = await this.postRepository.save(post);

    if (!savedPost) {
      throw new NotFoundException(savedPost.post_id);
    }

    await this.relationshipPostFileRepository.upsert(
      files.map((file_id) => ({
        relationship_post_file_id: nanoid(),
        file_id,
        post_id: savedPost.post_id,
      })),
      {
        conflictPaths: ['post_id', 'file_id'],
      },
    );

    return savedPost;
  }

  async update(id: string, data: NewPostInput): Promise<boolean> {
    const post = await this.postRepository.findOneOrFail({
      where: { post_id: id },
    });

    if (!post) {
      throw new NotFoundException(id);
    }

    if (post.user_id !== data.user_id) {
      throw new UnauthorizedException(data.user_id);
    }

    await this.postRepository.update(
      { post_id: id },
      { ...data, is_edited: true },
    );
    return true;
  }

  async findPostById(id: string): Promise<Post> {
    const post = await this.postRepository.findOneOrFail({
      relations: [
        'files',
        'files.file',
        'reply',
        'reply.user',
        'reply.files',
        'user',
        'reactions',
        'reactions.user',
      ],
      where: { post_id: id },
    });

    if (!post) {
      throw new NotFoundException(`Cannot find post id="${id}"`);
    }

    return post;
  }

  async findPostsByDiscussionId(discussionId: string): Promise<Post[]> {
    const posts = await this.postRepository.find({
      relations: [
        'files',
        'files.file',
        'reply',
        'reply.user',
        'reply.files',
        'user',
        'reactions',
        'reactions.user',
      ],
      where: { discussion_id: discussionId },
      order: { created_at: 'ASC' },
    });

    if (!posts) {
      throw new NotFoundException(
        `Posts of discussion #${discussionId} not found`,
      );
    }

    return posts;
  }

  async deleteAttachmentById(
    attachmentId: string,
    postId: string,
  ): Promise<boolean> {
    await this.relationshipPostFileRepository.delete(attachmentId);

    const post = await this.findPostById(postId);

    if (
      post.plain_text.trim() === '' &&
      post.quill_text === '' &&
      post.files.length === 0
    ) {
      await this.delete(postId, post.user_id);
    }

    return true;
  }

  async deletePostsByDiscussionId(discussionId: string): Promise<boolean> {
    await this.postRepository.delete({ discussion_id: discussionId });
    return true;
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const post = await this.postRepository.findOne({
      where: {
        post_id: id,
        user_id: userId,
      },
    });

    if (!post) {
      return false;
    }

    await this.postRepository.delete(id);
    return true;
  }

  async findPost(payload: PostDto): Promise<Post> {
    const { operation, record } = payload;

    if (operation === 'DELETE') {
      return;
    }

    const post = await this.postRepository.findOneOrFail({
      relations: [
        'files',
        'files.file',
        'reply',
        'reply.user',
        'reply.files',
        'user',
        'reactions',
        'reactions.user',
      ],
      where: { post_id: record.post_id },
    });

    if (!post) {
      throw new NotFoundException(`Post #${record.post_id} not found`);
    }

    return post;
  }
}
