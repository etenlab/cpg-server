import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DiscussionInput {
  @Field({ nullable: false })
  table_name: string;

  @Field({ nullable: false })
  row_id: string;
}
