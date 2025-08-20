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
  // Bangalore
  { id: 'blr-1', name: 'Bangalore', city: 'Bangalore', state: 'Karnataka' },
  { id: 'blr-2', name: 'Bangalore International Airport (KIA)', city: 'Bangalore', state: 'Karnataka' },
  { id: 'blr-3', name: 'Koramangala', city: 'Bangalore', state: 'Karnataka' },
  { id: 'blr-4', name: 'Indiranagar', city: 'Bangalore', state: 'Karnataka' },
  { id: 'blr-5', name: 'Whitefield', city: 'Bangalore', state: 'Karnataka' },
  { id: 'blr-6', name: 'Electronic City', city: 'Bangalore', state: 'Karnataka' },
  { id: 'blr-7', name: 'Marathahalli', city: 'Bangalore', state: 'Karnataka' },
  { id: 'blr-8', name: 'HSR Layout', city: 'Bangalore', state: 'Karnataka' },
  { id: 'blr-9', name: 'BTM Layout', city: 'Bangalore', state: 'Karnataka' },
  { id: 'blr-10', name: 'Jayanagar', city: 'Bangalore', state: 'Karnataka' },
  
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
  
  // Delhi NCR
  { id: 'del-1', name: 'Delhi', city: 'Delhi', state: 'Delhi' },
  { id: 'del-2', name: 'Indira Gandhi International Airport (DEL)', city: 'Delhi', state: 'Delhi' },
  { id: 'del-3', name: 'Connaught Place', city: 'Delhi', state: 'Delhi' },
  { id: 'del-4', name: 'Gurgaon', city: 'Gurgaon', state: 'Haryana' },
  { id: 'del-5', name: 'Noida', city: 'Noida', state: 'Uttar Pradesh' },
  { id: 'del-6', name: 'Faridabad', city: 'Faridabad', state: 'Haryana' },
  { id: 'del-7', name: 'Ghaziabad', city: 'Ghaziabad', state: 'Uttar Pradesh' },
  { id: 'del-8', name: 'Dwarka', city: 'Delhi', state: 'Delhi' },
  { id: 'del-9', name: 'Rohini', city: 'Delhi', state: 'Delhi' },
  { id: 'del-10', name: 'Lajpat Nagar', city: 'Delhi', state: 'Delhi' },
  
  // Mumbai
  { id: 'mum-1', name: 'Mumbai', city: 'Mumbai', state: 'Maharashtra' },
  { id: 'mum-2', name: 'Chhatrapati Shivaji International Airport (BOM)', city: 'Mumbai', state: 'Maharashtra' },
  { id: 'mum-3', name: 'Andheri', city: 'Mumbai', state: 'Maharashtra' },
  { id: 'mum-4', name: 'Bandra', city: 'Mumbai', state: 'Maharashtra' },
  { id: 'mum-5', name: 'Powai', city: 'Mumbai', state: 'Maharashtra' },
  { id: 'mum-6', name: 'Thane', city: 'Thane', state: 'Maharashtra' },
  { id: 'mum-7', name: 'Navi Mumbai', city: 'Navi Mumbai', state: 'Maharashtra' },
  { id: 'mum-8', name: 'Juhu', city: 'Mumbai', state: 'Maharashtra' },
  { id: 'mum-9', name: 'Malad', city: 'Mumbai', state: 'Maharashtra' },
  { id: 'mum-10', name: 'Goregaon', city: 'Mumbai', state: 'Maharashtra' },
  
  // Hyderabad
  { id: 'hyd-1', name: 'Hyderabad', city: 'Hyderabad', state: 'Telangana' },
  { id: 'hyd-2', name: 'Rajiv Gandhi International Airport (HYD)', city: 'Hyderabad', state: 'Telangana' },
  { id: 'hyd-3', name: 'HITEC City', city: 'Hyderabad', state: 'Telangana' },
  { id: 'hyd-4', name: 'Gachibowli', city: 'Hyderabad', state: 'Telangana' },
  { id: 'hyd-5', name: 'Madhapur', city: 'Hyderabad', state: 'Telangana' },
  { id: 'hyd-6', name: 'Banjara Hills', city: 'Hyderabad', state: 'Telangana' },
  { id: 'hyd-7', name: 'Jubilee Hills', city: 'Hyderabad', state: 'Telangana' },
  { id: 'hyd-8', name: 'Secunderabad', city: 'Hyderabad', state: 'Telangana' },
  { id: 'hyd-9', name: 'Kondapur', city: 'Hyderabad', state: 'Telangana' },
  { id: 'hyd-10', name: 'Kukatpally', city: 'Hyderabad', state: 'Telangana' },
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

