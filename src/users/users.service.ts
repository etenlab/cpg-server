import { Injectable } from '@nestjs/common';
import { User } from '../model/entities';
import { ResetTokens } from 'src/model/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SesManagerService } from '../ses-manager/ses-manager.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
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
}
