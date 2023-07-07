import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class NewReactionInput {
  @Field()
  post_id: string;

  @Field()
  user_id: string;

  @Field()
  content: string;
}
