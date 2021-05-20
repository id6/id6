import React, { useState } from 'react';
import classNames from 'classnames';
import styles from './Local.module.scss';
import axios from 'axios';
import { Alert, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { maxLength, required, validateEmail } from '../../../../commons/form-constants';
import { InputError } from '../../../../commons/InputError';
import { Loader } from '../../../../commons/Loader';
import { Link } from 'react-router-dom';
import { Error } from '../../../../commons/Error';
import { useEnv } from '../../../../env/EnvProvider';

interface FormData {
  email: string;
  password: string;
}

function useSignIn() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>();
  const { env } = useEnv();


  const signIn = (formData: FormData) => {
    setLoading(true);
    axios
      .post<void>(`/api/auth/local`, formData)
      .then(() => {
        window.location.href = env.ID6_REDIRECT_URL
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

export function Local({ className }: {
  className?;
}) {
  const { register, formState: { errors }, handleSubmit } = useForm({
    mode: 'onChange',
  });
  const { signIn, loading, error } = useSignIn();

  return (
    <>
      <form
        onSubmit={handleSubmit(signIn)}
        className={classNames(className)}
      >
        <div className="form-group">
          <input
            type="text"
            id="email"
            placeholder="Email"
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
            placeholder="Password"
            {...register('password', {
              required: required(),
              maxLength: maxLength(),
            })}
            className="form-control"
            autoComplete="off"
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
            className={classNames('btn btn-primary w-100', styles.btn)}
            disabled={loading}
          >
            Sign in
            {loading && (
              <Loader className="ml-2"/>
            )}
          </Button>
        </div>
        <div className="form-group text-center">
          <Link to="/password/forgot">Forgot password</Link>
          <span className="ml-2 mr-2">&bull;</span>
          <Link to="/register">Sign up</Link>
        </div>
      </form>
    </>
  );
}
