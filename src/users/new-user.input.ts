import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class NewUserInput {
  @Field()
  kid: string;

  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  first_name: string;

  @Field()
  last_name: string;

  @Field({ nullable: true })
  avatar_url: string;
}
