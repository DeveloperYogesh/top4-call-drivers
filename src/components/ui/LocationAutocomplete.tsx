'use client';

import React, { useEffect, useState } from 'react';
import {
  Autocomplete,
  TextField,
  Box,
  Typography,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { LocationOn } from '@mui/icons-material';
import { useLocationSearch, LocationSuggestion } from '@/hooks/useLocationSearch';

interface Props {
  label: string;
  placeholder: string;
  value: any;
  onChange: any;
  error?: boolean;
  helperText?: string;
  defaultSuggestions?: string[]; // simple fallback strings
  minCharsToSearch?: number;
}

export default function LocationAutocomplete({
  label,
  placeholder,
  value,
  onChange,
  error,
  helperText,
  defaultSuggestions = [],
  minCharsToSearch = 3,
}: Props) {
  const { query, setQuery, suggestions, isLoading, clearSuggestions } = useLocationSearch('');
  // Local input value avoids race between hook query and user typing
  const [inputValue, setInputValue] = useState<string>(query ?? '');

  // keep local inputValue synchronized if external query changes (rare)
  useEffect(() => {
    if (query !== inputValue) {
      setInputValue(query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // Used options: suggestions from hook (objects) OR mapped defaultSuggestions (strings)
  const options: Array<LocationSuggestion | string> =
    (suggestions && suggestions.length > 0)
      ? suggestions
      : defaultSuggestions;

  // Debug helper
  useEffect(() => {
    // helpful log while debugging — remove in production
    // eslint-disable-next-line no-console
    console.log('[LocationAutocomplete] inputValue, query, suggestions:', {
      inputValue,
      query,
      suggestionsLength: suggestions?.length ?? 0,
      suggestionsSample: suggestions?.slice(0, 3),
    });
  }, [inputValue, query, suggestions]);

  const handleInputChange = (_: any, newInput: string) => {
    setInputValue(newInput ?? '');
    // only call setQuery when length reaches threshold
    if ((newInput ?? '').length >= minCharsToSearch) {
      setQuery(newInput ?? '');
    } else {
      // clear hook suggestions when below threshold
      setQuery('');
      clearSuggestions();
    }
  };

  const handleChange = async (_: any, newValue: LocationSuggestion | string | null) => {
    if (!newValue) {
      onChange(null);
      return;
    }

    if (typeof newValue === 'string') {
      // create minimal LocationSuggestion from string
      const l: LocationSuggestion = {
        id: newValue,
        description: newValue,
        main_text: newValue,
      };
      onChange(l);
      clearSuggestions();
      return;
    }

    // if location object selected, call onChange with it
    onChange(newValue);
    // optionally fetch place details here if you implemented /api/place
    clearSuggestions();
  };

  const getOptionLabel = (opt: LocationSuggestion | string) => {
    if (!opt) return '';
    if (typeof opt === 'string') return opt;
    return opt.description || opt.main_text || String(opt.id);
  };

  const isOptionEqualToValue = (option: any, val: any) => {
    if (!option || !val) return false;
    if (typeof option === 'string' || typeof val === 'string') {
      return String(option) === String(val);
    }
    return option.id === val.id;
  };

  return (
    <Autocomplete
      freeSolo={false}
      value={value ?? null}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      options={options}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      filterOptions={(x) => x} // server-side filtering
      loading={isLoading}
      loadingText="Searching locations..."
      noOptionsText={
        (inputValue?.length ?? 0) < minCharsToSearch
          ? `Type at least ${minCharsToSearch} characters`
          : 'No locations found'
      }
      renderOption={(props, option) => {
        if (typeof option === 'string') {
          return (
            <Box component="li" {...props}>
              <LocationOn sx={{ color: 'text.secondary', mr: 2 }} />
              <Typography variant="body1">{option}</Typography>
            </Box>
          );
        }
        return (
          <Box component="li" {...props}>
            <LocationOn sx={{ color: 'text.secondary', mr: 2 }} />
            <Box>
              <Typography variant="body1">{option.main_text || option.description}</Typography>
              {option.secondary_text ? (
                <Typography variant="body2" color="text.secondary">
                  {option.secondary_text}
                </Typography>
              ) : null}
            </Box>
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <LocationOn sx={{ color: 'text.secondary', mr: 1 }} />
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {isLoading ? <CircularProgress size={18} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}
