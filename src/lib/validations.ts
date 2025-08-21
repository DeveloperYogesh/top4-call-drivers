import { z } from 'zod';
import { PHONE_REGEX, EMAIL_REGEX, COUPON_REGEX } from '@/utils/constants';

// Location schema
export const locationSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Location name is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
});

// Phone number validation
export const phoneSchema = z
  .string()
  .min(10, 'Phone number must be 10 digits')
  .max(10, 'Phone number must be 10 digits')
  .regex(PHONE_REGEX, 'Please enter a valid phone number');

// Email validation
export const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .regex(EMAIL_REGEX, 'Please enter a valid email address');

// Coupon code validation
export const couponSchema = z
  .string()
  .min(4, 'Coupon code must be at least 4 characters')
  .max(10, 'Coupon code must be at most 10 characters')
  .regex(COUPON_REGEX, 'Coupon code must contain only letters and numbers')
  .optional();

// Booking request schema
export const bookingRequestSchema = z.object({
  tripType: z.enum(['one-way', 'round-trip', 'outstation'], {
    required_error: 'Please select a trip type',
  }),
  pickupLocation: locationSchema,
  dropLocation: locationSchema.optional(),
  scheduledTime: z.date({
    required_error: 'Please select when you need the driver',
  }).refine(
    (date) => date > new Date(),
    'Scheduled time must be in the future'
  ),
  carType: z.enum(['manual', 'automatic'], {
    required_error: 'Please select car type',
  }),
  vehicleSize: z.enum(['hatchback', 'sedan', 'suv'], {
    required_error: 'Please select vehicle size',
  }),
  damageProtection: z.boolean().default(false),
  couponCode: couponSchema,
  phoneNumber: phoneSchema,
});

// OTP verification schema
export const otpVerificationSchema = z.object({
  phoneNumber: phoneSchema,
  otp: z
    .string()
    .min(6, 'OTP must be 6 digits')
    .max(6, 'OTP must be 6 digits')
    .regex(/^\d{6}$/, 'OTP must contain only numbers'),
});

// Contact form schema
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  phoneNumber: phoneSchema,
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// Newsletter subscription schema
export const newsletterSchema = z.object({
  email: emailSchema,
});

// User profile schema
export const userProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  phoneNumber: phoneSchema,
  profileImage: z.string().url().optional(),
});

// Review schema
export const reviewSchema = z.object({
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  comment: z.string().min(10, 'Comment must be at least 10 characters').optional(),
  bookingId: z.string().min(1, 'Booking ID is required'),
});

// Search location schema
export const searchLocationSchema = z.object({
  query: z.string().min(4, 'Please enter at least 4 characters to search'),
});

// Fare calculation schema
export const fareCalculationSchema = z.object({
  distance: z.number().positive('Distance must be positive'),
  duration: z.number().positive('Duration must be positive'),
  carType: z.enum(['manual', 'automatic']),
  vehicleSize: z.enum(['hatchback', 'sedan', 'suv']),
  tripType: z.enum(['one-way', 'round-trip', 'outstation']),
  damageProtection: z.boolean().default(false),
  couponCode: couponSchema,
});

// Driver registration schema
export const driverRegistrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  phoneNumber: phoneSchema,
  licenseNumber: z.string().min(10, 'License number must be at least 10 characters'),
  experience: z.number().min(1, 'Experience must be at least 1 year'),
  city: z.string().min(1, 'City is required'),
  vehicleTypes: z.array(z.enum(['hatchback', 'sedan', 'suv'])).min(1, 'Select at least one vehicle type'),
  documents: z.object({
    license: z.string().url('License document is required'),
    aadhar: z.string().url('Aadhar document is required'),
    pan: z.string().url('PAN document is required'),
    photo: z.string().url('Photo is required'),
  }),
});

// Business inquiry schema
export const businessInquirySchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  contactPerson: z.string().min(2, 'Contact person name must be at least 2 characters'),
  email: emailSchema,
  phoneNumber: phoneSchema,
  city: z.string().min(1, 'City is required'),
  employeeCount: z.enum(['1-10', '11-50', '51-200', '201-500', '500+'], {
    required_error: 'Please select employee count',
  }),
  serviceType: z.array(z.string()).min(1, 'Select at least one service type'),
  message: z.string().min(10, 'Message must be at least 10 characters').optional(),
});

// Export types
export type LocationInput = z.infer<typeof locationSchema>;
export type BookingRequestInput = z.infer<typeof bookingRequestSchema>;
export type OTPVerificationInput = z.infer<typeof otpVerificationSchema>;
export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type UserProfileInput = z.infer<typeof userProfileSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type SearchLocationInput = z.infer<typeof searchLocationSchema>;
export type FareCalculationInput = z.infer<typeof fareCalculationSchema>;
export type DriverRegistrationInput = z.infer<typeof driverRegistrationSchema>;
export type BusinessInquiryInput = z.infer<typeof businessInquirySchema>;

