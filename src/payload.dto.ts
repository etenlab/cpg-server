import { IsIn, IsObject, ValidateNested } from 'class-validator';

export class PayloadDto<T> {
  @IsIn(['INSERT', 'UPDATE', 'DELETE'])
  readonly operation: string;

  @IsObject()
  @ValidateNested()
  record: T;
}
