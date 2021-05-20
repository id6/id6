import React from 'react';
import styles from './App.module.scss';
import { Auth } from './auth/Auth';

export default function App() {
  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <Auth/>
      </div>
    </div>
  );
}
