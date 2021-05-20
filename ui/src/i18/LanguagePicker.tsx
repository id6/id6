import React, { useState } from "react";
import { uniqueId } from "lodash";
import { Button, Dropdown } from 'react-bootstrap';
import { supportedLanguages, useLang } from './TranslationsProvider';
import iso639 from 'iso-639-1';
import { useAuth, User } from '../auth/AuthProvider';
import axios from 'axios';
import { toast } from 'react-toastify';

const langs = iso639.getAllCodes().filter(lng => supportedLanguages.includes(lng));

export function LanguagePicker({ className }: {
  className?: any;
}) {
  const [uid] = useState(uniqueId());
  const { lang: currentLang, setLang } = useLang();
  const { user, setUser } = useAuth();

  const changeLang = (lang: string) => {
    console.log('setLang', lang);
    setLang(lang);
    if (user) {
      axios
        .post<User>('/api/user/profile', {
          ...user,
          language: lang,
        })
        .then(() => setUser({
          ...user,
          language: lang,
        }))
        .catch(() => {
          toast.error('Could not save language');
        });
    }
  };

  return (
    <>
      <Dropdown id={uid} className={className}>
        <Dropdown.Toggle as={Button} variant="link">
          {currentLang}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {langs.map(lang => (
            <Dropdown.Item
              onClick={() => changeLang(lang)}
              key={lang}
              active={lang === currentLang}
            >
              {iso639.getName(lang)}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </>
  )
}
