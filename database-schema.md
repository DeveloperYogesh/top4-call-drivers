# Top4CallDrivers Database Schema Design

## Core Tables

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    mobile_no VARCHAR(10) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    email_id VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    vehicle_model VARCHAR(100),
    segment VARCHAR(50),
    vehicle_type VARCHAR(50),
    user_image TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### OTP Records Table
```sql
CREATE TABLE otp_records (
    id SERIAL PRIMARY KEY,
    mobile_no VARCHAR(10) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    expiry_time TIMESTAMP NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    attempts INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### States Table
```sql
CREATE TABLE states (
    id SERIAL PRIMARY KEY,
    state_name VARCHAR(100) NOT NULL,
    state_code VARCHAR(10),
    is_active BOOLEAN DEFAULT TRUE
);
```

### Cities Table
```sql
CREATE TABLE cities (
    id SERIAL PRIMARY KEY,
    city_name VARCHAR(100) NOT NULL,
    state_id INTEGER REFERENCES states(id),
    is_active BOOLEAN DEFAULT TRUE
);
```

### Vehicle Types Table
```sql
CREATE TABLE vehicle_types (
    id SERIAL PRIMARY KEY,
    type_name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    base_fare DECIMAL(10,2),
    per_km_rate DECIMAL(10,2),
    per_hour_rate DECIMAL(10,2),
    is_active BOOLEAN DEFAULT TRUE
);
```

### Trip Types Table
```sql
CREATE TABLE trip_types (
    id SERIAL PRIMARY KEY,
    type_name VARCHAR(50) NOT NULL, -- 'one_way', 'round_trip', 'outstation', 'daily'
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);
```

### Bookings Table
```sql
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    phone_no VARCHAR(10) NOT NULL,
    customer_name VARCHAR(200) NOT NULL,
    travel_date DATE NOT NULL,
    travel_time TIME NOT NULL,
    pickup_lat_lon VARCHAR(100),
    drop_lat_lon VARCHAR(100),
    pickup_place TEXT NOT NULL,
    drop_place TEXT,
    pickup_kms VARCHAR(20),
    vehicle_category VARCHAR(100),
    vehicle_type VARCHAR(100),
    trip_type VARCHAR(50),
    number_of_days INTEGER DEFAULT 1,
    number_of_hours INTEGER DEFAULT 1,
    fav_driver_id INTEGER,
    mail_id VARCHAR(255),
    outstation_city VARCHAR(100),
    outstation_state VARCHAR(100),
    travel_type VARCHAR(50),
    payment_type VARCHAR(50),
    trip_amount DECIMAL(10,2),
    coupon_code VARCHAR(50),
    discount_amount DECIMAL(10,2) DEFAULT 0,
    final_amount DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'
    driver_id INTEGER,
    booking_reference VARCHAR(100) UNIQUE,
    special_instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Drivers Table
```sql
CREATE TABLE drivers (
    id SERIAL PRIMARY KEY,
    driver_name VARCHAR(200) NOT NULL,
    mobile_no VARCHAR(10) UNIQUE NOT NULL,
    email_id VARCHAR(255),
    license_number VARCHAR(50) UNIQUE,
    experience_years INTEGER,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_trips INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    current_location VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Fare Rules Table
```sql
CREATE TABLE fare_rules (
    id SERIAL PRIMARY KEY,
    trip_type VARCHAR(50) NOT NULL,
    vehicle_type VARCHAR(100) NOT NULL,
    base_fare DECIMAL(10,2) NOT NULL,
    per_km_rate DECIMAL(10,2),
    per_hour_rate DECIMAL(10,2),
    minimum_fare DECIMAL(10,2),
    maximum_fare DECIMAL(10,2),
    city_id INTEGER REFERENCES cities(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Coupons Table
```sql
CREATE TABLE coupons (
    id SERIAL PRIMARY KEY,
    coupon_code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type VARCHAR(20), -- 'percentage', 'fixed'
    discount_value DECIMAL(10,2),
    minimum_amount DECIMAL(10,2),
    maximum_discount DECIMAL(10,2),
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    valid_from TIMESTAMP,
    valid_until TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Booking History Table
```sql
CREATE TABLE booking_history (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id),
    status VARCHAR(50) NOT NULL,
    changed_by VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Indexes for Performance

```sql
-- User indexes
CREATE INDEX idx_users_mobile_no ON users(mobile_no);
CREATE INDEX idx_users_email_id ON users(email_id);

-- Booking indexes
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_travel_date ON bookings(travel_date);
CREATE INDEX idx_bookings_created_at ON bookings(created_at);

-- OTP indexes
CREATE INDEX idx_otp_mobile_no ON otp_records(mobile_no);
CREATE INDEX idx_otp_expiry ON otp_records(expiry_time);

-- Driver indexes
CREATE INDEX idx_drivers_mobile_no ON drivers(mobile_no);
CREATE INDEX idx_drivers_is_active ON drivers(is_active);
```

## API Endpoint Mapping

Based on the Postman collection, here are the main endpoints to implement:

1. **GET /api/V1/booking/GetStateNames** - Get all states
2. **GET /api/V1/booking/GetTripandVehicleTypes** - Get trip and vehicle types
3. **POST /api/V1/booking/newuser_SignUp** - User registration
4. **GET /api/V1/booking/GetVehicleLists** - Get available vehicles
5. **POST /api/V1/booking/InsertBooking** - Create new booking
6. **POST /api/V1/booking/sendOTP** - Send OTP to mobile
7. **POST /api/V1/booking/verifyOTP** - Verify OTP
8. **POST /api/V1/booking/BookingHistory** - Get user booking history
9. **POST /api/V1/booking/GetFareAmount** - Calculate fare
10. **POST /api/V1/booking/UserDetails** - Get user details
11. **POST /api/V1/booking/cancelbooking** - Cancel booking
12. **POST /api/V1/booking/fetchCityNames** - Get cities

## Data Relationships

- Users can have multiple bookings
- Bookings belong to users and can be assigned to drivers
- States contain multiple cities
- Vehicle types have associated fare rules
- Bookings track history through booking_history table
- OTP records are temporary and linked to mobile numbers

