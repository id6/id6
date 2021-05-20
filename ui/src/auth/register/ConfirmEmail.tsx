import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader } from '../../commons/Loader';
import { useQueryParams } from '../../commons/use-query-params';
import { Alert } from 'react-bootstrap';
import { Error } from '../../commons/Error';
import { BackToLogin } from '../login/BackToLogin';
import { Trans, useTranslation } from 'react-i18next';

export function ConfirmEmail() {
  const { token } = useQueryParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>();
  const { t } = useTranslation();


  useEffect(() => {
    if (token) {
      setLoading(true);
      axios
        .post<void>(`/api/email/confirm`, { token })
        .catch(err => setError(Error(err)))
        .finally(() => {
          setLoading(false);
        });
    }
  }, [token]);

  return !token ? (
    <div>
      <h2 className="text-center">
        {t('auth.local.confirmEmail.title', 'Confirm email')}
      </h2>
      <Alert variant="danger">
        <Trans i18nKey="auth.local.confirmEmail.missingtoken">
          Something doesn't seem right, there should be a <code>?token=...</code> in the current URL
        </Trans>
      </Alert>
    </div>
  ) : loading ? (
    <div>
      <h2 className="text-center">
        {t('auth.local.confirmEmail.loading.title', 'Confirm email')}
      </h2>
      <Loader/>
    </div>
  ) : (
    <>
      {error ? (
        <div>
          <h2 className="text-center mb-4">
            {t('auth.local.confirmEmail.error.title', 'Confirm email')}
          </h2>
          <Alert variant="danger">
            <Error error={error}/>
          </Alert>
        </div>
      ) : (
        <div className="text-center">
          <h2>
            {t('auth.local.confirmEmail.success.title', 'Email confirmed')}
          </h2>
          <p>
            {t('auth.local.confirmEmail.success.message', 'Your email has been confirmed.')}
          </p>
        </div>
      )}
      <div className="text-center">
        <BackToLogin/>
      </div>
    </>
  );
}
