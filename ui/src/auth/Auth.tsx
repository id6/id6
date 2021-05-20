import React, { useEffect, useState } from 'react';
import { ALink } from '../commons/ALink';
import { useEnv } from '../env/EnvProvider';
import { AppLogo } from '../commons/logo/AppLogo';
import styles from './Auth.module.scss';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Redirect, Route, Switch } from 'react-router-dom';
import axios from 'axios';
import { Loader } from '../commons/Loader';
import { Alert } from 'react-bootstrap';
import { Error } from '../commons/Error';
import { useAuth } from './AuthProvider';
import { UserView } from './user/UserView';
import { Profile } from './user/Profile';
import { Login } from './login/Login';
import { InMemory } from './login/methods/in-memory/InMemory';
import { Register } from './register/Register';
import { ConfirmEmail } from './register/ConfirmEmail';
import { ResendConfirm } from './register/ResendConfirm';
import { ForgotPassword } from './password/ForgotPassword';
import { ResetPassword } from './password/ResetPassword';

function RedirectHome() {
  return (
    <Redirect to="/"/>
  );
}

export function Auth() {
  const { env } = useEnv();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [authMethods, setAuthMethods] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    axios
      .get('/api/auth/methods')
      .then(({ data }) => {
        setAuthMethods(data);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  const hasLocalAuth = authMethods.includes('local');
  const hasInMemory = authMethods.includes('in_memory');

  return loading ? (
    <Loader/>
  ) : error ? (
    <Alert variant="danger">
      <Error error={error}/>
    </Alert>
  ) : (
    <div className={styles.container}>
      <div className={styles.logoContainer}>
        <AppLogo className={styles.logo} logo={env.ID6_LOGO}/>
      </div>
      <div className={styles.box}>
        {user ? (
          <Switch>
            <Route path={`/`} exact component={UserView}/>
            <Route path={`/profile`} exact component={Profile}/>
            <Route component={RedirectHome}/>
          </Switch>
        ) : (
          <Switch>
            <Route path={`/`} exact component={() => <Login authMethods={authMethods}/>}/>
            <Route path={`/in-memory`} exact component={hasInMemory ? InMemory : RedirectHome}/>
            <Route path={`/register`} exact component={hasLocalAuth ? Register : RedirectHome}/>
            <Route path={`/email/confirm`} exact component={hasLocalAuth ? ConfirmEmail : RedirectHome}/>
            <Route path={`/email/confirm/send`} exact component={hasLocalAuth ? ResendConfirm : RedirectHome}/>
            <Route path={`/password/forgot`} exact component={hasLocalAuth ? ForgotPassword : RedirectHome}/>
            <Route path={`/password/reset`} exact component={hasLocalAuth ? ResetPassword : RedirectHome}/>
            <Route component={RedirectHome}/>
          </Switch>
        )}
      </div>
      <div className={styles.links}>
        <ALink href={env.ID6_REDIRECT_URL}>
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2"/> Back to <strong>{env.ID6_NAME}</strong>
        </ALink>
      </div>
    </div>
  );
}
