import { IsString } from 'class-validator';
import { PayloadDto } from '../../payload.dto';

class Discussion {
  @IsString()
  discussion_id: string;

  @IsString()
  table_name: string;

  @IsString()
  row_id: string;
}

export type DiscussionDto = PayloadDto<Discussion>;
