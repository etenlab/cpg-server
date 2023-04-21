import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index } from 'typeorm';
// import { Users } from './Users';

@Index('reset_tokens_pkey', ['token'], { unique: true })
@Entity('reset_tokens', { schema: 'admin' })
@ObjectType()
export class ResetTokens {
  @Column('varchar', { primary: true, name: 'token', length: 250 })
  @Field(() => String)
  token: string;

  @Column('timestamp without time zone', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @Field(() => Date)
  createdAt: Date;

  @Column('varchar', {
    name: 'user_id',
  })
  @Field(() => String)
  user: string;
}
