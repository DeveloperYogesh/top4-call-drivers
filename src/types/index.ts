// Common types for the TOP4 Call Drivers clone application

export interface BookingRequest {
  tripType: 'one-way' | 'round-trip' | 'outstation' | 'daily';
  pickupLocation: Location;
  dropLocation?: Location;
  scheduledTime: Date;
  carType: 'manual' | 'automatic';
  vehicleSize: 'hatchback' | 'sedan' | 'suv';
  damageProtection: boolean;
  couponCode?: string;
  phoneNumber: string;
}

export interface Driver {
  id: string;
  name: string;
  rating: number;
  experience: number;
  phoneNumber: string;
  profileImage?: string;
  verified: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  driverId?: string;
  request: BookingRequest;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  estimatedFare: number;
  actualFare?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  profileImage?: string;
  driveUCoins: number;
  createdAt: Date;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  available: boolean;
  cities: string[];
}

export interface City {
  id: string;
  name: string;
  state: string;
  slug: string;
  available: boolean;
  services: string[];
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minAmount?: number;
  maxDiscount?: number;
  validFrom: Date;
  validTo: Date;
  usageLimit?: number;
  usedCount: number;
  active: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface FormErrors {
  [key: string]: string | undefined;
}

export interface CityData {
  name: string;
  slug: string;
  state: string;
  basePrice: number;
  driversCount: number;
  areasCount: number;
  areas: string[];
  description: string;
  keywords: string[];
  metaTitle?: string;
  metaDescription?: string;
}

export interface NavigationItem {
  label: string;
  href: string;
  children?: NavigationItem[];
}

// src/types/index.ts
export interface Location {
  id: string;
  name: string;
  city?: string;
  state?: string;
  lat?: number;
  lng?: number;
}
