import React, { useState } from 'react';
import classNames from 'classnames';
import axios from 'axios';
import { Alert, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { maxLength, required } from '../../../../commons/form-constants';
import { InputError } from '../../../../commons/InputError';
import { Loader } from '../../../../commons/Loader';
import { Error } from '../../../../commons/Error';
import { useTranslation } from 'react-i18next';
import { BackToLogin } from '../../BackToLogin';
import { useEnv } from '../../../../env/EnvProvider';

interface FormData {
  user: string;
  password: string;
}

function useSignIn() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>();
  const { env } = useEnv();

  const signIn = (formData: FormData) => {
    setLoading(true);
    axios
      .post<void>(`/api/auth/in-memory`, formData)
      .then(() => {
        window.location.href = env.ID6_REDIRECT_URL;
      })
      .catch(setError)
      .finally(() => setLoading(false));
  };

  return {
    signIn,
    loading,
    error,
  };
}

export function InMemory({ className }: {
  className?;
}) {
  const { register, formState: { errors }, handleSubmit } = useForm({
    mode: 'onChange',
  });
  const { signIn, loading, error } = useSignIn();
  const { t } = useTranslation();

  return (
    <>
      <h2 className="text-center mb-4">In memory</h2>
      <form
        onSubmit={handleSubmit(signIn)}
        className={classNames(className)}
      >
        <div className="form-group">
          <input
            type="text"
            id="user"
            {...register('user', {
              required: required(),
              maxLength: maxLength(),
            })}
            className="form-control"
            autoComplete="off"
            placeholder={t('auth.inmemory.form.user', 'User')}
          />
          <InputError error={errors} path="user"/>
        </div>
        <div className="form-group">
          <input
            type="password"
            id="password"
            {...register('password', {
              required: required(),
              maxLength: maxLength(),
            })}
            className="form-control"
            autoComplete="off"
            placeholder={t('auth.inmemory.form.password', 'Password')}
          />
          <InputError error={errors} path="password"/>
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
            placeholder={t('auth.inmemory.form.submit', 'Sign in')}
            {loading && (
              <Loader className="ml-2"/>
            )}
          </Button>
        </div>
      </form>
      <div className="text-center">
        <BackToLogin/>
      </div>
    </>
  );
}
