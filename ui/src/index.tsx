import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';
import { Toasts } from './commons/Toasts';
import { routerHistory } from './commons/history';
import { Router } from 'react-router-dom';
import { EnvProvider, useEnv } from './env/EnvProvider';
import { FullPageLoader } from './commons/FullPageLoader';
import { TranslationsProvider, useLang } from './i18/TranslationsProvider';
import { AuthProvider, useAuth } from './auth/AuthProvider';

axios.defaults.withCredentials = true;

class DebugRouter extends Router {
  constructor(props) {
    super(props);

    if (process.env.NODE_ENV !== 'production') {
      routerHistory.listen(location => {
        // eslint-disable-next-line no-console
        console.log(`URL=${location.pathname}${location.search}${location.hash}`, location);
      });
    }
  }
}

function LoadProviders({ children }) {
  const { ready: envReady } = useEnv();
  const { ready: translationsReady } = useLang();
  const { ready: authReady } = useAuth();

  const init = envReady && translationsReady && authReady;

  return init ? children : <FullPageLoader/>
}

ReactDOM.render(
  // TODO enable strict mode when https://github.com/react-bootstrap/react-bootstrap/issues/5519 fixed
  /*<React.StrictMode>*/
  <DebugRouter history={routerHistory}>
    <EnvProvider>
      <TranslationsProvider>
        <AuthProvider>
          <LoadProviders>
            <App/>
          </LoadProviders>
        </AuthProvider>
      </TranslationsProvider>
    </EnvProvider>
    <Toasts/>
  </DebugRouter>
  /*</React.StrictMode>*/,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
