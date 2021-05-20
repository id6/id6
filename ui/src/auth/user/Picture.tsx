import React, { useEffect, useRef, useState } from "react";
import { useAuth } from '../AuthProvider';
import styles from './Picture.module.scss';
import classNames from 'classnames';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Error } from '../../commons/Error';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

function usePicture() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>();
  const { user, setUser } = useAuth();

  const updatePicture = (file: File) => {
    setLoading(true);
    setError(undefined);

    const formData = new FormData();
    formData.append('picture', file);

    setTimeout(() => {
      axios
        .post<{ picture?: string }>(`/api/user/picture`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(({ data }) => {
          setUser({
            ...user,
            picture: data.picture,
          });
        })
        .catch(setError)
        .finally(() => {
          setLoading(false);
        });
    }, 2000);
  };

  return {
    updatePicture,
    loading,
    error,
  };
}

export function Picture({ className }: {
  className?
}) {
  const { user } = useAuth();
  const { updatePicture, error, loading } = usePicture();
  const formRef = useRef<HTMLFormElement>();

  const changeHandler = event => {
    updatePicture(event.target.files[0]);
  };

  useEffect(() => {
    if (error) {
      toast.error(<Error error={error}/>);
    }
  }, [error]);

  useEffect(() => {
    formRef.current.reset();
  }, [user]);

  return (
    <OverlayTrigger overlay={
      <Tooltip id="picture-tooltip">
        Upload picture
      </Tooltip>
    }>
      <div className={classNames(styles.container, className, {
        [styles.loading]: loading,
        [styles.empty]: !user.picture,
      })} style={{
        backgroundImage: `url(${user.picture})`,
      }}>
        <form ref={formRef}>
          <input
            type="file"
            id="file"
            onChange={changeHandler}
            className="d-none"
            accept="image/jpeg,image/png"
            disabled={loading}
          />
          <label
            htmlFor="file"
            className={classNames(styles.label)}
          />
        </form>
      </div>
    </OverlayTrigger>
  )
}
