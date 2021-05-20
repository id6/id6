import { sendEmail } from './send-email';
import { env } from '../env/env';

interface TemplateVars {
  url: string;
}

export function sendForgotPassword(to: string, language: string, vars: TemplateVars): Promise<void> {
  return sendEmail(
    [to],
    'Password reset',
    'forgot-password',
    language,
    {
      ...vars,
      appName: env.ID6_NAME,
    },
  );
}
