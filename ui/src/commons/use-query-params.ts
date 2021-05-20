import qs from 'qs';
import { useState } from 'react';

export function useQueryParams(): { [key: string]: string } {
  const [query] = useState<{ [key: string]: string }>(
    qs.parse(window.location.search, {
      ignoreQueryPrefix: true,
    }) as any,
  );
  return query;
}
