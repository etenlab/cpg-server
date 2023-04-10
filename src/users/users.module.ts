import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { Users } from 'src/model/entities';
import { ResetTokens } from 'src/model/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SesManagerService } from 'src/ses-manager/ses-manager.service';
import { AwsSdkModule } from 'aws-sdk-v3-nest';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, ResetTokens]),
    AwsSdkModule,
    JwtModule.register({ secret: process.env.JWT_KEY }),
  ],
  providers: [UsersResolver, UsersService, SesManagerService],
})
export class UsersModule {}
