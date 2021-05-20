import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useLang } from '../i18/TranslationsProvider';

export interface User {
  id: string;
  authType: string;
  name: string;
  email: string;
  bio?: string;
  picture?: string;
  language: string;
}

export interface Auth {
  ready: boolean;
  loading: boolean;
  fetchUser: () => void;
  user: User;
  setUser: (user: User) => undefined;
  signOut: () => void;
}

export const AuthContext = createContext<Auth>(undefined);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider(props) {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User>();
  const { setLang } = useLang();

  useEffect(() => {
    if (user && user.language) {
      setLang(user.language);
    }
  }, [user, setLang]);


  const signOut = useCallback(() => {
    axios
      .post(`/api/auth/signout`)
      .then(() => setUser(null))
      .catch(err => {
        toast.error(`Could not sign out properly: ${err}`);
      });
  }, []);

  const fetchUser = () => {
    setLoading(true);
    axios
      .get(`/api/user`)
      .then(({ data }) => setUser(data))
      .catch(err => {
        toast.error(`Could not get user: ${err}`);
        setUser(null);
      })
      .finally(() => {
        setReady(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ready,
        loading,
        fetchUser,
        user,
        setUser,
        signOut,
      }}
      {...props}
    />
  );
}
