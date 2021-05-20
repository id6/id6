import React from 'react';
import styles from './Gitea.module.scss';
import giteaLogo from './gitea.svg';
import { SignInButton } from '../SignInButton';

export function Gitea() {
  return (
    <SignInButton
      icon={(
        <img
          src={giteaLogo}
          alt="gitea-logo"
          className={styles.icon}
        />
      )}
      label="Gitea"
      className={styles.gitea}
      onClick={() => window.location.href = '/api/auth/gitea'}
    />
  );
}
