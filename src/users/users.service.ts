import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

import { SesManagerService } from '../ses-manager/ses-manager.service';

import { User } from '../model/entities';
import { ResetTokens } from 'src/model/entities';

import { NewUserInput } from './new-user.input';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ResetTokens)
    private tokensRepository: Repository<ResetTokens>,
    private ses: SesManagerService,
    private readonly jwtService: JwtService,
  ) {}

  sendResetPasswordMail(tokenData: any, email: string) {
    return this.ses.sendResetPasswordMail(tokenData, email);
  }

  async getResetTokens(user_id: string): Promise<ResetTokens> {
    return await this.tokensRepository.findOne({
      where: {
        user: user_id,
      },
    });
  }

  async generateResetToken(user: any): Promise<ResetTokens> {
    // console.log(user);
    const jwtToken = this.jwtService.sign({
      user: user.id,
      email: user.email,
      exp: 7200,
    });
    try {
      await this.tokensRepository.delete({ user: user.id });
      const resetToken = this.tokensRepository.create({
        user: user.id,
        token: jwtToken,
        createdAt: new Date(),
      });
      return await this.tokensRepository.save(resetToken);
    } catch (error) {
      console.log(error);
    }
  }

  async isTokenValid(token: string) {
    const resetToken = await this.tokensRepository.findOne({
      where: {
        token: token,
      },
    });
    console.log(token);
    console.log(resetToken);
    if (resetToken) {
      const tokenData: any = this.jwtService.decode(resetToken.token);
      console.log(tokenData);
      const dateTime = new Date(resetToken.createdAt);
      dateTime.setSeconds(dateTime.getSeconds() + tokenData.exp);
      console.log(dateTime);
      if (dateTime > new Date()) {
        console.log('valid');
        return resetToken;
      } else {
        console.log('expired');
        return false;
      }
    } else {
      return false;
    }
  }

  async decodeToken(token: string) {
    const resetToken = await this.tokensRepository.findOne({
      where: {
        token: token,
      },
    });
    if (resetToken) {
      const tokenData: any = this.jwtService.decode(resetToken.token);
      if (tokenData.exp < new Date()) {
        return tokenData;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  async deleteToken(token: string) {
    return await this.tokensRepository.delete({
      token: token,
    });
  }

  async create(newUserData: NewUserInput): Promise<User> {
    const exist = await this.getUser({
      kid: newUserData.kid,
      email: newUserData.email,
      username: newUserData.username,
    });

    if (exist) {
      return exist;
    }

    const user = this.userRepository.create(newUserData);

    return await this.userRepository.save(user);
  }

  async update(id: string, newUserData: NewUserInput): Promise<User> {
    const exist = await this.userRepository.findOne({
      where: {
        user_id: id,
      },
    });

    if (!exist) {
      throw new NotFoundException(`Not exists a user having user_id=${id}`);
    }

    await this.userRepository.update(id, {
      user_id: id,
      ...newUserData,
    });

    return await this.userRepository.findOne({
      where: {
        user_id: id,
      },
    });
  }

  async getUser({
    id,
    kid,
    email,
    username,
  }: {
    id?: string;
    kid?: string;
    email?: string;
    username?: string;
  }): Promise<User | null> {
    let exist: User | null = id
      ? await this.userRepository.findOne({
          where: {
            user_id: id,
          },
        })
      : null;

    exist = exist
      ? exist
      : kid
      ? await this.userRepository.findOne({
          where: {
            kid: kid,
          },
        })
      : null;

    exist = exist
      ? exist
      : email
      ? await this.userRepository.findOne({
          where: {
            email: email,
          },
        })
      : null;

    exist = exist
      ? exist
      : username
      ? await this.userRepository.findOne({
          where: {
            username: username,
          },
        })
      : null;

    if (exist) {
      return exist;
    }

    return exist;
  }
}
