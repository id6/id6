import React, { useState } from 'react';
import axios from 'axios';
import { Alert, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { maxLength, required, validateEmail } from '../../commons/form-constants';
import { InputError } from '../../commons/InputError';
import { Loader } from '../../commons/Loader';
import { Error } from '../../commons/Error';
import { BackToLogin } from '../login/BackToLogin';
import { useTranslation } from 'react-i18next';

interface FormData {
  email: string;
}

function usePasswordForgot() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<any>();


  const forgotPassword = (formData: FormData) => {
    setLoading(true);
    axios
      .post<void>(`/api/password/forgot`, formData)
      .then(() => {
        setSuccess(true);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  };

  return {
    forgotPassword,
    loading,
    success,
    error,
  };
}

export function ForgotPassword() {
  const { register, formState: { errors }, handleSubmit } = useForm({
    mode: 'onChange',
  });
  const { loading, success, error, forgotPassword } = usePasswordForgot();
  const { t } = useTranslation();

  return (
    <div>
      {!success ? (
        <>
          <h2 className="text-center mb-4">Forgot password</h2>
          <form onSubmit={handleSubmit(forgotPassword)}>
            <div className="form-group">
              <input
                type="text"
                id="email"
                placeholder={t('auth.local.password.forgot.form.email', 'Email')}
                {...register('email', {
                  required: required(),
                  maxLength: maxLength(),
                  validate: validateEmail,
                })}
                className="form-control"
                autoComplete="off"
              />
              <InputError error={errors} path="email"/>
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
                {t('auth.local.password.forgot.form.submit', 'Submit')}
                {loading && (
                  <Loader className="ml-2"/>
                )}
              </Button>
            </div>
          </form>
        </>
      ) : (
        <div>
          <h2 className="text-center mb-4">
            {t('auth.local.password.forgot.success.title', 'Sent !')}
          </h2>
          <p>
            {t('auth.local.password.forgot.success.message', 'We\'ve sent you an email with a link to reset your password.')}
          </p>
        </div>
      )}
      <div className="text-center">
        <BackToLogin/>
      </div>
    </div>
  );
}
