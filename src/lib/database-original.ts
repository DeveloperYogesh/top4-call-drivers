import { User, AuthUser } from './auth';

// Simple in-memory database for development
// In production, this would connect to PostgreSQL or another database
interface UserRecord extends User {
  passwordHash?: string;
  otpCode?: string;
  otpExpiry?: Date;
}

interface OTPRecord {
  mobileno: string;
  otp: string;
  expiry: Date;
  verified: boolean;
}

interface BookingRecord {
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
  nod: string;
  noh: string;
  favDriverId?: string;
  mailId?: string;
  outStCity: string;
  outStState: string;
  travelType: string;
  paymentType: string;
  tripAmt: number;
  couponCode?: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

// In-memory storage (replace with actual database in production)
let users: Map<string, UserRecord> = new Map();
let otpRecords: Map<string, OTPRecord> = new Map();
let bookings: Map<string, BookingRecord> = new Map();

// Initialize with some sample data
function initializeDatabase() {
  // Sample user for testing
  const sampleUser: UserRecord = {
    id: '1',
    mobileno: '9943299524',
    firstname: 'John',
    lastname: 'Doe',
    emailid: 'john.doe@example.com',
    vehiclemodel: 'Sedan',
    segment: 'Premium',
    vehicletype: 'Manual',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  users.set(sampleUser.mobileno, sampleUser);
}

// Initialize the database
initializeDatabase();

/**
 * Find user by mobile number
 */
export async function findUserByMobile(mobileno: string): Promise<UserRecord | null> {
  return users.get(mobileno) || null;
}

/**
 * Find user by ID
 */
export async function findUserById(id: string): Promise<UserRecord | null> {
  for (const user of users.values()) {
    if (user.id === id) {
      return user;
    }
  }
  return null;
}

/**
 * Create a new user
 */
export async function createUser(userData: Partial<UserRecord>): Promise<UserRecord> {
  const id = Date.now().toString(); // Simple ID generation
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
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  users.set(user.mobileno, user);
  return user;
}

/**
 * Update user
 */
export async function updateUser(mobileno: string, updates: Partial<UserRecord>): Promise<UserRecord | null> {
  const user = users.get(mobileno);
  if (!user) {
    return null;
  }
  
  const updatedUser = { ...user, ...updates, updatedAt: new Date() };
  users.set(mobileno, updatedUser);
  return updatedUser;
}

/**
 * Store OTP for mobile number
 */
export async function storeOTP(mobileno: string, otp: string, expiryMinutes: number = 5): Promise<void> {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + expiryMinutes);
  
  otpRecords.set(mobileno, {
    mobileno,
    otp,
    expiry,
    verified: false,
  });
}

/**
 * Verify OTP for mobile number
 */
export async function verifyOTP(mobileno: string, otp: string): Promise<boolean> {
  const record = otpRecords.get(mobileno);
  
  if (!record) {
    return false;
  }
  
  if (record.verified) {
    return false; // OTP already used
  }
  
  if (new Date() > record.expiry) {
    otpRecords.delete(mobileno); // Clean up expired OTP
    return false;
  }
  
  if (record.otp !== otp) {
    return false;
  }
  
  // Mark as verified
  record.verified = true;
  otpRecords.set(mobileno, record);
  
  return true;
}

/**
 * Create a booking
 */
export async function createBooking(bookingData: Omit<BookingRecord, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<BookingRecord> {
  const id = Date.now().toString();
  const booking: BookingRecord = {
    ...bookingData,
    id,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  bookings.set(id, booking);
  return booking;
}

/**
 * Get bookings for a user
 */
export async function getUserBookings(userId: string): Promise<BookingRecord[]> {
  const userBookings: BookingRecord[] = [];
  
  for (const booking of bookings.values()) {
    if (booking.userId === userId) {
      userBookings.push(booking);
    }
  }
  
  return userBookings.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

/**
 * Get booking by ID
 */
export async function getBookingById(id: string): Promise<BookingRecord | null> {
  return bookings.get(id) || null;
}

/**
 * Update booking status
 */
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

/**
 * Convert UserRecord to AuthUser
 */
export function userToAuthUser(user: UserRecord): AuthUser {
  return {
    id: user.id,
    mobileno: user.mobileno,
    firstname: user.firstname,
    lastname: user.lastname,
    emailid: user.emailid,
  };
}