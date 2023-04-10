import { Injectable } from '@nestjs/common';
import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import { InjectAws } from 'aws-sdk-v3-nest';

@Injectable()
export class SesManagerService {
  constructor(@InjectAws(SESClient) private readonly sesClient: SESClient) {}

  createResetPasswordMailCommand = (
    toAddress: string,
    fromAddress: string,
    token: string,
  ) => {
    return new SendEmailCommand({
      Destination: {
        /* required */
        CcAddresses: [
          /* more items */
        ],
        ToAddresses: [
          toAddress,
          /* more To-email addresses */
        ],
      },
      Message: {
        /* required */
        Body: {
          /* required */
          Html: {
            Charset: 'UTF-8',
            Data: `
            <p>Click below link to reset your password</p>
            <a href="${process.env.FRONTEND_URL}/reset-password/${token}">Reset Password</a>
            `,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Reset password',
        },
      },
      Source: fromAddress,
      ReplyToAddresses: [
        /* more items */
      ],
    });
  };

  sendResetPasswordMail = async (tokenData: any, email: string) => {
    const sendEmailCommand = this.createResetPasswordMailCommand(
      email,
      process.env.FROM_EMAIL_ADDRESS,
      tokenData.token,
    );

    try {
      return await this.sesClient.send(sendEmailCommand);
    } catch (e) {
      console.error('Failed to send email.');
      return e;
    }
  };
}
