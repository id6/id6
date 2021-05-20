import joi from 'joi';
import i18next from 'i18next';

export const STRING_MAX_LENGTH = 255;

export const required = () => ({
  value: true,
  message: i18next.t('commons.forms.validation.required', 'Input is required'),
});

const $email = joi.string().email({ tlds: { allow: false } });

export function validateEmail(value: string): string | undefined {
  const { error } = $email.validate(value);
  return !error ? undefined : i18next.t('commons.forms.validation.email', 'Not a valid email');
}

export function maxLength(l?: number) {
  const max = l ?? STRING_MAX_LENGTH;
  return {
    value: max,
    message: i18next.t('commons.forms.validation.maxLength', 'Max length is {{max}}', { max }),
  };
}

export function minLength(l: number) {
  return {
    value: l,
    message: i18next.t('commons.forms.validation.minLength', 'Min length is {{l}}', { l }),
  };
}
