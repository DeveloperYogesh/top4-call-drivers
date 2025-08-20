'use client';

import React from 'react';
import {
  Autocomplete,
  TextField,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import { LocationOn } from '@mui/icons-material';
import { useLocationSearch } from '@/hooks/useLocationSearch';
import { Location } from '@/types';

interface LocationAutocompleteProps {
  label: string;
  placeholder: string;
  value: Location | null;
  onChange: (location: Location | null) => void;
  error?: boolean;
  helperText?: string;
}

export default function LocationAutocomplete({
  label,
  placeholder,
  value,
  onChange,
  error,
  helperText,
}: LocationAutocompleteProps) {
  const {
    query,
    suggestions,
    isLoading,
    setQuery,
    clearSuggestions,
  } = useLocationSearch();

  const handleInputChange = (event: any, newInputValue: string) => {
    setQuery(newInputValue);
  };

  const handleChange = (event: any, newValue: Location | null) => {
    onChange(newValue);
    if (newValue) {
      clearSuggestions();
    }
  };

  const getOptionLabel = (option: Location | string) => {
    if (typeof option === 'string') {
      return option;
    }
    return `${option.name}, ${option.state}`;
  };

  const renderOption = (props: any, option: Location) => (
    <Box component="li" {...props}>
      <LocationOn sx={{ color: 'text.secondary', mr: 2, flexShrink: 0 }} />
      <Box>
        <Typography variant="body1">{option.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {option.city}, {option.state}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Autocomplete
      value={value}
      onChange={handleChange}
      inputValue={query}
      onInputChange={handleInputChange}
      options={suggestions}
      getOptionLabel={getOptionLabel}
      renderOption={renderOption}
      loading={isLoading}
      loadingText="Searching locations..."
      noOptionsText={query.length < 4 ? "Type at least 4 characters" : "No locations found"}
      filterOptions={(x) => x} // Disable built-in filtering since we handle it
      isOptionEqualToValue={(option, value) => option.id === value.id}
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
              <LocationOn sx={{ color: 'text.secondary', mr: 1 }} />
            ),
            endAdornment: (
              <>
                {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      sx={{
        '& .MuiAutocomplete-listbox': {
          maxHeight: 300,
        },
      }}
    />
  );
}

