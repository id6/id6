import React, { useState } from 'react';
import axios from 'axios';
import { Alert, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { maxLength, minLength, required } from '../../commons/form-constants';
import { InputError } from '../../commons/InputError';
import { Loader } from '../../commons/Loader';
import { useQueryParams } from '../../commons/use-query-params';
import { Error } from '../../commons/Error';
import { BackToLogin } from '../login/BackToLogin';
import { Trans, useTranslation } from 'react-i18next';

interface FormData {
  password: string;
}

function usePasswordReset() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<any>();


  const resetPassword = (formData: { token: string, password: string }) => {
    setLoading(true);
    axios
      .post<void>(`/api/password/reset`, formData)
      .then(() => {
        setSuccess(true);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  };

  return {
    resetPassword,
    loading,
    success,
    error,
  };
}

export function ResetPassword() {
  // TODO see if changes when redirect
  const { token } = useQueryParams();
  const { register, formState: { errors }, handleSubmit, watch } = useForm({
    mode: 'onChange',
  });
  const { loading, resetPassword, success, error } = usePasswordReset();
  const { t } = useTranslation();

  const submit = (formData: FormData) => {
    resetPassword({ token, ...formData });
  };

  const password = watch('password');

  return (
    <div>
      <h2 className="text-center mb-4">Reset password</h2>
      {token ? (
        <>
          {!success ? (
            <form onSubmit={handleSubmit(submit)}>
              <div className="form-group">
                <input
                  type="password"
                  id="password"
                  placeholder={t('auth.local.password.reset.form.password', 'Password')}
                  {...register('password', {
                    required: required(),
                    minLength: minLength(6),
                    maxLength: maxLength(255),
                  })}
                  className="form-control"
                  autoComplete="off"
                />
                <InputError error={errors} path="password"/>
              </div>
              <div className="form-group">
                <input
                  type="password"
                  id="passwordConfirm"
                  placeholder={t('auth.local.password.reset.form.passwordConfirm', 'Confirm password')}
                  {...register('passwordConfirm', {
                    required: required(),
                    validate: val => val !== password ? 'Must be identical to password' : undefined,
                  })}
                  className="form-control"
                  autoComplete="off"
                />
                <InputError error={errors} path="passwordConfirm"/>
              </div>
              {error && (
                <div className="form-group">
                  <Alert variant="danger">
                    <Error error={error}/>
                  </Alert>
                </div>
              )}
              <div className="form-group">
                <Button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {t('auth.local.password.reset.form.submit', 'Submit')}
                  {loading && (
                    <Loader className="ml-2"/>
                  )}
                </Button>
              </div>
            </form>
          ) : (
            <p>
              {t('auth.local.password.reset.form.success', 'Your password has been reset')}
            </p>
          )}
        </>
      ) : (
        <p className="text-danger">
          <Trans i18nKey="auth.local.password.reset.missingtoken">
            Something doesn't seem right, there should be a <code>?token=...</code> in the current URL.
          </Trans>
        </p>
      )}
      <div className="text-center">
        <BackToLogin/>
      </div>
    </div>
  );
}
