import React, { createContext, useContext, useEffect, useState } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { Error } from '../commons/Error';
import { Alert } from 'react-bootstrap';
import { useLocalStorage } from '../commons/use-local-storage';
import { toast } from 'react-toastify';

export const supportedLanguages = [
  'en',
  'fr',
];

interface Context {
  lang: string;
  setLang: (lang: string) => void;
  loading: boolean;
  ready: boolean;
}

export const context = createContext<Context>(undefined);
export const useLang = () => useContext(context);

export function TranslationsProvider(props) {
  const [lang, setLang] = useLocalStorage<string>('lang', 'en');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    if (i18n.isInitialized) {
      i18n
        .changeLanguage(lang)
        .catch(err => {
          toast(<Error error={err}/>);
        });
      return;
    }

    i18n
      .use(Backend)
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        fallbackLng: 'en',
        lng: lang,
        debug: true,
        keySeparator: false, // allow flat json
        interpolation: {
          escapeValue: false, // not needed for react as it escapes by default
        },
      })
      .finally(() => setLoading(false))
      .catch(setError);
  }, [setLoading, lang]);

  return error ? (
    <Alert variant="danger">
      <Error error={error}/>
    </Alert>
  ) : (
    <context.Provider
      value={{ lang, setLang, loading, ready: !loading }}
      {...props}
    />
  );
}
