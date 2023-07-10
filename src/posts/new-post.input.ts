import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class NewPostInput {
  @Field()
  discussion_id: string;

  @Field()
  user_id: string;

  @Field()
  quill_text: string;

  @Field()
  plain_text: string;

  @Field({ nullable: false, defaultValue: 'simple' })
  postgres_language: string;

  @Field({ nullable: true })
  reply_id: string;
}
