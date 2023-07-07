import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import * as querystring from 'qs';
import axios from 'axios';
import { NotFoundError } from 'rxjs';

import { UsersService } from './users.service';

import { decodeToken, isTokenValid } from 'src/utils/AuthUtils';

import { User, ResetTokens } from 'src/model/entities';

import { NewUserInput } from './new-user.input';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => ResetTokens)
  async forgotPassword(
    @Args({ name: 'email', type: () => String }) email: string,
  ): Promise<any> {
    let kcUserId = '';
    let errorMessage = '';
    try {
      await axios
        .post(
          `${process.env.KEYCLOAK_URL}/realms/master/protocol/openid-connect/token`,
          querystring.stringify({
            client_id: 'admin-cli', //process.env.KEYCLOAK_CLIENT_ID,
            client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
            grant_type: 'client_credentials', //'password'
          }),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        )
        .then(async (response) => {
          try {
            await axios
              .get(
                `${process.env.KEYCLOAK_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users`,
                {
                  params: {
                    email: email,
                  },
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${response.data.access_token}`,
                  },
                },
              )
              .then(async (resp: any) => {
                if (!resp.data.length) {
                  errorMessage = 'Email address not found';
                } else {
                  kcUserId = resp.data[0].id;
                  const tokenData = await this.usersService.generateResetToken(
                    resp.data[0],
                  );
                  await this.usersService.sendResetPasswordMail(
                    tokenData,
                    email,
                  );
                }
              });
          } catch (error: any) {
            errorMessage = error.message;
            throw new NotFoundError('Error' + error.message);
          }
        });
    } catch (error: any) {
      errorMessage = error.message;
      throw new NotFoundError('Error' + error.message);
    }
    if (kcUserId) {
      return await this.usersService.getResetTokens(kcUserId);
    } else {
      throw new NotFoundError(errorMessage);
    }
  }

  @Query(() => ResetTokens)
  async isTokenValid(
    @Args({ name: 'token', type: () => String }) token: string,
  ): Promise<any> {
    const resetToken = await this.usersService.isTokenValid(token);
    if (resetToken) {
      return resetToken;
    } else {
      throw new NotFoundError('Token invalid or expired');
    }
  }

  @Mutation(() => Boolean)
  async resetUserPassword(
    @Args({ name: 'token', type: () => String }) token: string,
    @Args({ name: 'password', type: () => String }) password: string,
  ): Promise<any> {
    const tokenData: any = await this.usersService.decodeToken(token);
    let status = false;
    if (tokenData) {
      try {
        await axios
          .post(
            `${process.env.KEYCLOAK_URL}/realms/master/protocol/openid-connect/token`,
            querystring.stringify({
              client_id: 'admin-cli', //process.env.KEYCLOAK_CLIENT_ID,
              client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
              grant_type: 'client_credentials', //'password'
            }),
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            },
          )
          .then(async (response) => {
            try {
              await axios
                .put(
                  `${process.env.KEYCLOAK_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users/${tokenData.user}/reset-password`,
                  JSON.stringify({
                    temporary: false,
                    type: 'password',
                    value: password,
                  }),
                  {
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${response.data.access_token}`,
                    },
                  },
                )
                .then(async () => {
                  await this.usersService.deleteToken(token);
                  status = true;
                });
            } catch (error: any) {
              throw new NotFoundError(
                'Token invalid or expired: ' + error.message,
              );
            }
          })
          .catch((error: any) => {
            throw new NotFoundError(
              'Token invalid or expired: ' + error.message,
            );
          });
      } catch (error) {}
    }
    if (status) {
      return true;
    } else {
      throw new NotFoundError('Token invalid or expired');
    }
  }

  @Mutation(() => Boolean)
  async updatePassword(
    @Args({ name: 'token', type: () => String }) token: string,
    @Args({ name: 'password', type: () => String }) password: string,
  ): Promise<any> {
    let status = false;
    const tokenData: any = decodeToken(token);
    if (isTokenValid(tokenData)) {
      try {
        await axios
          .post(
            `${process.env.KEYCLOAK_URL}/realms/master/protocol/openid-connect/token`,
            querystring.stringify({
              client_id: 'admin-cli', //process.env.KEYCLOAK_CLIENT_ID,
              client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
              grant_type: 'client_credentials', //'password'
            }),
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            },
          )
          .then(async (response) => {
            try {
              await axios
                .put(
                  `${process.env.KEYCLOAK_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users/${tokenData.sub}/reset-password`,
                  JSON.stringify({
                    temporary: false,
                    type: 'password',
                    value: password,
                  }),
                  {
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${response.data.access_token}`,
                    },
                  },
                )
                .then(async () => {
                  status = true;
                });
            } catch (error: any) {
              throw new NotFoundError(
                'Token invalid or expired: ' + error.message,
              );
            }
          })
          .catch((error: any) => {
            throw new NotFoundError(
              'Token invalid or expired: ' + error.message,
            );
          });
      } catch (error: any) {
        throw new NotFoundError('Token invalid or expired: ' + error.message);
      }
      return status;
    }
  }

  @Mutation(() => User)
  async createUser(
    @Args('newUserData') newUserData: NewUserInput,
  ): Promise<User> {
    const user = await this.usersService.create(newUserData);
    return user;
  }

  @Query(() => User)
  async getUserFromEmail(@Args('email') email: string): Promise<User> {
    const user = await this.usersService.getUserFromEmail(email);
    return user;
  }

  @Query(() => User)
  async getUserFromName(@Args('name') name: string): Promise<User> {
    const user = await this.usersService.getUserFromName(name);
    return user;
  }
}
