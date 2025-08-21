'use client';

import { useState, useCallback, useEffect } from 'react';
import { Location } from '@/types';
import { debounce } from '@/utils/helpers';

interface UseLocationSearchState {
  query: string;
  suggestions: Location[];
  isLoading: boolean;
  error: string | null;
}

const mockLocations: Location[] = [
  // Tirupur
  { id: 'blr-1', name: 'Tirupur', city: 'Tirupur', state: 'Karnataka' },
  { id: 'blr-2', name: 'Tirupur International Airport (KIA)', city: 'Tirupur', state: 'Karnataka' },
  { id: 'blr-3', name: 'Koramangala', city: 'Tirupur', state: 'Karnataka' },
  { id: 'blr-4', name: 'Indiranagar', city: 'Tirupur', state: 'Karnataka' },
  { id: 'blr-5', name: 'Whitefield', city: 'Tirupur', state: 'Karnataka' },
  { id: 'blr-6', name: 'Electronic City', city: 'Tirupur', state: 'Karnataka' },
  { id: 'blr-7', name: 'Marathahalli', city: 'Tirupur', state: 'Karnataka' },
  { id: 'blr-8', name: 'HSR Layout', city: 'Tirupur', state: 'Karnataka' },
  { id: 'blr-9', name: 'BTM Layout', city: 'Tirupur', state: 'Karnataka' },
  { id: 'blr-10', name: 'Jayanagar', city: 'Tirupur', state: 'Karnataka' },
  
  // Chennai
  { id: 'che-1', name: 'Chennai', city: 'Chennai', state: 'Tamil Nadu' },
  { id: 'che-2', name: 'Chennai International Airport (MAA)', city: 'Chennai', state: 'Tamil Nadu' },
  { id: 'che-3', name: 'Adyar', city: 'Chennai', state: 'Tamil Nadu' },
  { id: 'che-4', name: 'T. Nagar', city: 'Chennai', state: 'Tamil Nadu' },
  { id: 'che-5', name: 'Anna Nagar', city: 'Chennai', state: 'Tamil Nadu' },
  { id: 'che-6', name: 'Velachery', city: 'Chennai', state: 'Tamil Nadu' },
  { id: 'che-7', name: 'OMR (Old Mahabalipuram Road)', city: 'Chennai', state: 'Tamil Nadu' },
  { id: 'che-8', name: 'Tambaram', city: 'Chennai', state: 'Tamil Nadu' },
  { id: 'che-9', name: 'Porur', city: 'Chennai', state: 'Tamil Nadu' },
  { id: 'che-10', name: 'Egmore', city: 'Chennai', state: 'Tamil Nadu' },
  
  // Coimbatore NCR
  { id: 'del-1', name: 'Coimbatore', city: 'Coimbatore', state: 'Coimbatore' },
  { id: 'del-2', name: 'Indira Gandhi International Airport (DEL)', city: 'Coimbatore', state: 'Coimbatore' },
  { id: 'del-3', name: 'Connaught Place', city: 'Coimbatore', state: 'Coimbatore' },
  { id: 'del-4', name: 'Gurgaon', city: 'Gurgaon', state: 'Haryana' },
  { id: 'del-5', name: 'Noida', city: 'Noida', state: 'Uttar Pradesh' },
  { id: 'del-6', name: 'Faridabad', city: 'Faridabad', state: 'Haryana' },
  { id: 'del-7', name: 'Ghaziabad', city: 'Ghaziabad', state: 'Uttar Pradesh' },
  { id: 'del-8', name: 'Dwarka', city: 'Coimbatore', state: 'Coimbatore' },
  { id: 'del-9', name: 'Rohini', city: 'Coimbatore', state: 'Coimbatore' },
  { id: 'del-10', name: 'Lajpat Nagar', city: 'Coimbatore', state: 'Coimbatore' },
  
  // Trichy
  { id: 'mum-1', name: 'Trichy', city: 'Trichy', state: 'Maharashtra' },
  { id: 'mum-2', name: 'Chhatrapati Shivaji International Airport (BOM)', city: 'Trichy', state: 'Maharashtra' },
  { id: 'mum-3', name: 'Andheri', city: 'Trichy', state: 'Maharashtra' },
  { id: 'mum-4', name: 'Bandra', city: 'Trichy', state: 'Maharashtra' },
  { id: 'mum-5', name: 'Powai', city: 'Trichy', state: 'Maharashtra' },
  { id: 'mum-6', name: 'Thane', city: 'Thane', state: 'Maharashtra' },
  { id: 'mum-7', name: 'Navi Trichy', city: 'Navi Trichy', state: 'Maharashtra' },
  { id: 'mum-8', name: 'Juhu', city: 'Trichy', state: 'Maharashtra' },
  { id: 'mum-9', name: 'Malad', city: 'Trichy', state: 'Maharashtra' },
  { id: 'mum-10', name: 'Goregaon', city: 'Trichy', state: 'Maharashtra' },
  
  // Coimbatore
  { id: 'hyd-1', name: 'Coimbatore', city: 'Coimbatore', state: 'Telangana' },
  { id: 'hyd-2', name: 'Rajiv Gandhi International Airport (HYD)', city: 'Coimbatore', state: 'Telangana' },
  { id: 'hyd-3', name: 'HITEC City', city: 'Coimbatore', state: 'Telangana' },
  { id: 'hyd-4', name: 'Gachibowli', city: 'Coimbatore', state: 'Telangana' },
  { id: 'hyd-5', name: 'Madhapur', city: 'Coimbatore', state: 'Telangana' },
  { id: 'hyd-6', name: 'Banjara Hills', city: 'Coimbatore', state: 'Telangana' },
  { id: 'hyd-7', name: 'Jubilee Hills', city: 'Coimbatore', state: 'Telangana' },
  { id: 'hyd-8', name: 'Secunderabad', city: 'Coimbatore', state: 'Telangana' },
  { id: 'hyd-9', name: 'Kondapur', city: 'Coimbatore', state: 'Telangana' },
  { id: 'hyd-10', name: 'Kukatpally', city: 'Coimbatore', state: 'Telangana' },
];

