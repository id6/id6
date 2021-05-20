import React from 'react';
import { Google } from './methods/google/Google';
import { Github } from './methods/github/Github';
import { Gitea } from './methods/gitea/Gitea';
import { Local } from './methods/local/Local';
import { InMemory } from './methods/in-memory/InMemory';
import { Gitlab } from './methods/gitlab/Gitlab';
import { InMemoryButton } from './methods/in-memory/InMemoryButton';
import { useTranslation } from 'react-i18next';

export function Login({ authMethods }: {
  authMethods: string[];
}) {
  const { t } = useTranslation();
  const localEnabled = authMethods.includes('local');
  const inMemoryEnabled = authMethods.includes('in_memory');
  return (
    <div>
      <h2 className="text-center mb-4">
        {t('signIn', 'Sign in')}
      </h2>
      <div>
        {localEnabled ? (
          <Local className="mb-4"/>
        ) : inMemoryEnabled ? (
          <InMemory className="mb-4"/>
        ) : (
          <></>
        )}
        {authMethods.includes('in-memory') && (
          <InMemory className="mb-4"/>
        )}
        {authMethods.includes('gitlab') && (
          <Gitlab/>
        )}
        {authMethods.includes('github') && (
          <Github/>
        )}
        {authMethods.includes('gitea') && (
          <Gitea/>
        )}
        {authMethods.includes('google') && (
          <Google/>
        )}
        {inMemoryEnabled && localEnabled && (
          <InMemoryButton/>
        )}
      </div>
    </div>
  );
}
