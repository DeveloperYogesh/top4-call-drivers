// File: components/ui/LocationAutocomplete.tsx
"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Autocomplete,
  TextField,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { LocationOn } from "@mui/icons-material";
import { Location } from "@/types";
import { useGoogleMapsLoader } from "@/hooks/useGoogleMapsLoader";
import { useLocationSearch } from "@/hooks/useLocationSearch";

/**
 * Improvements:
 * - Debounce (250ms)
 * - Memory cache for queries and place details
 * - AbortController usage for server fetchSuggestions
 * - Request-sequence token to ignore outdated Google callbacks
 * - Keeps input text stable when selecting option so selection doesn't "blink"
 */

interface Props {
  label: string;
  placeholder?: string;
  value: any;
  onChange: any;
  error?: boolean;
  helperText?: string;
  fetchSuggestions?: (q: string) => Promise<Location[]>;
  minLength?: number;
}

export default function LocationAutocomplete({
  label,
  placeholder,
  value,
  onChange,
  error,
  helperText,
  fetchSuggestions,
  minLength = 2, // 2 is often snappier; choose 3 if you want less calls
}: Props) {
  const googleApiKey =
    process.env.NEXT_PUBLIC_GOOGLE_API_KEY || process.env.GOOGLE_API_KEY;
  const { loaded: googleLoaded, error: googleError } = useGoogleMapsLoader(
    googleApiKey
  );
  const { debounced: serverDebounced } = useLocationSearch();

  // Local input text shown in the TextField
  const [inputText, setInputText] = useState<string>(value?.name ?? "");
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // caches & refs
  const queryCache = useRef<Map<string, Location[]>>(new Map());
  const placeCache = useRef<Map<string, Location | null>>(new Map());
  const autocompleteServiceRef = useRef<any | null>(null);
  const placesServiceRef = useRef<any | null>(null);

  // for Google callback ordering (since AutocompleteService uses callbacks)
  const lastGoogleReqId = useRef<number>(0);

  // Abort controller for server-based requests
  const serverAbortRef = useRef<AbortController | null>(null);

  // Initialize Google services once available
  useEffect(() => {
    if (!googleLoaded) return;
    if (!autocompleteServiceRef.current && (window as any).google) {
      try {
        autocompleteServiceRef.current = new (window as any)
          .google.maps.places.AutocompleteService();
        placesServiceRef.current = new (window as any)
          .google.maps.places.PlacesService(document.createElement("div"));
      } catch (e) {
        console.warn("Google Places init failed", e);
        autocompleteServiceRef.current = null;
        placesServiceRef.current = null;
      }
    }
  }, [googleLoaded]);

  // Keep inputText in sync when parent 'value' changes (e.g., programmatic updates)
  useEffect(() => {
    if (value?.name) {
      setInputText(value.name);
    } else if (value === null) {
      setInputText("");
    }
  }, [value]);

  // Helper: call Google AutocompleteService with request-id guard
  const fetchGooglePredictions = useCallback(
    (input: string, reqId: number) => {
      if (!autocompleteServiceRef.current) return Promise.resolve([] as Location[]);
      return new Promise<Location[]>((resolve) => {
        try {
          autocompleteServiceRef.current.getPlacePredictions(
            { input, types: [] },
            (predictions: any[] | null, status: any) => {
              // ignore if a newer request already started
              if (reqId !== lastGoogleReqId.current) {
                resolve([]);
                return;
              }
              if (!predictions || status !== (window as any).google.maps.places.PlacesServiceStatus.OK) {
                resolve([]);
                return;
              }
              const mapped = predictions.map((p: any) => ({
                id: p.place_id,
                name: p.description,
              })) as Location[];
              resolve(mapped);
            }
          );
        } catch (e) {
          console.error("Google predictions exception", e);
          resolve([]);
        }
      });
    },
    []
  );

  // Helper: fetch details from Google PlacesService (guarded by request-id)
  const fetchPlaceDetailsGoogle = useCallback(async (placeId: string) => {
    if (!placesServiceRef.current) {
      console.warn("fetchPlaceDetailsGoogle: PlacesService not available");
      return null;
    }
    // cached?
    if (placeCache.current.has(placeId)) return placeCache.current.get(placeId) ?? null;

    return new Promise<Location | null>((resolve) => {
      try {
        placesServiceRef.current.getDetails(
          { placeId, fields: ["address_components", "formatted_address", "geometry", "name"] },
          (place: any, status: any) => {
            const OK_STATUS = (window as any).google?.maps?.places?.PlacesServiceStatus?.OK;
            if (!place || status !== OK_STATUS) {
              console.warn("fetchPlaceDetailsGoogle: Status not OK", {
                status,
                expected: OK_STATUS,
                placeId,
                hasPlace: !!place
              });
              resolve(null);
              return;
            }
            
            // Extract coordinates - handle both method call and direct property access
            let lat: number | undefined;
            let lng: number | undefined;
            
            if (place.geometry?.location) {
              if (typeof place.geometry.location.lat === 'function') {
                lat = place.geometry.location.lat();
                lng = place.geometry.location.lng();
              } else {
                lat = place.geometry.location.lat;
                lng = place.geometry.location.lng;
              }
            }
            
            if (lat == null || lng == null) {
              console.warn("fetchPlaceDetailsGoogle: No coordinates found in place geometry", place.geometry);
            }
            
            const loc: Location = {
              id: place.place_id,
              name: place.formatted_address || place.name || place.place_id,
              city: undefined,
              state: undefined,
              lat,
              lng,
            };
            if (place.address_components) {
              for (const c of place.address_components) {
                if (c.types.includes("locality")) loc.city = c.long_name;
                if (c.types.includes("administrative_area_level_1")) loc.state = c.long_name;
                if (!loc.city && c.types.includes("sublocality")) loc.city = c.long_name;
              }
            }
            placeCache.current.set(placeId, loc);
            resolve(loc);
          }
        );
      } catch (e) {
        console.error("fetchPlaceDetailsGoogle exception", e);
        resolve(null);
      }
    });
  }, []);

  // REST API fallback to fetch place details using Google Places REST API
  const fetchPlaceDetailsREST = useCallback(async (placeId: string) => {
    if (placeCache.current.has(placeId)) return placeCache.current.get(placeId) ?? null;
    
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      console.warn("Google API key not found for REST API fallback");
      return null;
    }

    try {
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&key=${apiKey}&fields=place_id,formatted_address,name,geometry,address_components`;
      const res = await fetch(url);
      if (!res.ok) {
        console.error("REST API fetch failed:", res.status, res.statusText);
        return null;
      }
      const data = await res.json();
      
      if (data.status === "OK" && data.result) {
        const place = data.result;
        const loc: Location = {
          id: place.place_id || placeId,
          name: place.formatted_address || place.name || placeId,
          city: undefined,
          state: undefined,
          lat: place.geometry?.location?.lat,
          lng: place.geometry?.location?.lng,
        };
        
        if (place.address_components) {
          for (const c of place.address_components) {
            if (c.types.includes("locality")) loc.city = c.long_name;
            if (c.types.includes("administrative_area_level_1")) loc.state = c.long_name;
            if (!loc.city && c.types.includes("sublocality")) loc.city = c.long_name;
          }
        }
        
        placeCache.current.set(placeId, loc);
        console.log("REST API fetched coordinates for", loc.name, ":", loc.lat, loc.lng);
        return loc;
      } else {
        console.error("REST API returned error status:", data.status, data.error_message);
        return null;
      }
    } catch (e) {
      console.error("fetchPlaceDetailsREST error", e);
      return null;
    }
  }, []);

  // Server fallback to fetch place details (if caller supplies server endpoints)
  const fetchPlaceDetailsServer = useCallback(async (placeId: string) => {
    if (placeCache.current.has(placeId)) return placeCache.current.get(placeId) ?? null;
    try {
      const res = await fetch(`/api/locations/details?placeId=${encodeURIComponent(placeId)}`);
      if (!res.ok) return null;
      const payload = await res.json();
      if (payload?.status === "success" && payload.data) {
        const d = payload.data;
        const loc: Location = {
          id: placeId,
          name: d.address ?? d.name ?? placeId,
          city: d.city,
          state: d.state,
          lat: d.lat,
          lng: d.lng,
        };
        placeCache.current.set(placeId, loc);
        return loc;
      }
      return null;
    } catch (e) {
      console.error("fetchPlaceDetailsServer error", e);
      return null;
    }
  }, []);

  // Central search runner (debounced caller uses this)
  const runSearch = useCallback(
    async (q: string) => {
      if (q.length < minLength) {
        setSuggestions([]);
        setIsLoading(false);
        return;
      }

      // cache hit
      const cached = queryCache.current.get(q);
      if (cached) {
        setSuggestions(cached.slice(0, 10));
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      // If caller provided fetchSuggestions (server-mode), prefer that (with abort support)
      if (fetchSuggestions) {
        // abort previous
        try {
          if (serverAbortRef.current) {
            serverAbortRef.current.abort();
            serverAbortRef.current = null;
          }
        } catch {}
        serverAbortRef.current = new AbortController();
        const signal = serverAbortRef.current.signal;

        try {
          // If the fetchSuggestions function accepts a signal, it should use it; else this still works.
          const res = await fetchSuggestions(q);
          // Only update if not aborted
          if (!signal.aborted) {
            queryCache.current.set(q, res || []);
            setSuggestions((res || []).slice(0, 10));
          }
        } catch (e) {
          if ((e as any)?.name === "AbortError") {
            // ignore
          } else {
            console.error("fetchSuggestions error", e);
            setSuggestions([]);
          }
        } finally {
          if (serverAbortRef.current && serverAbortRef.current.signal === signal) {
            serverAbortRef.current = null;
          }
          setIsLoading(false);
        }
        return;
      }

      // Otherwise prefer server-debounced hook (if provided) then fallback to Google
      // Increase req id for google to ignore out-of-order responses
      const reqId = ++lastGoogleReqId.current;

      // if server-side hook exists, try it first (it may call your API endpoint)
      let handled = false;
      if (serverDebounced) {
        try {
          await new Promise<void>((resolve) => {
            serverDebounced(q, (res: Location[] | null) => {
              if (res && res.length) {
                queryCache.current.set(q, res);
                setSuggestions(res.slice(0, 10));
                setIsLoading(false);
                handled = true;
              }
              resolve();
            });
          });
        } catch (e) {
          console.error("serverDebounced error", e);
        }
      }

      if (handled) return;

      // fallback: Google predictions
      if (googleLoaded && autocompleteServiceRef.current) {
        try {
          const googleRes = await fetchGooglePredictions(q, reqId);
          queryCache.current.set(q, googleRes || []);
          setSuggestions((googleRes || []).slice(0, 10));
        } catch (e) {
          console.error("Google predictions error", e);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(false);
      setSuggestions([]);
    },
    [fetchSuggestions, googleLoaded, minLength, serverDebounced, fetchGooglePredictions]
  );

  // Debounce wrapper: setTimeout style
  const debounceRef = useRef<number | null>(null);
  useEffect(() => {
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
      if (serverAbortRef.current) serverAbortRef.current.abort();
    };
  }, []);

  // Watch inputText changes
  useEffect(() => {
    if (inputText.length < minLength) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      runSearch(inputText);
      debounceRef.current = null;
    }, 250);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputText]);

  // Handler for when user types
  const handleInputChange = (_: any, newInput: string) => {
    setInputText(newInput);
  };

  // When user selects an option
  const handleChange = async (_: any, newValue: Location | null) => {
    if (!newValue) {
      onChange(null);
      return;
    }

    // show the selected label immediately (prevents flicker)
    if (newValue.name) setInputText(newValue.name);

    // if place already has lat/lng return immediately
    if ((newValue as any).lat != null && (newValue as any).lng != null) {
      onChange(newValue);
      return;
    }

    // Always try to fetch place details if we have a place ID
    if (newValue.id) {
      // Check cache first
      if (placeCache.current.has(newValue.id)) {
        const cached = placeCache.current.get(newValue.id);
        if (cached && cached.lat != null && cached.lng != null) {
          onChange(cached);
          return;
        }
      }

      // Always try Google JavaScript API first if available (most reliable for coordinates)
      if (googleLoaded && placesServiceRef.current) {
        const g = await fetchPlaceDetailsGoogle(newValue.id);
        if (g && g.lat != null && g.lng != null) {
          console.log("Google JS API fetched coordinates for", g.name, ":", g.lat, g.lng);
          onChange(g);
          return;
        } else {
          console.warn("Google JS API failed to fetch coordinates for", newValue.name);
        }
      }

      // Try server API route (handles CORS and API key security)
      const serverDetails = await fetchPlaceDetailsServer(newValue.id);
      if (serverDetails && serverDetails.lat != null && serverDetails.lng != null) {
        console.log("Server API fetched coordinates for", serverDetails.name, ":", serverDetails.lat, serverDetails.lng);
        onChange(serverDetails);
        return;
      }

      // Try REST API fallback (works even if server API fails)
      const restDetails = await fetchPlaceDetailsREST(newValue.id);
      if (restDetails && restDetails.lat != null && restDetails.lng != null) {
        console.log("REST API fetched coordinates for", restDetails.name, ":", restDetails.lat, restDetails.lng);
        onChange(restDetails);
        return;
      }
    }

    // Final fallback: warn and return location without coordinates
    console.warn("LocationAutocomplete: Could not fetch coordinates for location:", newValue.name, "ID:", newValue.id);
    onChange(newValue);
  };

  const getOptionLabel = (option: Location | string) => {
    if (!option) return "";
    if (typeof option === "string") return option;
    return option.name || "";
  };

  const renderOption = (props: any, option: Location) => {
    const { key, ...rest } = props as any;
    return (
      <Box component="li" key={key} {...rest} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <LocationOn sx={{ color: "text.secondary", mr: 1 }} />
        <Typography variant="body1">{getOptionLabel(option)}</Typography>
      </Box>
    );
  };

  const isOptionEqualToValue = (option: Location, val: Location | null) =>
    Boolean(option && val && option.id && val.id && option.id === val.id);

  useEffect(() => {
    if (googleError) console.warn("Google load error:", googleError.message);
  }, [googleError]);

  return (
    <Autocomplete
      freeSolo={false}
      value={value ?? null}
      onChange={handleChange}
      inputValue={inputText}
      onInputChange={handleInputChange}
      options={suggestions}
      getOptionLabel={getOptionLabel as any}
      renderOption={renderOption as any}
      loading={isLoading}
      loadingText="Searching locations..."
      noOptionsText={inputText.length < minLength ? `Type at least ${minLength} characters` : "No locations found"}
      filterOptions={(x) => x}
      isOptionEqualToValue={isOptionEqualToValue as any}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            startAdornment: <LocationOn sx={{ color: "text.secondary", mr: 1 }} />,
            endAdornment: (
              <>
                {isLoading ? <CircularProgress size={18} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      sx={{ "& .MuiAutocomplete-listbox": { maxHeight: 300 } }}
    />
  );
}

