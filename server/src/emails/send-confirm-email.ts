import { sendEmail } from './send-email';
import { env } from '../env/env';

interface TemplateVars {
  url: string;
}

export function sendConfirmEmail(to: string, language: string, vars: TemplateVars): Promise<void> {
  return sendEmail(
    [to],
    'Registration',
    'confirm-email',
    language,
    {
      ...vars,
      appName: env.ID6_NAME,
    },
  );
}
