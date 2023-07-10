import { IsString } from 'class-validator';
import { PayloadDto } from '../../payload.dto';

export class Reaction {
  @IsString()
  reaction_id: string;

  @IsString()
  post_id: string;

  @IsString()
  user_id: string;

  @IsString()
  content: string;
}

export type ReactionDto = PayloadDto<Reaction>;

export type DeletedReaction = {
  discussion_id: string;
  reaction_id: string;
};
