'use client';

import { useState, useCallback } from 'react';
import { BookingRequest, Location } from '@/types';

interface UseBookingState {
  tripType: 'one-way' | 'round-trip' | 'outstation';
  pickupLocation: Location | null;
  dropLocation: Location | null;
  scheduledTime: Date | null;
  carType: 'manual' | 'automatic';
  vehicleSize: 'hatchback' | 'sedan' | 'suv';
  damageProtection: boolean;
  couponCode: string;
  phoneNumber: string;
  isLoading: boolean;
  errors: Record<string, string>;
}

const initialState: UseBookingState = {
  tripType: 'one-way',
  pickupLocation: null,
  dropLocation: null,
  scheduledTime: null,
  carType: 'manual',
  vehicleSize: 'hatchback',
  damageProtection: false,
  couponCode: '',
  phoneNumber: '',
  isLoading: false,
  errors: {},
};

export function useBooking() {
  const [state, setState] = useState<UseBookingState>(initialState);

  const updateField = useCallback(<K extends keyof UseBookingState>(
    field: K,
    value: UseBookingState[K]
  ) => {
    setState(prev => ({
      ...prev,
      [field]: value,
      errors: {
        ...prev.errors,
        [field]: undefined, // Clear error when field is updated
      },
    }));
  }, []);

  const setError = useCallback((field: string, message: string) => {
    setState(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [field]: message,
      },
    }));
  }, []);

  const clearErrors = useCallback(() => {
    setState(prev => ({
      ...prev,
      errors: {},
    }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({
      ...prev,
      isLoading: loading,
    }));
  }, []);

  const resetBooking = useCallback(() => {
    setState(initialState);
  }, []);

  const validateBooking = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!state.pickupLocation) {
      newErrors.pickupLocation = 'Please select a pickup location';
    }

    if (state.tripType !== 'outstation' && !state.dropLocation) {
      newErrors.dropLocation = 'Please select a drop location';
    }

    if (!state.scheduledTime) {
      newErrors.scheduledTime = 'Please select when you need the driver';
    } else if (state.scheduledTime <= new Date()) {
      newErrors.scheduledTime = 'Scheduled time must be in the future';
    }

    if (!state.phoneNumber) {
      newErrors.phoneNumber = 'Please enter your phone number';
    } else if (!/^[6-9]\d{9}$/.test(state.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    setState(prev => ({
      ...prev,
      errors: newErrors,
    }));

    return Object.keys(newErrors).length === 0;
  }, [state]);

  const getBookingRequest = useCallback((): BookingRequest | null => {
    if (!validateBooking()) return null;

    return {
      tripType: state.tripType,
      pickupLocation: state.pickupLocation!,
      dropLocation: state.dropLocation || undefined,
      scheduledTime: state.scheduledTime!,
      carType: state.carType,
      vehicleSize: state.vehicleSize,
      damageProtection: state.damageProtection,
      couponCode: state.couponCode || undefined,
      phoneNumber: state.phoneNumber,
    };
  }, [state, validateBooking]);

  const isFormValid = useCallback((): boolean => {
    return !!(
      state.pickupLocation &&
      (state.tripType === 'outstation' || state.dropLocation) &&
      state.scheduledTime &&
      state.phoneNumber &&
      /^[6-9]\d{9}$/.test(state.phoneNumber)
    );
  }, [state]);

  return {
    // State
    ...state,
    
    // Actions
    updateField,
    setError,
    clearErrors,
    setLoading,
    resetBooking,
    validateBooking,
    getBookingRequest,
    isFormValid,
    
    // Computed values
    canProceed: isFormValid(),
  };
}

