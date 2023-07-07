import { IsDate, IsString, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { PayloadDto } from '../../payload.dto';

class Post {
  @IsString()
  post_id: string;

  @IsString()
  discussion_id: string;

  @IsString()
  reply_id: string;

  @IsString()
  user_id: string;

  @IsString()
  quill_text: string;

  @IsString()
  plain_text: string;

  @IsString()
  postgres_language: string;

  @IsBoolean()
  is_edited: boolean;

  @IsDate()
  @Transform((params) => new Date(params.value))
  created_at: Date;
}

export type PostDto = PayloadDto<Post>;
