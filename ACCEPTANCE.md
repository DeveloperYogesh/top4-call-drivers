# Authentication & API Implementation Acceptance Tests

## Overview
This document outlines the acceptance tests for the server-side authentication system and APIs implemented for Top4CallDrivers.

## Environment Setup

### Required Environment Variables
```bash
JWT_SECRET=your-strong-jwt-secret-key
NODE_ENV=production
SITE_URL=https://top4calldrivers.com
```

### Installation & Setup
```bash
npm ci
npm run build
npm start
```

## Functional Tests

### 1. Authentication Flow Tests

#### Test 1.1: Send OTP
**Endpoint:** `POST /api/auth/send-otp`
**Request:**
```json
{
  "mobileno": "04428287777"
}
```
**Expected Response:** `200 OK`
```json
{
  "status": "success",
  "message": "OTP sent successfully to your mobile number",
  "otp": "123456" // Only in development
}
```

#### Test 1.2: Verify OTP and Login
**Endpoint:** `POST /api/auth/verify-otp`
**Request:**
```json
{
  "mobileno": "04428287777",
  "OTP": "123456",
  "devicetoken": ""
}
```
**Expected Response:** `200 OK` with `Set-Cookie` header
```json
{
  "status": "success",
  "message": "OTP verified successfully",
  "user": {
    "id": "1",
    "mobileno": "04428287777",
    "firstname": "User",
    "lastname": "",
    "emailid": ""
  }
}
```

#### Test 1.3: Get Current User
**Endpoint:** `GET /api/auth/me`
**Headers:** Include authentication cookie
**Expected Response:** `200 OK`
```json
{
  "status": "success",
  "user": {
    "id": "1",
    "mobileno": "04428287777",
    "firstname": "User",
    "lastname": "",
    "emailid": ""
  }
}
```

#### Test 1.4: Logout
**Endpoint:** `POST /api/auth/logout`
**Expected Response:** `200 OK` with cookie cleared
```json
{
  "status": "success",
  "message": "Logged out successfully"
}
```

#### Test 1.5: Access Protected Route After Logout
**Endpoint:** `GET /api/auth/me`
**Expected Response:** `401 Unauthorized`
```json
{
  "status": "error",
  "message": "Not authenticated"
}
```

### 2. Booking API Tests

#### Test 2.1: Create Booking (Authenticated)
**Endpoint:** `POST /api/bookings`
**Headers:** Include authentication cookie
**Request:**
```json
{
  "PhoneNo": "04428287777",
  "CustomerName": "John Doe",
  "TravelDate": "21/11/2023",
  "TravelTime": "21:01",
  "pickuplatlon": "11.016844516639472,76.95583216845989",
  "droplatlon": "11.016844516639472,76.95583216845989",
  "PickupPlace": "Chennai",
  "DropPlace": "Coimbatore",
  "pickUpKMS": "6",
  "VehicleCategory": "SEDAN",
  "VehicleType": "DZIRE",
  "triptype": "InCity",
  "tripamt": 150
}
```
**Expected Response:** `200 OK`

#### Test 2.2: Get Booking History
**Endpoint:** `GET /api/bookings`
**Headers:** Include authentication cookie
**Expected Response:** `200 OK` with array of bookings

#### Test 2.3: Access Booking Without Authentication
**Endpoint:** `POST /api/bookings`
**Headers:** No authentication cookie
**Expected Response:** `401 Unauthorized`

### 3. Data API Tests

#### Test 3.1: Get States
**Endpoint:** `GET /api/data/states`
**Expected Response:** `200 OK` with list of states

#### Test 3.2: Get Vehicle Types
**Endpoint:** `GET /api/data/vehicles`
**Expected Response:** `200 OK` with vehicle categories and types

## Browser Tests

### Test 4.1: Server-Side Rendering Verification
1. Complete the OTP verification flow
2. Navigate to the home page (`/`)
3. Right-click and select "View Page Source"
4. **Verify:** The HTML source contains `Welcome, <firstname>` text
5. **Verify:** User information is visible in the server-rendered HTML

