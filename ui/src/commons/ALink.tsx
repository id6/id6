import React from 'react';

export function ALink({
  href, className, children, onClick, external,
}: {
  href: string;
  external?: boolean;
  className?;
  children;
  onClick?;
}) {
  return (
    <a
      href={href}
      className={className}
      target={external ? '_blank' : '_self'}
      rel="noopener noreferrer"
      onClick={onClick}
    >
      {children}
    </a>
  );
}
