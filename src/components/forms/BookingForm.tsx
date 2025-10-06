// File: src/components/forms/BookingForm.tsx
'use client';

import LocationAutocomplete from '@/components/ui/LocationAutocomplete';
import PhoneModal from '@/components/ui/PhoneModal';
import { useBooking } from '@/hooks/useBooking';
import { Location } from '@/types';
import {
  LocationOn,
  Schedule
} from '@mui/icons-material';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useRef, useState } from 'react';

interface TripTypeOption {
  value: string;
  label: string;
}

interface VehicleSizeOption {
  value: string;
  label: string;
  price: number;
}

const tripTypes: TripTypeOption[] = [
  { value: 'one-way', label: 'One Way' },
  { value: 'round-trip', label: 'Round Trip' },
  { value: 'outstation', label: 'Outstation' },
  { value: 'daily', label: 'Daily' },
];

const carTypes: TripTypeOption[] = [
  { value: 'manual', label: 'Manual' },
  { value: 'automatic', label: 'Automatic' },
];

const vehicleSizes: VehicleSizeOption[] = [
  { value: 'hatchback', label: 'Hatchback', price: 299 },
  { value: 'sedan', label: 'Sedan', price: 399 },
  { value: 'suv', label: 'SUV', price: 499 },
];

const usageOptions: number[] = [4, 6, 8, 10, 12];

interface BookingFormProps {
  isEmbedded?: boolean;
}

