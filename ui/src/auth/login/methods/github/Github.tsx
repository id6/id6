import React from 'react';
import styles from './Github.module.scss';
import githubLogo from './github.svg';
import { SignInButton } from '../SignInButton';

export function Github() {
  return (
    <SignInButton
      icon={(
        <img
          src={githubLogo}
          alt="github-logo"
          className="d-block w-100"
        />
      )}
      label="Github"
      className={styles.github}
      onClick={() => window.location.href = '/api/auth/github'}
    />
  );
}
