import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export interface User {
  id: string;
  mobileno: string;
  firstname: string;
  lastname: string;
  emailid?: string;
  vehiclemodel?: string;
  segment?: string;
  vehicletype?: string;
  userImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUser {
  id: string;
  mobileno: string;
  firstname: string;
  lastname: string;
  emailid?: string;
}

export interface JWTPayload {
  userId: string;
  mobileno: string;
  iat?: number;
  exp?: number;
}

// JWT Secret from environment
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.warn('JWT_SECRET not set. Using a fallback secret for build/dev. Set JWT_SECRET in production.');
}

// Use a development fallback only in non-production environments
const EFFECTIVE_JWT_SECRET = JWT_SECRET || 'dev-only-fallback-secret-not-for-production';

/**
 * Create a JWT token for a user
 */
export function createToken(user: AuthUser): string {
  const payload: JWTPayload = {
    userId: user.id,
    mobileno: user.mobileno,
  };
  
  return jwt.sign(payload, EFFECTIVE_JWT_SECRET, {
    expiresIn: '7d', // 7 days
  });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, EFFECTIVE_JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Hash a password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

/**
 * Compare a password with a hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Set authentication cookie
 */
export function setAuthCookie(token: string): string {
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = [
    `token=${token}`,
    'HttpOnly',
    'Path=/',
    'Max-Age=604800', // 7 days
    'SameSite=Lax',
    ...(isProduction ? ['Secure'] : [])
  ].join('; ');
  
  return cookieOptions;
}

/**
 * Clear authentication cookie
 */
export function clearAuthCookie(): string {
  return 'token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax';
}

/**
 * Get current user from request cookies (server-side)
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return null;
    }
    
    const payload = verifyToken(token);
    if (!payload) {
      return null;
    }
    
    // Fetch the actual user from the database for accurate SSR
    const { findUserById } = await import('./database');
    const dbUser = await findUserById(payload.userId);
    
    if (!dbUser) {
      return null; // User no longer exists
    }
    
    const user: AuthUser = {
      id: dbUser.id,
      mobileno: dbUser.mobileno,
      firstname: dbUser.firstname,
      lastname: dbUser.lastname,
      emailid: dbUser.emailid
    };
    
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Get current user from request (for API routes)
 */
export async function getCurrentUserFromRequest(request: NextRequest): Promise<AuthUser | null> {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return null;
    }
    
    const payload = verifyToken(token);
    if (!payload) {
      return null;
    }
    
    // Fetch the actual user from the database for accurate user info
    const { findUserById } = await import('./database');
    const dbUser = await findUserById(payload.userId);
    
    if (!dbUser) {
      return null; // User no longer exists
    }
    
    const user: AuthUser = {
      id: dbUser.id,
      mobileno: dbUser.mobileno,
      firstname: dbUser.firstname,
      lastname: dbUser.lastname,
      emailid: dbUser.emailid
    };
    
    return user;
  } catch (error) {
    console.error('Error getting current user from request:', error);
    return null;
  }
}

/**
 * Generate OTP (6 digits)
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Validate Indian mobile number
 */
export function validateMobileNumber(mobileno: string): boolean {
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(mobileno);
}

/**
 * Validate email
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}