export default function BookingForm({ isEmbedded = false }: BookingFormProps) {
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);

  // Keep local state for estimated usage (always required)
  const [estimatedUsage, setEstimatedUsage] = useState<number>(4);
  const [estimatedUsageError, setEstimatedUsageError] = useState<string>('');

  // booking states
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const [selectedTripType, setSelectedTripType] = useState<string>(
    tripTypes[0].value
  );

  // Fare states
  const [fareLoading, setFareLoading] = useState(false);
  const [fareAmount, setFareAmount] = useState<number | null>(null);
  const [fareData, setFareData] = useState<any>(null);
  const [fareError, setFareError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const {
    pickupLocation,
    dropLocation,
    scheduledTime,
    carType,
    vehicleSize,
    damageProtection,
    phoneNumber,
    errors,
    updateField,
    validateBooking,
    canProceed,
  } = useBooking();

  // Keep packageHours in central booking state so backend receives it
  useEffect(() => {
    updateField('packageHours', estimatedUsage);
  }, [estimatedUsage, updateField]);

  const getTripTypeLabel = (value: string) =>
    tripTypes.find((t) => t.value === value)?.label ?? value;

  // helper to format lat/lng strings
  function formatPickupLatLong(loc?: Location | null) {
    if (!loc) return '';
    const lat = (loc as any).latitude ?? (loc as any).lat ?? null;
    const lng = (loc as any).longitude ?? (loc as any).lng ?? null;
    if (lat != null && lng != null) return `${lat}, ${lng}`;
    return '';
  }

  // Convert location object to a printable place name
  function placeName(loc?: Location | null) {
    if (!loc) return '';
    return (
      (loc as any)?.name ??
      (loc as any)?.label ??
      (loc as any)?.formatted_address ??
      ''
    );
  }

  // ----- Fare fetching (uses the real endpoint) -----
// replace the existing fetchFareAmount() with this function
async function fetchFareAmount() {
  setFareLoading(true);
  setFareError(null);
  setFareAmount(null);
  setFareData(null);

  try {
    const classIdMap: Record<string, string> = {
      hatchback: '1',
      sedan: '2',
      suv: '3',
    };
    const classid = classIdMap[vehicleSize as string] ?? (vehicleSize ?? '1');

    const pickupPlace = placeName(pickupLocation).toUpperCase();
    const dropPlace = placeName(dropLocation).toUpperCase();

    const requestdt = scheduledTime
      ? dayjs(scheduledTime).format('DD/MM/YYYY')
      : dayjs().format('DD/MM/YYYY');

    const pickuptime = scheduledTime
      ? dayjs(scheduledTime).format('HH:mm')
      : dayjs().format('HH:mm');

    const payload = {
      classid: String(classid),
      Hours: String(estimatedUsage),
      triptype: getTripTypeLabel(selectedTripType),
      pickuptype: 'InCity',
      pickupplace: pickupPlace || '',
      droppplace: dropPlace || '',
      requestdt,
      pickuptime,
      tripkms: 0,
    };

    // <<-- Use your proxy route here (relative) -->>
    const res = await fetch('/api/pricing/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Proxy error: ${res.status} ${text}`);
    }

    // parse response (may be JSON or text)
    const text = await res.text();
    let json: any;
    try {
      json = JSON.parse(text);
    } catch {
      // if response isn't JSON, keep text
      throw new Error('Proxy returned non-JSON response: ' + text);
    }

    // Extract total fare robustly
    const total =
      json?.TOTALFARE ?? json?.TOTAL_FARE ?? json?.totalFare ?? json?.total ??
      json?.data?.TOTALFARE ?? json?.result?.TOTALFARE;

    if (total == null) {
      console.warn('fetchFareAmount - unexpected response shape:', json);
      throw new Error('Fare API returned unexpected response shape');
    }

    setFareAmount(Number(total));
    setFareData(json);
    return json;
  } catch (err: any) {
    console.error('Fare fetch error (client):', err);
    setFareError(err?.message ?? 'Failed to calculate fare');
    throw err;
  } finally {
    setFareLoading(false);
  }
}


  // Debounced auto-fetch: whenever the important inputs change, calculate fare automatically.
  const debounceRef = useRef<number | null>(null);
  useEffect(() => {
    // Conditions: we need pickupLocation, vehicleSize and estimatedUsage.
    // If trip type requires drop location (non-daily), ensure dropLocation exists.
    const needsDrop = selectedTripType !== 'daily';
    const havePickup = !!placeName(pickupLocation);
    const haveVehicle = !!vehicleSize;
    const haveHours = !!estimatedUsage && estimatedUsage > 0;
    const haveDrop = needsDrop ? !!placeName(dropLocation) : true;

    // Only auto fetch when required inputs are present
    if (!havePickup || !haveVehicle || !haveHours || !haveDrop) {
      // Clear fare if fields are incomplete
      setFareAmount(null);
      setFareData(null);
      setFareError(null);
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
      return;
    }

    // Debounce to avoid excessive calls while user types/selects
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      // call fetch (no need to await here)
      fetchFareAmount().catch(() => {
        /* errors are handled inside fetchFareAmount */
      });
      debounceRef.current = null;
    }, 700); // 700ms debounce

    // cleanup on unmount
    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
    // watch these inputs
  }, [
    pickupLocation,
    dropLocation,
    scheduledTime,
    vehicleSize,
    estimatedUsage,
    selectedTripType,
  ]);

  const handleRequestDriver = async () => {
    // run existing validation first
    const ok = validateBooking();

    // ensure hours selected
    if (!estimatedUsage || estimatedUsage <= 0) {
      setEstimatedUsageError('Please select package hours / estimated usage.');
      return;
    } else {
      setEstimatedUsageError('');
    }

    if (!ok) return;

    try {
      // If fare hasn't been calculated yet (race or first-time), fetch it now.
      if (fareAmount == null) {
        await fetchFareAmount();
      }
      // open confirmation dialog showing fare
      setConfirmOpen(true);
    } catch (err) {
      alert('Unable to calculate fare: ' + (err as any)?.message ?? '');
    }
  };

  // Called after user confirms fare and wants to create booking
  const confirmAndCreateBooking = async () => {
    setConfirmOpen(false);
    setBookingLoading(true);
    try {
      const pickupLatLongStr = formatPickupLatLong(pickupLocation);
      const dropLatLongStr = formatPickupLatLong(dropLocation);

      const payload: any = {
        tripType: getTripTypeLabel(selectedTripType),
        reqType: getTripTypeLabel(selectedTripType),
        pickupLocation:
          (pickupLocation as any)?.name ?? (pickupLocation as any)?.label ?? '',
        pickupLatLong: pickupLatLongStr,
        dropLocation:
          (dropLocation as any)?.name ?? (dropLocation as any)?.label ?? '',
        dropLatLong: dropLatLongStr,
        pickupTime: scheduledTime
          ? dayjs(scheduledTime).format('YYYY-MM-DD HH:mm:00')
          : null,
        returnTime:
          selectedTripType === 'round-trip' && scheduledTime
            ? dayjs(scheduledTime)
                .add(estimatedUsage, 'hour')
                .format('YYYY-MM-DD HH:mm:00')
            : null,
        // include the total fare we just fetched (server should re-validate)
        totalFare: fareAmount,
        carType: vehicleSize ?? carType,
        packageHours: String(estimatedUsage),
        mobileNumber: phoneNumber ?? '',
        fareResponse: fareData ?? null,
      };

      const res = await fetch('/api/booking/insertbookingnew', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Booking API error: ${res.status} ${txt}`);
      }

      const json = await res.json();
      if (json && (json.Success || json.success)) {
        setSuccessMessage(json.Message ?? 'Booking successful');
        setBookingSuccess(true);
      } else {
        throw new Error(json.Message ?? 'Booking failed');
      }
    } catch (err: any) {
      console.error('Booking error:', err);
      alert('Booking failed: ' + (err?.message ?? 'Unknown error'));
    } finally {
      setBookingLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedTripType(newValue);
  };

  // Label for the hours selector (dynamic)
  const hoursLabel =
    selectedTripType === 'round-trip' ? 'Package Hours' : 'Estimated Usage';

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div
        className={`max-w-[500px] min-w-[400px] md:min-w-[450px] w-full mx-auto ${
          isEmbedded ? '' : 'px-4'
        } bg-white rounded-2xl`}
      >
        <div className="p-4 pt-1">
          {/* Trip Type Tabs */}
          <div className="mb-0">
            <FormControl component="fieldset">
              <Tabs
                value={selectedTripType}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTab-root': {
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    textTransform: 'none',
                  },
                }}
              >
                {tripTypes.map((type) => (
                  <Tab key={type.value} value={type.value} label={type.label} />
                ))}
              </Tabs>
            </FormControl>
          </div>

          <Divider sx={{ mb: 2 }} />

          {/* Locations */}
          <div className="mb-4">
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <LocationOn color="primary" />
              Locations
            </Typography>

            <LocationAutocomplete
              label="Pickup Location"
              placeholder="Enter pickup location"
              value={pickupLocation}
              onChange={(location: Location | null) =>
                updateField('pickupLocation', location)
              }
              error={!!errors.pickupLocation}
              helperText={errors.pickupLocation}
              fetchSuggestions={async (q) => {
                try {
                  const response = await fetch(
                    `/api/locations/search?query=${encodeURIComponent(q)}`
                  );
                  const data = await response.json();
                  return data.status === 'success' ? data.data : [];
                } catch {
                  return [];
                }
              }}
            />

            {selectedTripType !== 'daily' && (
              <div className="mt-4">
                <LocationAutocomplete
                  label="Drop Location"
                  placeholder="Enter drop location"
                  value={dropLocation}
                  onChange={(location: Location | null) =>
                    updateField('dropLocation', location)
                  }
                  error={!!errors.dropLocation}
                  helperText={errors.dropLocation}
                  fetchSuggestions={async (q) => {
                    try {
                      const response = await fetch(
                        `/api/locations/search?query=${encodeURIComponent(q)}`
                      );
                      const data = await response.json();
                      return data.status === 'success' ? data.data : [];
                    } catch {
                      return [];
                    }
                  }}
                />
              </div>
            )}
          </div>

          {/* Schedule / Time */}
          {selectedTripType !== 'daily' && (
            <div className="mb-4">
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Schedule color="primary" />
                {selectedTripType === 'outstation'
                  ? 'Date & Time'
                  : 'When is driver needed?'}
              </Typography>

              <DateTimePicker
                label="Select date and time"
                value={scheduledTime ? dayjs(scheduledTime) : null}
                onChange={(newValue: Dayjs | null) =>
                  updateField('scheduledTime', newValue?.toDate() || null)
                }
                minDateTime={dayjs().add(1, 'hour')}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.scheduledTime,
                    helperText: errors.scheduledTime,
                  },
                }}
              />
            </div>
          )}

          {/* Hours selector - always visible and mandatory */}
          <div className="mb-4">
            <FormControl fullWidth>
              <FormLabel sx={{ fontWeight: 600, mb: 1 }}>{hoursLabel}</FormLabel>
              <Select
                value={estimatedUsage}
                onChange={(e) =>
                  setEstimatedUsage(Number((e.target as HTMLSelectElement).value))
                }
                displayEmpty={false}
              >
                {usageOptions.map((hours) => (
                  <MenuItem key={hours} value={hours}>
                    {hours} Hrs
                  </MenuItem>
                ))}
              </Select>
              {estimatedUsageError ? (
                <Typography
                  variant="caption"
                  sx={{ color: 'error.main', mt: 0.5 }}
                >
                  {estimatedUsageError}
                </Typography>
              ) : null}
            </FormControl>
          </div>

          {/* Car Preferences */}
          <div className="mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormControl fullWidth>
                <FormLabel sx={{ fontWeight: 600, mb: 1 }}>Car Type</FormLabel>
                <Select
                  value={carType}
                  onChange={(e) => updateField('carType', e.target.value as any)}
                >
                  {carTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <FormLabel sx={{ fontWeight: 600, mb: 1 }}>
                  Vehicle Size
                </FormLabel>
                <Select
                  value={vehicleSize}
                  onChange={(e) =>
                    updateField('vehicleSize', e.target.value as any)
                  }
                >
                  {vehicleSizes.map((size) => (
                    <MenuItem key={size.value} value={size.value}>
                      {size.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>

          {/* Show calculated fare if available */}
          <div className="mb-4">
            {fareLoading ? (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <CircularProgress size={18} />
                <Typography variant="body2">Calculating fare...</Typography>
              </div>
            ) : fareAmount != null ? (
              <div>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Estimated Fare: ₹{fareAmount.toFixed(2)}
                </Typography>
                {fareData?.NIGHTCHARGES ? (
                  <Typography variant="caption" color="text.secondary">
                    (Includes night charges)
                  </Typography>
                ) : null}
              </div>
            ) : fareError ? (
              <Typography variant="caption" color="error" sx={{ display: 'block' }}>
                {fareError}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Fare will be calculated automatically when required fields are filled.
              </Typography>
            )}
          </div>

          {/* Submit Button */}
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleRequestDriver}
            disabled={bookingLoading || fareLoading}
            sx={{
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 2,
              backgroundColor: selectedTripType === 'daily' ? '#000' : '#2e7d32',
            }}
          >
            {bookingLoading || fareLoading ? (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress size={20} style={{ color: '#fff' }} />
                Booking...
              </div>
            ) : selectedTripType === 'daily' ? (
              'Continue to Schedule Driver'
            ) : (
              'Request Driver'
            )}
          </Button>
        </div>

        <PhoneModal
          open={phoneModalOpen}
          onClose={() => setPhoneModalOpen(false)}
          phoneNumber={phoneNumber}
          onPhoneNumberChange={(phone) => updateField('phoneNumber', phone)}
        />

        {/* Fare confirmation dialog */}
        <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
          <DialogTitle>Confirm Booking</DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 1 }}>
              Estimated Fare:
              <strong> {fareAmount != null ? ` ₹${fareAmount.toFixed(2)}` : ' -'}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please confirm to create the booking. The final fare will be validated by the server.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={confirmAndCreateBooking}
              disabled={bookingLoading}
            >
              Confirm & Book
            </Button>
          </DialogActions>
        </Dialog>

        {/* Booking success dialog with simple animation */}
        <Dialog open={bookingSuccess} onClose={() => setBookingSuccess(false)}>
          <DialogContent
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 4 }}
          >
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: 120,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background:
                  'linear-gradient(135deg, rgba(46,125,50,0.15), rgba(0,200,83,0.15))',
                boxShadow: '0 8px 20px rgba(46,125,50,0.12)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Animated checkmark - CSS keyframes */}
              <svg
                width="80"
                height="80"
                viewBox="0 0 52 52"
                style={{ transform: 'scale(1)', transition: 'transform .3s ease' }}
              >
                <circle
                  cx="26"
                  cy="26"
                  r="25"
                  fill="none"
                  stroke="#2e7d32"
                  strokeWidth="2"
                  strokeDasharray="160"
                  strokeDashoffset="160"
                  style={{
                    animation: 'dashCircle 0.7s ease-out forwards',
                  }}
                />
                <path
                  fill="none"
                  stroke="#2e7d32"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 27 l7 7 l17 -17"
                  strokeDasharray="50"
                  strokeDashoffset="50"
                  style={{
                    animation: 'dashCheck 0.5s 0.7s ease-out forwards',
                  }}
                />
              </svg>
            </div>

            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Booking Confirmed
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              {successMessage || 'Your booking was created successfully.'}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBookingSuccess(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </div>

      {/* animations CSS */}
      <style jsx global>{`
        @keyframes dashCircle {
          from {
            stroke-dashoffset: 160;
            opacity: 0.6;
          }
          to {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }
        @keyframes dashCheck {
          from {
            stroke-dashoffset: 50;
            opacity: 0;
          }
          to {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }
      `}</style>
    </LocalizationProvider>
  );
}
