import React, { useState } from 'react';
import axios from 'axios';
import { Alert, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { maxLength, minLength, required, validateEmail } from '../../commons/form-constants';
import { InputError } from '../../commons/InputError';
import { useAuth } from '../AuthProvider';
import { Loader } from '../../commons/Loader';
import { Error } from '../../commons/Error';
import { useLang } from '../../i18/TranslationsProvider';
import { BackToLogin } from '../login/BackToLogin';
import { Trans, useTranslation } from 'react-i18next';
import { USER_NAME_MAX_LENGTH } from '@id6/commons/build/constants';
import { useEnv } from '../../env/EnvProvider';
import { ALink } from '../../commons/ALink';

interface FormData {
  name: string;
  email: string;
  password: string;
}

function useRegister() {
  const [loading, setLoading] = useState(false);
  const { fetchUser } = useAuth();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<any>();
  const { lang } = useLang();


  const register = (formData: FormData) => {
    setLoading(true);
    axios
      .post<void>(`/api/auth/register`, { ...formData, lang })
      .then(() => {
        fetchUser();
        setSuccess(true);
      })
      .catch(setError)
      .finally(() => {
        setLoading(false);
      });
  };

  return {
    register,
    loading,
    success,
    error,
  };
}

export function Register() {
  const { register, formState: { errors }, handleSubmit, watch } = useForm({
    mode: 'onChange',
  });
  const { loading, register: doRegister, success, error } = useRegister();
  const { t } = useTranslation();
  const { env } = useEnv();

  const password = watch('password');

  const submit = (formData: FormData) => {
    doRegister(formData);
  };

  return (
    <>
      {!success ? (
        <div>
          <h2 className="text-center mb-4">
            {t('auth.local.register.title', 'Sign up')}
          </h2>
          <form onSubmit={handleSubmit(submit)}>
            <div className="form-group">
              <input
                type="text"
                id="name"
                placeholder={t('auth.local.register.form.name', 'Name')}
                {...register('name', {
                  required: required(),
                  maxLength: maxLength(USER_NAME_MAX_LENGTH),
                })}
                className="form-control"
                autoComplete="off"
              />
              <InputError error={errors} path="name"/>
            </div>
            <div className="form-group">
              <input
                type="text"
                id="email"
                placeholder={t('auth.local.register.form.email', 'Email')}
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
            <div className="form-group">
              <input
                type="password"
                id="password"
                placeholder={t('auth.local.register.form.password', 'Password')}
                {...register('password', {
                  required: required(),
                  min: minLength(6),
                  maxLength: maxLength(),
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
                placeholder={t('auth.local.register.form.passwordConfirm', 'Confirm password')}
                {...register('passwordConfirm', {
                  required: required(),
                  validate: val => val !== password ? 'Must be identical to password' : undefined,
                })}
                className="form-control"
                autoComplete="off"
              />
              <InputError error={errors} path="passwordConfirm"/>
            </div>
            {env.ID6_TERMS_URL && (
              <div className="form-group">
                <Trans i18nKey="auth.local.register.terms">
                  By registering, you accept our <ALink external={true} href={env.ID6_TERMS_URL}>terms of service</ALink>.
                </Trans>
              </div>
            )}
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
                {t('auth.local.register.form.submit', 'Submit')}
                {loading && (
                  <Loader className="ml-2"/>
                )}
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="text-center">
          <h2>
            {t('auth.local.register.success.title', 'Almost there')}
          </h2>
          <p>
            {t('auth.local.register.success.message', 'We\'ve sent you an email with a confirmation link.')}
          </p>
        </div>
      )}
      <div className="text-center">
        <BackToLogin/>
      </div>
    </>
  );
}
