import React from "react";
import { routerHistory } from '../../../../commons/history';
import { SignInButton } from '../SignInButton';
import { Id6Logo } from '../../../../commons/logo/Id6Logo';
import styles from './InMemoryButton.module.scss';

export function InMemoryButton() {
  return (
    <SignInButton
      onClick={() => routerHistory.push('/in-memory')}
      icon={<Id6Logo className="w-100 h-100"/>}
      label="In-memory"
      className={styles.bg}
    />
  )
}
