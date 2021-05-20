import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import React from 'react';
import styles from './Google.module.scss';
import { SignInButton } from '../SignInButton';

export function Google() {
  return (
    <SignInButton
      icon={(
        <div className={styles.icon}>
          <FontAwesomeIcon icon={faGoogle} className="d-block w-100"/>
        </div>
      )}
      label="Google"
      className={styles.google}
      onClick={() => window.location.href = '/api/auth/google'}
    />
  );
}
