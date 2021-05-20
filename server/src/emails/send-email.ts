import path from 'path';
import { promises } from 'fs';
import { AppError } from '../commons/errors/app-error';
import { emails } from './emails';
import { compile, TemplateDelegate } from 'handlebars';
import { env } from '../env/env';
import { Logger } from '../commons/logger/logger';
import { ErrorCode } from '@id6/commons/build/error-code';

const logger = new Logger('id6.api:sendEmailTemplate');

export async function sendEmail(
  to: string[],
  subject: string,
  templateName: string,
  language: string,
  templateVariables: { [key: string]: any },
): Promise<void> {
  const templatePath = path.resolve(env.ID6_MAIL_TEMPLATE_DIR, language, `${templateName}.hbs`);

  let stat: any;
  try {
    stat = await promises.stat(templatePath);
  } catch (e) {
    logger.error(e);
  }

  if (!stat) {
    throw new AppError(`Unknown template ${templateName}`, ErrorCode.unkown_email_template, { name: templateName });
  }

  const template: string = (await promises.readFile(templatePath)).toString();

  const compiledTemplate: TemplateDelegate = compile(template);
  const text = compiledTemplate(templateVariables);

  await Promise.all(
    to.map(async email => {
      await emails.sendMail({
        from: env.ID6_MAIL_FROM,
        to: email,
        subject: `${env.ID6_MAIL_SUBJECT_PREFIX} ${subject}`,
        text,
      });
    }),
  );
}
