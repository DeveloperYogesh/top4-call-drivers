// src/components/ui/LocationAutocomplete.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Autocomplete,
  TextField,
  Box,
  Typography,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { LocationOn } from '@mui/icons-material';
import { Location } from '@/types';
import { useGoogleMapsLoader } from '@/hooks/useGoogleMapsLoader';
import { useLocationSearch } from '@/hooks/useLocationSearch';

interface Props {
  label: string;
  placeholder?: string;
  value: Location | null;
  onChange: (location: Location | null) => void;
  error?: boolean;
  helperText?: string;
  // optional server-side fetch function - if provided, used instead of client-side Google
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
  minLength = 3,
}: LocationAutocompleteProps) {
  const googleApiKey = process.env.GOOGLE_API_KEY;
  const { loaded: googleLoaded, error: googleError } = useGoogleMapsLoader(googleApiKey);
  const { debounced: serverDebounced } = useLocationSearch();

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const autocompleteServiceRef = useRef<any | null>(null);
  const placesServiceRef = useRef<any | null>(null);

  useEffect(() => {
    if (googleLoaded && (window as any).google && !autocompleteServiceRef.current) {
      autocompleteServiceRef.current = new (window as any).google.maps.places.AutocompleteService();
      placesServiceRef.current = new (window as any).google.maps.places.PlacesService(document.createElement('div'));
    }
  }, [googleLoaded]);

  const fetchGooglePredictions = async (input: string): Promise<Location[]> => {
    if (!autocompleteServiceRef.current) return [];
    return new Promise((resolve) => {
      autocompleteServiceRef.current.getPlacePredictions({ input, types: [] }, (predictions: any[], status: any) => {
        if (!predictions || status !== (window as any).google.maps.places.PlacesServiceStatus.OK) {
          resolve([]);
          return;
        }
        const mapped = predictions.map((p: any) => ({
          id: p.place_id,
          name: p.description,
        })) as Location[];
        resolve(mapped);
      });
    });
  };

  const fetchPlaceDetails = async (placeId: string): Promise<Location | null> => {
    if (!placesServiceRef.current) return null;
    return new Promise((resolve) => {
      placesServiceRef.current.getDetails(
        { placeId, fields: ['address_components', 'formatted_address', 'geometry', 'name'] },
        (place: any, status: any) => {
          if (!place || status !== (window as any).google.maps.places.PlacesServiceStatus.OK) {
            resolve(null);
            return;
          }

          const loc: Location = {
            id: place.place_id,
            name: place.formatted_address || place.name || place.place_id,
            city: undefined,
            state: undefined,
            lat: place.geometry?.location?.lat?.(),
            lng: place.geometry?.location?.lng?.(),
          };

          if (place.address_components) {
            for (const c of place.address_components) {
              if (c.types.includes('locality')) loc.city = c.long_name;
              if (c.types.includes('administrative_area_level_1')) loc.state = c.long_name;
              if (!loc.city && c.types.includes('sublocality')) loc.city = c.long_name;
            }
          }

          resolve(loc);
        }
      );
    });
  };

  // central function to run search (either server or google)
  const runSearch = (q: string) => {
    if (q.length < minLength) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);

    const done = (results: Location[]) => {
      setSuggestions(results.slice(0, 10));
      setIsLoading(false);
    };

    if (fetchSuggestions) {
      // use caller-provided server method
      fetchSuggestions(q).then(done).catch((e) => {
        console.error('fetchSuggestions error', e);
        done([]);
      });
      return;
    }

    // prefer server-side hook if present (e.g., /api endpoint)
    serverDebounced(q, (res) => {
      if (res && res.length) {
        done(res);
      } else if (googleLoaded && autocompleteServiceRef.current) {
        // fallback to google predictions
        fetchGooglePredictions(q).then(done).catch((e) => {
          console.error('Google predictions error', e);
          done([]);
        });
      } else {
        // if google not ready
        done([]);
      }
    });
  };

  useEffect(() => {
    if (query.length >= minLength) {
      runSearch(query);
    } else {
      setSuggestions([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const handleInputChange = (_: any, newInputValue: string) => {
    setQuery(newInputValue);
  };

  const handleChange = async (_: any, newValue: Location | null) => {
    if (!newValue) {
      onChange(null);
      return;
    }

    // if full lat/lng already present (server returned full object), just return it
    if ((newValue as any).lat && (newValue as any).lng) {
      onChange(newValue);
      return;
    }

    // If no server fetch and google available, fetch details for selected place id
    if (!fetchSuggestions && googleLoaded && placesServiceRef.current && newValue.id) {
      const detailed = await fetchPlaceDetails(newValue.id);
      onChange(detailed || newValue);
      return;
    }

    // fallback
    onChange(newValue);
  };

  const getOptionLabel = (option: Location | string) => {
    if (!option) return '';
    if (typeof option === 'string') return option;
    return option.name || '';
  };

  const renderOption = (props: any, option: Location) => (
    <Box component="li" {...props} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <LocationOn sx={{ color: 'text.secondary', mr: 1 }} />
      <Typography variant="body1">{getOptionLabel(option)}</Typography>
    </Box>
  );

  const isOptionEqualToValue = (option: Location, val: Location | null) => option.id === val?.id;

  useEffect(() => {
    if (googleError) console.warn('Google load error:', googleError.message);
  }, [googleError]);

  return (
    <Autocomplete
      freeSolo={false}
      value={value ?? null}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      options={suggestions}
      getOptionLabel={getOptionLabel as any}
      renderOption={renderOption as any}
      loading={isLoading}
      loadingText="Searching locations..."
      noOptionsText={query.length < minLength ? `Type at least ${minLength} characters` : 'No locations found'}
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
            startAdornment: <LocationOn sx={{ color: 'text.secondary', mr: 1 }} />,
            endAdornment: (
              <>
                {isLoading ? <CircularProgress size={18} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      sx={{ '& .MuiAutocomplete-listbox': { maxHeight: 300 } }}
    />
  );
}
