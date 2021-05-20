import React from 'react';
import styles from './Gitlab.module.scss';
import gitlabLogo from './gitlab.svg';
import { SignInButton } from '../SignInButton';

export function Gitlab() {
  return (
    <SignInButton
      icon={(
        <img
          src={gitlabLogo}
          alt="gitlab-logo"
          className="d-block w-100"
        />
      )}
      label="Gitlab"
      className={styles.gitlab}
      onClick={() => window.location.href = '/api/auth/gitlab'}
    />
  );
}
