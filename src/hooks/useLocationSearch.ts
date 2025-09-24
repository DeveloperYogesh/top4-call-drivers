// src/hooks/useLocationSearch.ts
'use client';

import { useCallback } from 'react';
import { Location } from '@/types';
import { debounce } from '@/utils/debounce';

// Lightweight hook that performs a server-side search via fetch.
// You can replace the fetch URL with your own server route.
export function useLocationSearch() {
  const search = useCallback(
    async (query: string): Promise<Location[]> => {
      if (!query || query.length < 3) return [];

      try {
        const res = await fetch(`/api/locations/search?query=${encodeURIComponent(query)}`);
        if (!res.ok) return [];
        const payload = await res.json();
        // server should return { status: 'success', data: Location[] } or Location[]
        if (payload?.status === 'success' && Array.isArray(payload.data)) {
          return payload.data as Location[];
        }
        if (Array.isArray(payload)) return payload as Location[];
        return [];
      } catch (e) {
        console.error('useLocationSearch error', e);
        return [];
      }
    },
    []
  );

  // wrapper that returns debounced function
  const debounced = debounce(async (q: string, cb: (results: Location[]) => void) => {
    const r = await search(q);
    cb(r);
  }, 300);

  return {
    search,
    debounced, // use: debounced(query, setSuggestions)
  };
}
