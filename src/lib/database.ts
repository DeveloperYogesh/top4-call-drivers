import { User, AuthUser } from './auth';

// Enhanced database models based on Postman API requirements

export interface UserRecord extends User {
  passwordHash?: string;
  otpCode?: string;
  otpExpiry?: Date;
  isVerified: boolean;
  isActive: boolean;
}

export interface OTPRecord {
  id: string;
  mobileno: string;
  otp: string;
  expiry: Date;
  verified: boolean;
  attempts: number;
  createdAt: Date;
}

export interface StateRecord {
  id: string;
  stateName: string;
  stateCode: string;
  isActive: boolean;
}

export interface CityRecord {
  id: string;
  cityName: string;
  stateId: string;
  isActive: boolean;
}

export interface VehicleTypeRecord {
  id: string;
  typeName: string;
  category: string;
  baseFare: number;
  perKmRate: number;
  perHourRate: number;
  isActive: boolean;
}

export interface TripTypeRecord {
  id: string;
  typeName: 'one_way' | 'round_trip' | 'outstation' | 'daily';
  description: string;
  isActive: boolean;
}

export interface BookingRecord {
  id: string;
  userId: string;
  phoneNo: string;
  customerName: string;
  travelDate: string;
  travelTime: string;
  pickupLatLon: string;
  dropLatLon: string;
  pickupPlace: string;
  dropPlace: string;
  pickUpKMS: string;
  vehicleCategory: string;
  vehicleType: string;
  tripType: string;
  nod: string; // number of days
  noh: string; // number of hours
  favDriverId?: string;
  mailId?: string;
  outStCity: string;
  outStState: string;
  travelType: string;
  paymentType: string;
  tripAmt: number;
  couponCode?: string;
  discountAmount: number;
  finalAmount: number;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  driverId?: string;
  bookingReference: string;
  specialInstructions?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DriverRecord {
  id: string;
  driverName: string;
  mobileNo: string;
  emailId?: string;
  licenseNumber: string;
  experienceYears: number;
  rating: number;
  totalTrips: number;
  isVerified: boolean;
  isActive: boolean;
  currentLocation?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FareRuleRecord {
  id: string;
  tripType: string;
  vehicleType: string;
  baseFare: number;
  perKmRate: number;
  perHourRate: number;
  minimumFare: number;
  maximumFare: number;
  cityId?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface CouponRecord {
  id: string;
  couponCode: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minimumAmount: number;
  maximumDiscount: number;
  usageLimit: number;
  usedCount: number;
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
  createdAt: Date;
}

// In-memory storage
const users: Map<string, UserRecord> = new Map();
const otpRecords: Map<string, OTPRecord> = new Map();
const states: Map<string, StateRecord> = new Map();
const cities: Map<string, CityRecord> = new Map();
const vehicleTypes: Map<string, VehicleTypeRecord> = new Map();
const tripTypes: Map<string, TripTypeRecord> = new Map();
const bookings: Map<string, BookingRecord> = new Map();
const drivers: Map<string, DriverRecord> = new Map();
const _fareRules: Map<string, FareRuleRecord> = new Map();
const coupons: Map<string, CouponRecord> = new Map();
// Live driver location storage keyed by bookingId
interface DriverLocationRecord {
  bookingId: string;
  driverId: string;
  latitude: number;
  longitude: number;
  heading: number;
  speed: number;
  accuracy: number;
  timestamp: Date;
}
const driverLocations: Map<string, DriverLocationRecord> = new Map();

// Initialize with comprehensive seed data
function initializeDatabase() {
  // States data
  const statesData = [
    { id: '1', stateName: 'Tamil Nadu', stateCode: 'TN', isActive: true },
    { id: '2', stateName: 'Karnataka', stateCode: 'KA', isActive: true },
    { id: '3', stateName: 'Kerala', stateCode: 'KL', isActive: true },
    { id: '4', stateName: 'Andhra Pradesh', stateCode: 'AP', isActive: true },
    { id: '5', stateName: 'Telangana', stateCode: 'TS', isActive: true },
  ];
  statesData.forEach(state => states.set(state.id, state));

  // Cities data
  const citiesData = [
    { id: '1', cityName: 'Tiruppur', stateId: '1', isActive: true },
    { id: '2', cityName: 'Chennai', stateId: '1', isActive: true },
    { id: '3', cityName: 'Madurai', stateId: '1', isActive: true },
    { id: '4', cityName: 'Trichy', stateId: '1', isActive: true },
    { id: '5', cityName: 'Coimbatore', stateId: '1', isActive: true },
    { id: '6', cityName: 'Bangalore', stateId: '2', isActive: true },
    { id: '7', cityName: 'Mysore', stateId: '2', isActive: true },
    { id: '8', cityName: 'Kochi', stateId: '3', isActive: true },
    { id: '9', cityName: 'Thiruvananthapuram', stateId: '3', isActive: true },
  ];
  citiesData.forEach(city => cities.set(city.id, city));

  // Vehicle types data
  const vehicleTypesData = [
    { id: '1', typeName: 'Hatchback', category: 'Economy', baseFare: 100, perKmRate: 12, perHourRate: 150, isActive: true },
    { id: '2', typeName: 'Sedan', category: 'Premium', baseFare: 150, perKmRate: 15, perHourRate: 200, isActive: true },
    { id: '3', typeName: 'SUV', category: 'Luxury', baseFare: 200, perKmRate: 18, perHourRate: 250, isActive: true },
    { id: '4', typeName: 'Tempo Traveller', category: 'Group', baseFare: 300, perKmRate: 25, perHourRate: 400, isActive: true },
  ];
  vehicleTypesData.forEach(vehicle => vehicleTypes.set(vehicle.id, vehicle));

  // Trip types data
  const tripTypesData = [
    { id: '1', typeName: 'one_way' as const, description: 'One Way Trip', isActive: true },
    { id: '2', typeName: 'round_trip' as const, description: 'Round Trip', isActive: true },
    { id: '3', typeName: 'outstation' as const, description: 'Outstation Trip', isActive: true },
    { id: '4', typeName: 'daily' as const, description: 'Daily Rental', isActive: true },
  ];
  tripTypesData.forEach(trip => tripTypes.set(trip.id, trip));

  // Sample users
  const sampleUsers = [
    {
      id: '1',
      mobileno: '7845950289',
      firstname: 'John',
      lastname: 'Doe',
      emailid: 'john.doe@example.com',
      vehiclemodel: 'Sedan',
      segment: 'Premium',
      vehicletype: 'Manual',
      isVerified: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      mobileno: '9876543210',
      firstname: 'Jane',
      lastname: 'Smith',
      emailid: 'jane.smith@example.com',
      vehiclemodel: 'Hatchback',
      segment: 'Economy',
      vehicletype: 'Automatic',
      isVerified: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  sampleUsers.forEach(user => users.set(user.mobileno, user));

  // Sample drivers
  const sampleDrivers = [
    {
      id: '1',
      driverName: 'Ravi Kumar',
      mobileNo: '9988776655',
      emailId: 'ravi.kumar@example.com',
      licenseNumber: 'TN1234567890',
      experienceYears: 5,
      rating: 4.5,
      totalTrips: 150,
      isVerified: true,
      isActive: true,
      currentLocation: 'Tiruppur',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      driverName: 'Suresh Babu',
      mobileNo: '9876543211',
      emailId: 'suresh.babu@example.com',
      licenseNumber: 'TN0987654321',
      experienceYears: 8,
      rating: 4.8,
      totalTrips: 300,
      isVerified: true,
      isActive: true,
      currentLocation: 'Chennai',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  sampleDrivers.forEach(driver => drivers.set(driver.id, driver));

  // Sample coupons
  const sampleCoupons = [
    {
      id: '1',
      couponCode: 'FIRST100',
      description: 'Rs 100 off on your first trip',
      discountType: 'fixed' as const,
      discountValue: 100,
      minimumAmount: 200,
      maximumDiscount: 100,
      usageLimit: 1000,
      usedCount: 0,
      validFrom: new Date('2024-01-01'),
      validUntil: new Date('2024-12-31'),
      isActive: true,
      createdAt: new Date(),
    },
    {
      id: '2',
      couponCode: 'SAVE20',
      description: '20% off up to Rs 200',
      discountType: 'percentage' as const,
      discountValue: 20,
      minimumAmount: 500,
      maximumDiscount: 200,
      usageLimit: 500,
      usedCount: 0,
      validFrom: new Date('2024-01-01'),
      validUntil: new Date('2024-12-31'),
      isActive: true,
      createdAt: new Date(),
    },
  ];
  sampleCoupons.forEach(coupon => coupons.set(coupon.id, coupon));
}

// Initialize the database
initializeDatabase();

// User functions (existing)
export async function findUserByMobile(mobileno: string): Promise<UserRecord | null> {
  return users.get(mobileno) || null;
}

export async function findUserById(id: string): Promise<UserRecord | null> {
  for (const user of users.values()) {
    if (user.id === id) {
      return user;
    }
  }
  return null;
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  for (const user of users.values()) {
    if (user.emailid === email) {
      return user;
    }
  }
  return null;
}

export async function createUser(userData: Partial<UserRecord>): Promise<UserRecord> {
  const id = Date.now().toString();
  const user: UserRecord = {
    id,
    mobileno: userData.mobileno!,
    firstname: userData.firstname!,
    lastname: userData.lastname || '',
    emailid: userData.emailid,
    vehiclemodel: userData.vehiclemodel,
    segment: userData.segment,
    vehicletype: userData.vehicletype,
    userImage: userData.userImage,
    passwordHash: userData.passwordHash,
    isVerified: userData.isVerified || false,
    isActive: userData.isActive !== false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  users.set(user.mobileno, user);
  return user;
}

export async function updateUser(mobileno: string, updates: Partial<UserRecord>): Promise<UserRecord | null> {
  const user = users.get(mobileno);
  if (!user) {
    return null;
  }
  
  const updatedUser = { ...user, ...updates, updatedAt: new Date() };
  users.set(mobileno, updatedUser);
  return updatedUser;
}

// OTP functions (enhanced)
export async function storeOTP(mobileno: string, otp: string, expiryMinutes: number = 5): Promise<void> {
  const id = Date.now().toString();
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + expiryMinutes);
  
  otpRecords.set(mobileno, {
    id,
    mobileno,
    otp,
    expiry,
    verified: false,
    attempts: 0,
    createdAt: new Date(),
  });
}

export async function verifyOTP(mobileno: string, otp: string): Promise<boolean> {
  const record = otpRecords.get(mobileno);
  
  if (!record) {
    return false;
  }
  
  if (record.verified) {
    return false;
  }
  
  if (new Date() > record.expiry) {
    otpRecords.delete(mobileno);
    return false;
  }
  
  record.attempts++;
  
  if (record.otp !== otp) {
    if (record.attempts >= 3) {
      otpRecords.delete(mobileno);
    }
    return false;
  }
  
  record.verified = true;
  otpRecords.set(mobileno, record);
  
  return true;
}

// State and City functions
export async function getAllStates(): Promise<StateRecord[]> {
  return Array.from(states.values()).filter(state => state.isActive);
}

export async function getCitiesByState(stateId: string): Promise<CityRecord[]> {
  return Array.from(cities.values()).filter(city => city.stateId === stateId && city.isActive);
}

export async function getAllCities(): Promise<CityRecord[]> {
  return Array.from(cities.values()).filter(city => city.isActive);
}

// Vehicle and Trip type functions
export async function getAllVehicleTypes(): Promise<VehicleTypeRecord[]> {
  return Array.from(vehicleTypes.values()).filter(vehicle => vehicle.isActive);
}

export async function getAllTripTypes(): Promise<TripTypeRecord[]> {
  return Array.from(tripTypes.values()).filter(trip => trip.isActive);
}

// Booking functions (enhanced)
export async function createBooking(bookingData: Omit<BookingRecord, 'id' | 'status' | 'bookingReference' | 'createdAt' | 'updatedAt' | 'discountAmount' | 'finalAmount'> & { discountAmount?: number }): Promise<BookingRecord> {
  const id = Date.now().toString();
  const bookingReference = `TOP4${Date.now()}`;
  
  const booking: BookingRecord = {
    ...bookingData,
    id,
    bookingReference,
    status: 'pending',
    discountAmount: bookingData.discountAmount || 0,
    finalAmount: bookingData.tripAmt - (bookingData.discountAmount || 0),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  bookings.set(id, booking);
  return booking;
}

export async function getUserBookings(userId: string): Promise<BookingRecord[]> {
  const userBookings: BookingRecord[] = [];
  
  for (const booking of bookings.values()) {
    if (booking.userId === userId) {
      userBookings.push(booking);
    }
  }
  
  return userBookings.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function getBookingById(id: string): Promise<BookingRecord | null> {
  return bookings.get(id) || null;
}

export async function updateBookingStatus(id: string, status: BookingRecord['status']): Promise<BookingRecord | null> {
  const booking = bookings.get(id);
  if (!booking) {
    return null;
  }
  
  booking.status = status;
  booking.updatedAt = new Date();
  bookings.set(id, booking);
  
  return booking;
}

export async function cancelBooking(id: string, reason?: string): Promise<BookingRecord | null> {
  const booking = bookings.get(id);
  if (!booking) {
    return null;
  }
  
  booking.status = 'cancelled';
  booking.updatedAt = new Date();
  if (reason) {
    booking.specialInstructions = (booking.specialInstructions || '') + `\nCancellation reason: ${reason}`;
  }
  bookings.set(id, booking);
  
  return booking;
}

// Fare calculation
export async function calculateFare(tripType: string, vehicleType: string, distance: number, hours: number, cityId?: string): Promise<number> {
  const vehicleTypeRecord = Array.from(vehicleTypes.values()).find(v => v.typeName === vehicleType);
  
  if (!vehicleTypeRecord) {
    throw new Error('Invalid vehicle type');
  }
  
  let fare = vehicleTypeRecord.baseFare;
  
  if (tripType === 'one_way' || tripType === 'round_trip') {
    fare += distance * vehicleTypeRecord.perKmRate;
    if (tripType === 'round_trip') {
      fare *= 2;
    }
  } else if (tripType === 'daily' || tripType === 'outstation') {
    fare += hours * vehicleTypeRecord.perHourRate;
  }
  
  return Math.round(fare);
}

// Coupon functions
export async function getCouponByCode(couponCode: string): Promise<CouponRecord | null> {
  for (const coupon of coupons.values()) {
    if (coupon.couponCode === couponCode && coupon.isActive) {
      const now = new Date();
      if (now >= coupon.validFrom && now <= coupon.validUntil && coupon.usedCount < coupon.usageLimit) {
        return coupon;
      }
    }
  }
  return null;
}

export async function applyCoupon(couponCode: string, amount: number): Promise<{ discount: number; finalAmount: number } | null> {
  const coupon = await getCouponByCode(couponCode);
  
  if (!coupon || amount < coupon.minimumAmount) {
    return null;
  }
  
  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = Math.min((amount * coupon.discountValue) / 100, coupon.maximumDiscount);
  } else {
    discount = Math.min(coupon.discountValue, coupon.maximumDiscount);
  }
  
  const finalAmount = amount - discount;
  
  // Update usage count
  coupon.usedCount++;
  coupons.set(coupon.id, coupon);
  
  return { discount, finalAmount };
}

// Driver functions
export async function getAllDrivers(): Promise<DriverRecord[]> {
  return Array.from(drivers.values()).filter(driver => driver.isActive);
}

export async function getDriverById(id: string): Promise<DriverRecord | null> {
  return drivers.get(id) || null;
}

// Utility functions
export function userToAuthUser(user: UserRecord): AuthUser {
  return {
    id: user.id,
    mobileno: user.mobileno,
    firstname: user.firstname,
    lastname: user.lastname,
    emailid: user.emailid,
  };
}

export function generateBookingReference(): string {
  return `TOP4${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

// Driver tracking functions
export async function getDriverLocation(bookingId: string): Promise<DriverLocationRecord | null> {
  return driverLocations.get(bookingId) || null;
}

export async function updateDriverLocation(update: DriverLocationRecord): Promise<DriverLocationRecord> {
  driverLocations.set(update.bookingId, { ...update, timestamp: update.timestamp ?? new Date() });
  return driverLocations.get(update.bookingId)!;
}

