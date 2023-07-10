import { IsString, IsNumber } from 'class-validator';
import { PayloadDto } from '../../payload.dto';

class RelationshipPostFile {
  @IsString()
  relationship_post_file_id: string;

  @IsString()
  post_id: string;

  @IsNumber()
  file_id: number;
}

export type RelationshipPostFileDto = PayloadDto<RelationshipPostFile>;
