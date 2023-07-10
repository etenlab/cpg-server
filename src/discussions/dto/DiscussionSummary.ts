import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DiscussionSummary {
  @Field()
  readonly discussion_id: string;

  @Field()
  readonly table_name: string;

  @Field()
  readonly row_id: string;

  @Field(() => Int)
  readonly total_posts: number;
}