### Test 4.2: Cookie Persistence
1. Login using OTP verification
2. Close and reopen the browser
3. Navigate to the home page
4. **Verify:** User remains logged in (header shows welcome message)

### Test 4.3: Logout Functionality
1. Login using OTP verification
2. Click on the user dropdown in the header
3. Click "Sign Out"
4. **Verify:** Page reloads and shows "Sign In" button instead of user name
5. **Verify:** Accessing `/api/auth/me` returns 401

## Security Tests

### Test 5.1: Cookie Security Flags
1. Login using OTP verification
2. Check browser developer tools > Application > Cookies
3. **Verify:** Cookie has the following flags:
   - `HttpOnly`: ✓
   - `SameSite`: Lax
   - `Secure`: ✓ (in production only)
   - `Path`: /

### Test 5.2: JWT Secret Security
1. Check browser developer tools > Sources
2. Search for "JWT_SECRET" in all files
3. **Verify:** JWT secret is not exposed in client-side bundles

### Test 5.3: No Auth Tokens in URLs
1. Complete authentication flow
2. Check browser history and current URL
3. **Verify:** No authentication tokens appear in URLs or query parameters

## Performance Tests

### Test 6.1: Lighthouse Performance
1. Navigate to the home page
2. Open Chrome DevTools > Lighthouse
3. Run performance audit
4. **Target:** Performance score ≥ 85
5. **Target:** SEO score ≥ 90

### Test 6.2: Bundle Size Analysis
1. Run `npm run analyze`
2. Review bundle analyzer output
3. **Verify:** No single client bundle > 400-500 KB
4. **Verify:** Authentication code is not included in client bundles

## API Response Format Tests

### Test 7.1: Consistent Response Format
All API responses should follow this format:
```json
{
  "status": "success" | "error",
  "message": "Human readable message",
  "data": {} // Optional, varies by endpoint
}
```

### Test 7.2: Error Handling
1. Send invalid requests to each endpoint
2. **Verify:** Appropriate error status codes (400, 401, 403, 404, 500)
3. **Verify:** Consistent error response format

## Test Results Log

### Date: [Test Date]
### Tester: [Tester Name]

| Test ID | Test Name | Status | Notes |
|---------|-----------|--------|-------|
| 1.1 | Send OTP | ☐ Pass / ☐ Fail | |
| 1.2 | Verify OTP | ☐ Pass / ☐ Fail | |
| 1.3 | Get Current User | ☐ Pass / ☐ Fail | |
| 1.4 | Logout | ☐ Pass / ☐ Fail | |
| 1.5 | Access After Logout | ☐ Pass / ☐ Fail | |
| 2.1 | Create Booking | ☐ Pass / ☐ Fail | |
| 2.2 | Get Booking History | ☐ Pass / ☐ Fail | |
| 2.3 | Unauthenticated Access | ☐ Pass / ☐ Fail | |
| 3.1 | Get States | ☐ Pass / ☐ Fail | |
| 3.2 | Get Vehicle Types | ☐ Pass / ☐ Fail | |
| 4.1 | SSR Verification | ☐ Pass / ☐ Fail | |
| 4.2 | Cookie Persistence | ☐ Pass / ☐ Fail | |
| 4.3 | Logout Functionality | ☐ Pass / ☐ Fail | |
| 5.1 | Cookie Security | ☐ Pass / ☐ Fail | |
| 5.2 | JWT Secret Security | ☐ Pass / ☐ Fail | |
| 5.3 | No Tokens in URLs | ☐ Pass / ☐ Fail | |
| 6.1 | Lighthouse Performance | ☐ Pass / ☐ Fail | Score: ___/100 |
| 6.2 | Bundle Size | ☐ Pass / ☐ Fail | Largest bundle: ___KB |

## Notes and Issues
[Record any issues, observations, or improvements needed]

## Sign-off
- [ ] All critical tests passed
- [ ] Security requirements met
- [ ] Performance targets achieved
- [ ] Ready for production deployment

**Tested by:** ________________  
**Date:** ________________  
**Environment:** ________________