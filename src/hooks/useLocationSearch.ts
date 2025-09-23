// hooks/useLocationSearch.ts (debug version)
import { useEffect, useRef, useState } from "react";

export interface SimpleSuggestion {
  id: string;
  description: string;
  main_text?: string;
  secondary_text?: string;
}

export interface LocationSuggestion {
  id: string;
  description: string;
  main_text?: string;
  secondary_text?: string;
  place_id?: string;
  city?: string;
  state?: string;
  raw?: any;
}


export function useLocationSearch(initial = "") {
  const [query, setQuery] = useState(initial);
  const [suggestions, setSuggestions] = useState<Array<SimpleSuggestion | string>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    console.log("[useLocationSearch] query changed:", query);

    // minimum characters required to trigger network call — set low for debug (1)
    const MIN_CHARS = 1;

    if (!query || query.length < MIN_CHARS) {
      console.log("[useLocationSearch] query too short — clearing suggestions");
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    const debounceMs = 250; // quick for testing
    const id = setTimeout(async () => {
      console.log("[useLocationSearch] debounce fired — fetching for:", query);
      setIsLoading(true);
      controllerRef.current?.abort();
      controllerRef.current = new AbortController();

      const url = `/api/autocomplete?input=${encodeURIComponent(query)}`;
      console.log("[useLocationSearch] fetch URL:", url);

      try {
        const resp = await fetch(url, { signal: controllerRef.current.signal });
        console.log("[useLocationSearch] fetch done, status:", resp.status);
        const body = await resp.json();
        console.log("[useLocationSearch] response body:", body);
        if (body && Array.isArray(body.predictions)) {
          setSuggestions(body.predictions);
        } else {
          setSuggestions([]);
        }
      } catch (e: any) {
        if (e.name === "AbortError") {
          console.log("[useLocationSearch] fetch aborted for query:", query);
        } else {
          console.error("[useLocationSearch] fetch error:", e);
        }
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, debounceMs);

    return () => {
      clearTimeout(id);
      controllerRef.current?.abort();
    };
  }, [query]);

  const clearSuggestions = () => {
    console.log("[useLocationSearch] clearSuggestions called");
    setSuggestions([]);
  };

  return { query, setQuery, suggestions, isLoading, clearSuggestions, setSuggestions };
}
