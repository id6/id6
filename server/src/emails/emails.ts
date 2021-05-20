import { createTransport, SentMessageInfo, TransportOptions } from 'nodemailer';
import { env } from '../env/env';
import { Logger } from '../commons/logger/logger';
import chalk from 'chalk';
import { Options } from 'nodemailer/lib/mailer';

const logger = new Logger('id6.api:emails');

let transporter: {
  /**
   * https://nodemailer.com/message/
   * @param mailOptions
   */
  sendMail(mailOptions: Options): Promise<SentMessageInfo>;
};

if (env.ID6_MAIL_HOST && env.ID6_MAIL_PORT) {
  logger.debug('Emails are configured');
  // https://nodemailer.com/smtp/#general-options
  transporter = createTransport(<TransportOptions>{
    host: env.ID6_MAIL_HOST,
    port: env.ID6_MAIL_PORT,
    auth: env.ID6_MAIL_USERNAME && env.ID6_MAIL_PASSWORD ? {
      user: env.ID6_MAIL_USERNAME,
      pass: env.ID6_MAIL_PASSWORD,
    } : undefined,
    debug: true,
  });
} else {
  logger.warn(`Emails are ${chalk.red('disabled')}, will print to console`);
  transporter = {
    async sendMail(mailOptions: Options): Promise<SentMessageInfo> {
      logger.info('email', JSON.stringify(mailOptions, null, 2));
    },
  };
}

export const emails = transporter;
