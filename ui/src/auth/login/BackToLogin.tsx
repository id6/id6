import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function BackToLogin() {
  const { t } = useTranslation();
  return (
    <Link to="/">
      <FontAwesomeIcon icon={faArrowLeft} className="mr-2"/>
      {t('auth.backToLogin', 'Back to login')}
    </Link>
  )
}
