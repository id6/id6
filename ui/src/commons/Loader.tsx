import React from 'react';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function Loader({ className }: { className?: string; [key: string]: string }) {
  return (
    <FontAwesomeIcon icon={faSpinner} className={className} spin/>
  );
}
