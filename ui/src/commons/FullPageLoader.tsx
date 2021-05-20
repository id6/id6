import React from "react";
import styles from './FullPageLoader.module.scss';
import { Id6Logo } from './logo/Id6Logo';

export function FullPageLoader() {
  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <Id6Logo className={styles.logo}/>
      </div>
    </div>
  )
}
