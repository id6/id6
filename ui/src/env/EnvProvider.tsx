import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Alert } from 'react-bootstrap';
import { Error } from '../commons/Error';

interface Env {
  ID6_REDIRECT_URL: string;
  ID6_NAME?: string;
  ID6_LOGO?: string;
  ID6_TERMS_URL?: string;
  ID6_ADMIN_ENABLED?: boolean;
}

interface ContextType {
  env: Env;
  ready: boolean;
}

const Context = createContext<ContextType>(undefined as any);

export const useEnv = () => useContext(Context);

export function EnvProvider(props) {
  const [loading, setLoading] = useState(true);
  const [env, setEnv] = useState<Env>();
  const [error, setError] = useState<any>();

  useEffect(() => {
    axios
      .get(`/api/env`)
      .then(({ data }) => {
        setEnv(data);
        console.log('env', data);
      })
      .finally(() => setLoading(false))
      .catch(err => setError(`Could not load env: ${err.toString()}`));
  }, []);

  return error ? (
    <Alert variant="danger">
      <Error error={error}/>
    </Alert>
  ) : (
    <Context.Provider value={{ env, ready: !loading && !!env }} {...props} />
  );
}
