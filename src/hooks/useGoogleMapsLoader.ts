// src/hooks/useGoogleMapsLoader.ts
'use client';

import { useEffect, useState } from 'react';

export function useGoogleMapsLoader(apiKey?: string) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ((window as any).google && (window as any).google.maps) {
      setLoaded(true);
      return;
    }

    if (!apiKey) {
      setError(new Error('Google Maps API key is not provided (GOOGLE_MAPS_API_KEY)'));
      return;
    }

    const scriptId = 'google-maps-js';
    if (document.getElementById(scriptId)) {
      // script present but maybe not ready — check global
      const check = () => {
        if ((window as any).google && (window as any).google.maps) {
          setLoaded(true);
        } else {
          // small fallback retry
          setTimeout(check, 100);
        }
      };
      check();
      return;
    }

    const s = document.createElement('script');
    s.id = scriptId;
    s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places`;
    s.async = true;
    s.defer = true;
    s.onload = () => setLoaded(true);
    s.onerror = () => setError(new Error('Failed to load Google Maps script'));
    document.head.appendChild(s);

    // do not remove script on unmount to allow reuse across pages
  }, [apiKey]);

  return { loaded, error };
}
