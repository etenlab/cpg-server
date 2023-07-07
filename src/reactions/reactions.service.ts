import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NewReactionInput } from './new-reaction.input';
import { Reaction } from './reaction.model';
import { Post } from '../posts/post.model';
import { ReactionDto, DeletedReaction } from './dto/reaction.dto';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectRepository(Reaction)
    private reactionRepository: Repository<Reaction>,
    private postRepository: Repository<Post>,
  ) {}

  async create(data: NewReactionInput): Promise<Reaction> {
    const reaction = await this.reactionRepository.findOne({
      where: {
        user_id: data.user_id,
        post_id: data.post_id,
        content: data.content,
      },
    });

    if (reaction) {
      throw new ConflictException('Already Exists!');
    }

    const newReaction = this.reactionRepository.create(data);

    return await this.reactionRepository.save(newReaction);
  }

  async update(
    id: string,
    data: NewReactionInput,
    user_id: string,
  ): Promise<Reaction> {
    const reaction = await this.reactionRepository.findOneOrFail({
      where: { reaction_id: id },
    });

    if (reaction && reaction.user_id === user_id) {
      await this.reactionRepository.update({ reaction_id: id }, data);

      return this.reactionRepository.findOneOrFail({
        where: { reaction_id: id },
      });
    }

    throw new NotFoundException("You cannot update what you don't own...");
  }

  async findById(id: string): Promise<Reaction> {
    const reaction = await this.reactionRepository.findOne({
      relations: ['user'],
      where: { reaction_id: id },
    });

    if (!reaction) {
      throw new NotFoundException('Not found');
    }

    return reaction;
  }

  async findReactionsByPostId(postId: string): Promise<Reaction[]> {
    const reactions = await this.reactionRepository.find({
      where: { post_id: postId },
    });

    if (!reactions) {
      throw new NotFoundException('Not found');
    }

    return reactions;
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const reaction = await this.reactionRepository.findOne({
      where: {
        reaction_id: id,
        user_id: userId,
      },
    });

    if (!reaction) {
      return false;
    }

    await this.reactionRepository.delete(id);
    return true;
  }

  // Whenever we found changes in Discussion Table, this function is called by conroller,
  // and return a Post.
  async findReaction(payload: ReactionDto): Promise<Reaction> {
    const { operation, record } = payload;

    if (operation !== 'INSERT') {
      return;
    }

    const reaction = await this.reactionRepository.findOne({
      relations: ['user', 'post', 'post.discussion'],
      where: { reaction_id: record.reaction_id },
    });

    if (!reaction) {
      throw new NotFoundException(`Reaction #${record.reaction_id} not found`);
    }

    return reaction;
  }

  async findDiscussion(payload: ReactionDto): Promise<DeletedReaction> {
    const { operation, record } = payload;

    if (operation !== 'DELETE') {
      return;
    }

    const post = await this.postRepository.findOne({
      where: { post_id: record.post_id },
    });

    if (!post) {
      throw new NotFoundException(`Post #${record.post_id} not found`);
    }

    return {
      discussion_id: post.discussion_id,
      reaction_id: record.reaction_id,
    } as DeletedReaction;
  }
}
