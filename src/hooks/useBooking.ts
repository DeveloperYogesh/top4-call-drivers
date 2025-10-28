'use client';

import { useState, useCallback } from 'react';
import { BookingRequest, Location } from '@/types';

interface UseBookingState {
  tripType: 'one-way' | 'round-trip' | 'outstation' | 'daily';
  pickupLocation: Location | null;
  dropLocation: Location | null;
  scheduledTime: Date | null;
  carType: 'manual' | 'automatic';
  vehicleSize: 'hatchback' | 'sedan' | 'suv';
  damageProtection: boolean;
  couponCode: string;
  phoneNumber: string;
  isLoading: boolean;
  // allow undefined so clearing an error can be represented
  errors: Record<string, string | undefined>;
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

  /**
   * Update a single field (except `errors`) and clear any error for that field.
   * We exclude 'errors' from this helper to keep semantics clear; use setError / clearErrors for errors specifically.
   */
  const updateField = useCallback(
    <K extends Exclude<keyof UseBookingState, 'errors'>>(field: K, value: UseBookingState[K]) => {
      setState(prev => {
        const next = { ...prev } as UseBookingState;
        // assign via `any` to satisfy TS when indexing by generic key
        (next as any)[field] = value;
        // clear any error keyed by this field name (string)
        next.errors = {
          ...prev.errors,
          [(field as string)]: undefined,
        };
        return next;
      });
    },
    []
  );

  const setError = useCallback((field: string, message: string) => {
    setState(prev => {
      const next = { ...prev } as UseBookingState;
      next.errors = {
        ...prev.errors,
        [field]: message,
      };
      return next;
    });
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
    const newErrors: Record<string, string | undefined> = {};

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

    // if (!state.phoneNumber) {
    //   newErrors.phoneNumber = 'Please enter your phone number';
    // } else if (!/^[6-9]\d{9}$/.test(state.phoneNumber)) {
    //   newErrors.phoneNumber = 'Please enter a valid phone number';
    // }
    console.log(newErrors,"this is error");
    
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
    // state fields
    ...state,

    // actions
    updateField,
    setError,
    clearErrors,
    setLoading,
    resetBooking,
    validateBooking,
    getBookingRequest,
    isFormValid,

    // computed
    canProceed: isFormValid(),
  };
}
