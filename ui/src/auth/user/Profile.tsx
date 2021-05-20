import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Profile.module.scss';
import { Alert, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { maxLength, required } from '../../commons/form-constants';
import { InputError } from '../../commons/InputError';
import { useAuth } from '../AuthProvider';
import { Loader } from '../../commons/Loader';
import { Link } from 'react-router-dom';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Error } from '../../commons/Error';
import { routerHistory } from '../../commons/history';
import classNames from 'classnames';
import iso639 from 'iso-639-1';
import { USER_BIO_MAX_LENGTH, USER_NAME_MAX_LENGTH } from '@id6/commons/build/constants';
import { useTranslation } from 'react-i18next';

interface FormData {
  name: string;
  bio: string;
}

function useProfile() {
  const [loading, setLoading] = useState(false);
  const { setUser, user } = useAuth();
  const [error, setError] = useState<any>();

  const updateProfile = (formData: FormData) => {
    setLoading(true);
    setError(undefined);
    axios
      .post<void>(`/api/user/profile`, formData)
      .then(() => {
        setUser({
          ...user,
          ...formData,
        });
        routerHistory.push('./');
      })
      .catch(setError)
      .finally(() => {
        setLoading(false);
      });
  };

  return {
    updateProfile,
    loading,
    error,
  };
}

export function Profile() {
  const { user } = useAuth();
  const { register, formState: { errors }, handleSubmit, reset } = useForm({
    mode: 'onChange',
  });
  const { updateProfile, loading, error } = useProfile();
  const { t } = useTranslation();

  const submit = (formData: FormData) => {
    updateProfile(formData);
  };

  useEffect(() => {
    reset(user);
  }, [user, reset]);

  return (
    <>
      <div>
        <h2 className="text-center mb-4">{t('user.profile.title', 'Update profile')}</h2>
        <form onSubmit={handleSubmit(submit)}>
          <div className="form-group">
            <input
              type="text"
              id="name"
              placeholder="Name"
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
            <textarea
              id="bio"
              placeholder="Bio"
              rows={4}
              {...register('bio', {
                required: required(),
                maxLength: maxLength(USER_BIO_MAX_LENGTH),
              })}
              className={classNames('form-control', styles.bio)}
              autoComplete="off"
            />
            <InputError error={errors} path="bio"/>
          </div>
          {error && (
            <div className="form-group">
              <Alert variant="danger">
                <Error error={error}/>
              </Alert>
            </div>
          )}
          <div className="form-group">
            <select
              {...register('language')}
              className="custom-select"
              id="language"
            >
              <option value="">Language</option>
              {iso639.getAllCodes().map(code => (
                <option value={code} key={code}>{iso639.getName(code)}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <Button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              Save
              {loading && (
                <Loader className="ml-2"/>
              )}
            </Button>
          </div>
        </form>
      </div>
      <div className="text-center">
        <Link to="/">
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2"/>
          Go back
        </Link>
      </div>
    </>
  );
}
