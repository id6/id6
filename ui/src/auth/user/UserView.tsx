import React, { useState } from "react";
import { useAuth } from '../AuthProvider';
import { Button, Dropdown } from 'react-bootstrap';
import { Link } from "react-router-dom";
import styles from './UserView.module.scss';
import { Picture } from './Picture';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Error } from '../../commons/Error';
import { Loader } from '../../commons/Loader';
import { useTranslation } from 'react-i18next';

export function UserView() {
  const { user, signOut, setUser } = useAuth();
  const [revoking, setRevoking] = useState(false);
  const { t } = useTranslation();


  const revokeTokens = () => {
    setRevoking(true);
    axios
      .get(`/api/user/tokens/revoke`)
      .then(() => {
        setUser(null);
      })
      .catch(error => {
        toast.error(<Error error={error}/>);
      })
      .finally(() => {
        setRevoking(false);
      });
  }

  return (
    <div className="text-center position-relative">
      <Picture className={styles.picture}/>
      <h2>{user.name}</h2>
      {user.bio ? (
        <p>{user.bio}</p>
      ) : (
        <p className="text-muted font-italic">No bio</p>
      )}
      <div className="text-center">
        <Dropdown>
          <Dropdown.Toggle as={Button}>
            More
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item as={Link} to="/profile">
              {t('user.view.editProfile', 'Edit profile')}
            </Dropdown.Item>
            <Dropdown.Item onClick={signOut}>
              {t('user.view.signout', 'Sign out')}
            </Dropdown.Item>
            <Dropdown.Item onClick={revokeTokens}>
              {t('user.view.revokeTokens', 'Revoke tokens')}
              {revoking && (
                <Loader className="ml-2"/>
              )}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  )
}
