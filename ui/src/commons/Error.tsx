import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Trans, useTranslation } from 'react-i18next';
import { ErrorCode } from '@id6/commons/build/error-code';

function CustomError({ message, code, details }: {
  message: string;
  code: ErrorCode;
  details: any;
}) {
  const { t } = useTranslation();
  switch (code) {
    case ErrorCode.email_not_confirmed:
      return (
        <Trans i18nKey="errors.email_not_confirmed">
          Email not confirmed. We can <Link to="/email/confirm/send">resend a confirmation link</Link>
        </Trans>
      )
    case ErrorCode.not_authenticated:
      return <>{t('errors.not_authenticated', 'Not authenticated')}</>
    case ErrorCode.invalid_token:
      return <>{t('errors.invalid_token', 'Invalid token')}</>
    case ErrorCode.user_not_found:
      return <>{t('errors.user_not_found', 'User not found')}</>
    case ErrorCode.no_token_provided:
      return <>{t('errors.no_token_provided', 'No token provided')}</>
    case ErrorCode.picture_not_set:
      return <>{t('errors.picture_not_set', 'Picture not set')}</>
    case ErrorCode.email_in_use:
      return <>{t('errors.email_in_use', 'Email in use')}</>
    case ErrorCode.email_already_confirmed:
      return <>{t('errors.email_already_confirmed', 'Email already confirmed')}</>
    case ErrorCode.token_expired:
      return <>{t('errors.token_expired', 'Token expired')}</>
    case ErrorCode.token_revoked:
      return <>{t('errors.token_revoked', 'Token revoked')}</>
    case ErrorCode.strategy_not_configured:
      return <>{t('errors.strategy_not_configured', 'Strategy not configured')}</>
    case ErrorCode.local_auth_disabled:
      return <>{t('errors.local_auth_disabled', 'Local auth disabled')}</>
    case ErrorCode.bad_credentials:
      return <>{t('errors.bad_credentials', 'Bad credentials')}</>
    case ErrorCode.invalid_username_password:
      return <>{t('errors.invalid_username_password', 'Invalid username password')}</>
    case ErrorCode.invalid_params:
      return <>{t('errors.invalid_params', 'Invalid params')}</>
    case ErrorCode.unkown_email_template:
      return <>{t('errors.unkown_email_template', 'Unkown email template')}</>
    case ErrorCode.invalid_query:
      return <>{t('errors.invalid_query', 'Invalid query')}</>
    case ErrorCode.format_not_allowed:
      return <>{t('errors.format_not_allowed', 'Format not allowed')}</>
    case ErrorCode.invalid_body:
      return <>{t('errors.invalid_body', 'Invalid body')}</>
    case ErrorCode.resource_not_found:
      return <>{t('errors.resource_not_found', '{{type}} not found', details)}</>
    default:
      return <>{t(`errors.${code}`, message, details)}</>
  }
}

export function Error({ error }) {
  useEffect(() => {
    console.log(error);
  }, [error]);

  if (error.isAxiosError && error.response?.data?.errorCode) {
    return (
      <CustomError
        message={error.response?.data?.message}
        code={error.response?.data?.errorCode}
        details={error.response?.data?.errorDetails}
      />
    );
  }

  return (
    <>{(error.message || error).toString()}</>
  );
}