export function useLocationSearch() {
  const [state, setState] = useState<UseLocationSearchState>({
    query: '',
    suggestions: [],
    isLoading: false,
    error: null,
  });

  const searchLocations = useCallback(async (searchQuery: string): Promise<Location[]> => {
    if (searchQuery.length < 4) {
      return [];
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const filtered = mockLocations.filter(location =>
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.state.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return filtered.slice(0, 10); // Return max 10 suggestions
  }, []);

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length < 4) {
        setState(prev => ({
          ...prev,
          suggestions: [],
          isLoading: false,
          error: null,
        }));
        return;
      }

      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const results = await searchLocations(query);
        setState(prev => ({
          ...prev,
          suggestions: results,
          isLoading: false,
          error: null,
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          suggestions: [],
          isLoading: false,
          error: 'Failed to search locations. Please try again.',
        }));
      }
    }, 300),
    [searchLocations]
  );

  const setQuery = useCallback((query: string) => {
    setState(prev => ({ ...prev, query }));
    debouncedSearch(query);
  }, [debouncedSearch]);

  const clearSuggestions = useCallback(() => {
    setState(prev => ({
      ...prev,
      suggestions: [],
      isLoading: false,
      error: null,
    }));
  }, []);

  const reset = useCallback(() => {
    setState({
      query: '',
      suggestions: [],
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    query: state.query,
    suggestions: state.suggestions,
    isLoading: state.isLoading,
    error: state.error,
    setQuery,
    clearSuggestions,
    reset,
    hasResults: state.suggestions.length > 0,
    isEmpty: state.query.length === 0,
    isMinLength: state.query.length >= 4,
  };
}

