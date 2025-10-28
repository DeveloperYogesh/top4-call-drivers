"use client";

import LocationAutocomplete from "@/components/ui/LocationAutocomplete";
import { useAuth } from "@/hooks/useAuth";
import { useBooking } from "@/hooks/useBooking";
import { Location } from "@/types";
import { LocationOn, Schedule } from "@mui/icons-material";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import doneAnimation from "../../../public/animations/Done.json";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import LoginForm from "../auth/LoginForm";

interface TripTypeOption {
  value: string;
  label: string;
}

interface VehicleSizeOption {
  value: string;
  label: string;
  seats: number;
  luggage: number;
}

interface FareBreakdown {
  baseFare: number;
  nightCharge: number;
  total: number;
}

interface BookingResponse {
  bookingNo: string;
  paymentType: string;
}

const tripTypes: TripTypeOption[] = [
  { value: "one-way", label: "One Way" },
  { value: "round-trip", label: "Round Trip" },
  { value: "outstation", label: "Outstation" },
  { value: "daily", label: "Daily" },
];

const carTypes: TripTypeOption[] = [
  { value: "manual", label: "Manual" },
  { value: "automatic", label: "Automatic" },
];

const vehicleSizes: VehicleSizeOption[] = [
  { value: "hatchback", label: "Hatchback", seats: 4, luggage: 2 },
  { value: "sedan", label: "Sedan", seats: 4, luggage: 3 },
  { value: "suv", label: "SUV", seats: 6, luggage: 4 },
];

const usageOptions: number[] = [3, 4, 6, 8, 10, 12];

const defaultPickupLocation: Location = {
  id: "1",
  name: "Pune International Airport",
  address:
    "New Airport Rd, Pune International Airport Area, Lohegaon, Pune, Maharashtra 411032",
  latitude: 18.57951079971662,
  longitude: 73.90912064786271,
  type: "airport",
};

const defaultDropLocation: Location = {
  id: "2",
  name: "Kolkata International Airport",
  address:
    "Airport Service Rd, International Airport, Dum Dum, Kolkata, West Bengal 700052",
  latitude: 22.653890715749615,
  longitude: 88.44535291711665,
  type: "neighborhood",
};

interface BookingFormProps {
  isEmbedded?: boolean;
}

function FareBreakdownComponent({ breakdown }: { breakdown: FareBreakdown }) {
  return (
    <>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
        Fare Breakdown
      </Typography>
      <Stack spacing={1}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body2">Base Fare</Typography>
          <Typography variant="body2">
            ₹{Math.round(breakdown.total)}
          </Typography>
        </Box>
        {breakdown.nightCharge > 0 && (
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2">Night Charge</Typography>
            <Typography variant="body2">
              ₹{Math.round(breakdown.total)}
            </Typography>
          </Box>
        )}
        <Divider sx={{ my: 1 }} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Total
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontWeight: 800, color: "primary.main" }}
          >
            ₹{Math.round(breakdown.total)}
          </Typography>
        </Box>
      </Stack>
    </>
  );
}

export default function BookingForm({ isEmbedded = false }: BookingFormProps) {
  const { user } = useAuth();
  const [estimatedUsage, setEstimatedUsage] = useState<number>(3);
  const [estimatedUsageError, setEstimatedUsageError] = useState<string>("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingResponse, setBookingResponse] =
    useState<BookingResponse | null>(null);

  const [selectedTripType, setSelectedTripType] = useState<string>(
    tripTypes[1].value
  );
  const [fareLoading, setFareLoading] = useState(false);
  const [fareError, setFareError] = useState<string | null>(null);
  const [fareBreakdown, setFareBreakdown] = useState<FareBreakdown | null>(
    null
  );

  const [page, setPage] = useState(1);
  const totalPages = user ? 2 : 3;
  const isWizardFlow = selectedTripType !== "daily";
  const progress = (page / totalPages) * 100;

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
  } = useBooking();

  // set defaults on mount
  useEffect(() => {
    updateField("pickupLocation", defaultPickupLocation);
    updateField("dropLocation", defaultDropLocation);

    const defaultTime = dayjs().add(1, "hour").add(5, "second").toDate();
    updateField("scheduledTime", defaultTime);

    updateField("vehicleSize", "sedan");
    updateField("carType", "manual");

    if (user?.phone) {
      updateField("phoneNumber", user.phone);
    }
  }, [updateField, user]);

  // ensure phone is in booking state if user logs in/out
  useEffect(() => {
    const candidate =
      (user &&
        (user.phone ||
          user.mobile ||
          user.phoneNumber ||
          user.mobileNumber ||
          (user as any).MOBILE_NO ||
          user.contact)) ||
      "";

    if (candidate) {
      updateField("phoneNumber", String(candidate));
    }
  }, [user, updateField]);

  // If user logs in while `page === 3`, normalize to page 2
  useEffect(() => {
    if (user && page === 3) {
      setPage(2);
    }
  }, [user, page]);

  const calculateFareBreakdown = (): FareBreakdown => {
    const baseFare = 450;
    const nightCharge = 100;
    const subtotal = baseFare + nightCharge;
    const total = subtotal;

    return {
      baseFare,
      nightCharge,
      total,
    };
  };

  const fetchControllerRef = useRef<AbortController | null>(null);
  const fetchTimerRef = useRef<number | null>(null);

  const canCalculateFare = () => {
    if (!vehicleSize) return false;
    if (isWizardFlow) {
      if (!pickupLocation || !dropLocation || !scheduledTime) return false;
    } else {
      if (!pickupLocation) return false;
    }
    return true;
  };

  const callFareApi = async (signal?: AbortSignal) => {
    setFareLoading(true);
    setFareError(null);

    try {
      const payload = {
        classid: "1",
        Hours: String(estimatedUsage),
        triptype: selectedTripType === "one-way" ? "One Way" : selectedTripType,
        pickuptype: isWizardFlow ? "InCity" : "InCity",
        pickupplace: pickupLocation?.name || "",
        dropplace: dropLocation?.name || "",
        requestdt: scheduledTime
          ? dayjs(scheduledTime).format("DD/MM/YYYY")
          : "",
        pickuptime: scheduledTime ? dayjs(scheduledTime).format("HH:mm") : "",
        tripkms: "0",
      };

      const res = await fetch(
        "http://top4mobileapp.vbsit.in/api/V1/booking/GetFareAmount",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Basic dG9wNHdlYnNpdGU6eFRrVzY0OFc=",
          },
          body: JSON.stringify(payload),
          signal,
        }
      );

      if (!res.ok) {
        throw new Error(`Fare API returned ${res.status}`);
      }

      const data = await res.json();
      console.log("Fare API response:", data);

      if (
        data &&
        (typeof data.TOTALFARE !== "undefined" ||
          typeof data.BASEFARE !== "undefined")
      ) {
        const baseFare = Number(data.BASEFARE ?? 0);
        const nightCharge = Number(data.NIGHTCHARGES ?? 0);
        const totalFromApi = Number(data.TOTALFARE ?? NaN);

        if (!Number.isNaN(totalFromApi)) {
          const roundedBase = Math.round(baseFare);
          const roundedNight = Math.round(nightCharge);
          const roundedTotal = Math.round(totalFromApi);

          setFareBreakdown({
            baseFare: roundedBase,
            nightCharge: roundedNight,
            total: roundedTotal,
          });
        } else {
          const breakdown = calculateFareBreakdown();
          setFareBreakdown({
            baseFare: Math.round(breakdown.baseFare),
            nightCharge: Math.round(breakdown.nightCharge),
            total: Math.round(breakdown.total),
          });
        }
      } else {
        const breakdown = calculateFareBreakdown();
        setFareBreakdown(breakdown);
      }
    } catch (err: any) {
      if (err?.name === "AbortError") {
        return;
      }
      console.error("Fare calculation error (API):", err);
      const breakdown = calculateFareBreakdown();
      setFareBreakdown(breakdown);
      setFareError("Couldn't fetch live fare — showing estimated fare.");
    } finally {
      setFareLoading(false);
    }
  };

  useEffect(() => {
    if (fetchTimerRef.current) {
      window.clearTimeout(fetchTimerRef.current);
      fetchTimerRef.current = null;
    }
    if (fetchControllerRef.current) {
      fetchControllerRef.current.abort();
      fetchControllerRef.current = null;
    }

    if (!canCalculateFare()) {
      setFareBreakdown(null);
      setFareError(null);
      setFareLoading(false);
      return;
    }

    fetchTimerRef.current = window.setTimeout(() => {
      const controller = new AbortController();
      fetchControllerRef.current = controller;
      callFareApi(controller.signal);
    }, 700);

    return () => {
      if (fetchTimerRef.current) {
        window.clearTimeout(fetchTimerRef.current);
        fetchTimerRef.current = null;
      }
      if (fetchControllerRef.current) {
        fetchControllerRef.current.abort();
        fetchControllerRef.current = null;
      }
    };
  }, [
    pickupLocation,
    dropLocation,
    vehicleSize,
    carType,
    estimatedUsage,
    scheduledTime,
    selectedTripType,
    isWizardFlow,
  ]);

  const handleNextToPage2 = () => {
    const newErrors: Record<string, string> = {};

    if (!pickupLocation || !pickupLocation.name) {
      newErrors.pickupLocation = "Pickup location is required.";
    }

    if (!dropLocation || !dropLocation.name) {
      newErrors.dropLocation = "Drop location is required.";
    }

    if (!scheduledTime) {
      newErrors.scheduledTime = "Schedule time is required.";
    }

    updateField("errors", newErrors);

    const isValid = Object.keys(newErrors).length === 0;

    if (!isValid) {
      console.log("Validation failed:", newErrors);
    } else {
      setPage(2);
    }
  };

  const handleNextToPage3 = () => {
    if (!phoneNumber) {
      updateField("errors", {
        ...errors,
        phoneNumber: "Phone number is required.",
      });
      return;
    }
    setPage(3);
  };

  const handleBackToPage1 = () => setPage(1);
  const handleBackToPage2 = () => setPage(2);

  const resetForm = () => {
    setBookingSuccess(false);
    setBookingResponse(null);
    setBookingError(null);
    setPage(1);
    updateField("pickupLocation", defaultPickupLocation);
    updateField("dropLocation", defaultDropLocation);
    updateField(
      "scheduledTime",
      dayjs().add(1, "hour").add(5, "second").toDate()
    );
    updateField("vehicleSize", "sedan");
    updateField("carType", "manual");
    updateField("phoneNumber", user?.phone || "");
    setFareBreakdown(null);
    setBookingLoading(false);
    setSelectedTripType(tripTypes[0].value);
    setEstimatedUsage(3);
  };

  // handlers memoized to avoid re-creating child callbacks repeatedly
  const onPickupChange = useCallback(
    (location: Location | null) => updateField("pickupLocation", location),
    [updateField]
  );
  const onDropChange = useCallback(
    (location: Location | null) => updateField("dropLocation", location),
    [updateField]
  );
  const onCarTypeChange = useCallback(
    (val: string) => updateField("carType", val as any),
    [updateField]
  );
  const onVehicleSizeChange = useCallback(
    (val: string) => updateField("vehicleSize", val as any),
    [updateField]
  );
  const onDateChange = useCallback(
    (newValue: Dayjs | null) =>
      updateField("scheduledTime", newValue?.toDate() || null),
    [updateField]
  );

  const onPhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      updateField("phoneNumber", e.target.value),
    [updateField]
  );

  // memoized Dayjs value for DateTimePicker
  const scheduledDayjs = useMemo(
    () => (scheduledTime ? dayjs(scheduledTime) : null),
    [scheduledTime]
  );

  // unified booking function
  const handleBookNow = async () => {
    setBookingError(null);

    if (!estimatedUsage || estimatedUsage <= 0) {
      setEstimatedUsageError("Please select package hours.");
      return;
    }
    setEstimatedUsageError("");

    const effectivePhone = (
      (phoneNumber && String(phoneNumber)) ||
      (user &&
        (user.phone ||
          user.mobile ||
          user.phoneNumber ||
          user.mobileNumber ||
          (user as any).MOBILE_NO ||
          user.contact)) ||
      ""
    )
      .toString()
      .trim();

    console.log(
      "Attempting booking — phoneNumber (booking state):",
      phoneNumber,
      "effectivePhone:",
      effectivePhone,
      "user:",
      user
    );

    if (!effectivePhone) {
      updateField("errors", {
        ...errors,
        phoneNumber: "Phone number is required.",
      });
      setBookingError("Phone number is required to confirm booking.");
      return;
    }

    updateField("phoneNumber", effectivePhone);

    if (!fareBreakdown?.total) {
      setBookingError(
        "Could not determine fare. Please check details and try again."
      );
      return;
    }

    if (!vehicleSize) {
      setBookingError("Please select a vehicle type.");
      return;
    }

    setBookingLoading(true);

    const tripLabel =
      tripTypes.find((t) => t.value === selectedTripType)?.label ||
      selectedTripType;
    const carLabel =
      vehicleSizes.find((v) => v.value === vehicleSize)?.label || vehicleSize;

    const payload = {
      tripType: tripLabel,
      reqType: tripLabel,
      pickupLocation: pickupLocation?.name || "",
      pickupLatLong: `${pickupLocation?.latitude || 0}, ${
        pickupLocation?.longitude || 0
      }`,
      dropLocation: dropLocation?.name || "",
      dropLatLong: `${dropLocation?.latitude || 0}, ${
        dropLocation?.longitude || 0
      }`,
      pickupTime: scheduledTime
        ? dayjs(scheduledTime).format("YYYY-MM-DD HH:mm:ss")
        : "",
      returnTime: "",
      price: String(fareBreakdown.total),
      carType: carLabel,
      packageHours: String(estimatedUsage),
      mobileNumber: effectivePhone,
    };

    console.log("Booking Payload (sending):", payload);

    try {
      const res = await fetch(
        "http://top4mobileapp.vbsit.in/api/V1/booking/insertbookingnew",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Basic dG9wNHdlYnNpdGU6eFRrVzY0OFc=",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      console.log("Booking Response:", data);

      if (!res.ok || data.Success !== true) {
        throw new Error(data.Message || "Booking failed. Please try again.");
      }

      const bookingNo = data.Data?.BookingNo?.split(":").pop()?.trim() || "N/A";
      const paymentType = data.Data?.PaymentType || "Cash/UPI";

      setBookingResponse({ bookingNo, paymentType });
      setBookingSuccess(true);
    } catch (error: any) {
      console.error("Booking error:", error);
      setBookingError(
        error?.message || "An unknown error occurred. Please try again."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  // Subcomponents
  const LocationFields = ({
    includeDrop = true,
  }: {
    includeDrop?: boolean;
  }) => (
    <div className="mb-4">
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 2,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <LocationOn color="primary" /> Locations
      </Typography>
      <LocationAutocomplete
        key="pickup-autocomplete"
        label="Pickup Location"
        placeholder="Enter pickup location"
        value={pickupLocation}
        onChange={onPickupChange}
        error={!!errors.pickupLocation}
        helperText={errors.pickupLocation}
      />
      {includeDrop && (
        <div className="mt-4">
          <LocationAutocomplete
            key="drop-autocomplete"
            label="Drop Location"
            placeholder="Enter drop location"
            value={dropLocation}
            onChange={onDropChange}
            error={!!errors.dropLocation}
            helperText={errors.dropLocation}
          />
        </div>
      )}
    </div>
  );

  const ScheduleField = () => (
    <div className="mb-4">
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 2,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Schedule color="primary" /> When is driver needed?
      </Typography>
      <DateTimePicker
        label="Select date and time"
        value={scheduledDayjs}
        onChange={onDateChange}
        minDateTime={dayjs().add(1, "hour")}
        slotProps={{
          textField: {
            fullWidth: true,
            error: !!errors.scheduledTime,
            helperText:
              errors.scheduledTime || "Select time at least 1 hour from now",
          },
        }}
      />
    </div>
  );

  const UsageField = () => (
    <div className="mb-4">
      <FormControl fullWidth>
        <FormLabel sx={{ fontWeight: 600, mb: 1 }}>Package Hours</FormLabel>
        <Select
          value={estimatedUsage}
          onChange={(e) => setEstimatedUsage(Number(e.target.value))}
        >
          {usageOptions.map((hours) => (
            <MenuItem key={hours} value={hours}>
              {hours} Hrs
            </MenuItem>
          ))}
        </Select>
        {estimatedUsageError && (
          <Typography color="error" variant="caption">
            {estimatedUsageError}
          </Typography>
        )}
      </FormControl>
    </div>
  );

  const CarFields = () => (
    <div className="mb-4 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FormControl fullWidth>
          <FormLabel sx={{ fontWeight: 600, mb: 1 }}>Car Type</FormLabel>
          <Select
            value={carType}
            onChange={(e) => onCarTypeChange(e.target.value as string)}
          >
            {carTypes.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <FormLabel sx={{ fontWeight: 600, mb: 1 }}>Vehicle Type</FormLabel>
          <Select
            value={vehicleSize}
            onChange={(e) => onVehicleSizeChange(e.target.value as string)}
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
  );

  const FareDisplay = () => (
    <div className="mb-4">
      {fareLoading ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CircularProgress size={20} />
          <Typography>Calculating fare...</Typography>
        </Box>
      ) : fareError ? (
        <>
          <Alert severity="warning" sx={{ mb: 2 }}>
            {fareError}
          </Alert>
          {fareBreakdown && (
            <FareBreakdownComponent breakdown={fareBreakdown} />
          )}
        </>
      ) : fareBreakdown ? (
        <FareBreakdownComponent breakdown={fareBreakdown} />
      ) : null}
    </div>
  );

  // showReview guard
  const showReview =
    (user && (page === 2 || page === 3)) || (!user && page === 3);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="max-w-[450px] w-full flex justify-center">
        <div className="min-w-full bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-3 md:p-5 !pt-0">
            {bookingSuccess && bookingResponse ? (
              <Box
                sx={{
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  minHeight: 400,
                  justifyContent: "center",
                }}
              >
                <Lottie
                  animationData={doneAnimation}
                  loop={true}
                  style={{ width: 200, height: 200, marginTop: -4}}
                />
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, marginTop: -4 }}>
                  Booking Confirmed!
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Booking ID: {bookingResponse.bookingNo}
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Driver details will be sent via SMS to {phoneNumber || "your phone"}.
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Pay {bookingResponse.paymentType} at the end of the ride.
                </Typography>
                <Button variant="contained" onClick={resetForm}>
                  Make a New Booking
                </Button>
              </Box>
            ) : (
              <>
                <Tabs
                  value={selectedTripType}
                  onChange={(e, val) => {
                    setSelectedTripType(val);
                    setPage(1);
                  }}
                  indicatorColor="primary"
                  textColor="primary"
                  centered
                  sx={{
                    "& .MuiTabs-flexContainer": {
                      justifyContent: "center",
                    },
                    "& .MuiTab-root": {
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      textTransform: "none",
                    },
                  }}
                >
                  {tripTypes.map((type) => (
                    <Tab
                      key={type.value}
                      value={type.value}
                      label={type.label}
                    />
                  ))}
                </Tabs>

                <Divider sx={{ mb: 2 }} />

                {!isWizardFlow ? (
                  <>
                    <LocationFields includeDrop={false} />
                    <UsageField />
                    <CarFields />
                    {user ? (
                      <FareDisplay />
                    ) : (
                      <>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            mb: 2,
                          }}
                        >
                          Login to Continue
                        </Typography>
                        <LoginForm
                          onSuccess={(userData) => {
                            updateField(
                              "phoneNumber",
                              userData.phone || userData.mobile
                            );
                          }}
                          initialPhone={phoneNumber}
                          compact={true}
                        />
                      </>
                    )}
                    {bookingError && (
                      <Alert severity="error" sx={{ mb: 2 }}>
                        {bookingError}
                      </Alert>
                    )}
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ mt: 2, backgroundColor: "#000" }}
                      onClick={user ? handleBookNow : handleNextToPage3}
                      disabled={bookingLoading}
                    >
                      {bookingLoading ? (
                        <CircularProgress size={24} />
                      ) : user ? (
                        "Continue to Schedule Driver"
                      ) : (
                        "Next"
                      )}
                    </Button>
                  </>
                ) : (
                  <Box sx={{ position: "relative" }}>
                    {page === 1 && (
                      <>
                        <LocationFields includeDrop />
                        <ScheduleField />
                        <CarFields />
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={handleNextToPage2}
                          sx={{ mt: 2 }}
                        >
                          Next
                        </Button>
                      </>
                    )}

                    {page === 2 && !user && (
                      <>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            mb: 2,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          Login to Continue
                        </Typography>

                        <LoginForm
                          onSuccess={(userData) => {
                            setPage(3);
                            updateField(
                              "phoneNumber",
                              userData.phone || userData.mobile
                            );
                          }}
                          onCancel={handleBackToPage1}
                          initialPhone={phoneNumber}
                          compact={true}
                          className="mb-4"
                        />

                        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                          <Button
                            variant="outlined"
                            fullWidth
                            onClick={handleBackToPage1}
                          >
                            Back
                          </Button>
                        </Box>
                      </>
                    )}

                    {showReview ? (
                      <>
                        <UsageField />
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 700, mb: 2 }}
                        >
                          Review & Confirm
                        </Typography>

                        {bookingError && (
                          <Alert severity="error" sx={{ mb: 2 }}>
                            {bookingError}
                          </Alert>
                        )}

                        <Grid container spacing={2}>
                          <Grid item xs={12} md={7}>
                            <Card
                              variant="outlined"
                              sx={{ mb: 2, minWidth: "100%" }}
                            >
                              <CardContent>
                                <div className="w-full">
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      mb: 2,
                                    }}
                                  >
                                    <Chip
                                      label={`${vehicleSize || "Any"} • ${
                                        carType || "Any"
                                      }`}
                                      color="primary"
                                      variant="outlined"
                                    />
                                    <Typography
                                      variant="h5"
                                      sx={{ fontWeight: 700 }}
                                    >
                                      {estimatedUsage} Hrs
                                    </Typography>
                                  </Box>
                                  <Divider sx={{ my: 1.5, minWidth: "100%" }} />
                                  <Box sx={{ mb: 2, width: "100%" }}>
                                    <Typography
                                      variant="body1"
                                      sx={{ fontWeight: 600 }}
                                    >
                                      {pickupLocation?.name || "Not set"} →{" "}
                                      {dropLocation?.name || "Not set"}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ mb: 2 }}>
                                    <Typography
                                      variant="subtitle2"
                                      color="text.secondary"
                                    >
                                      When
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      sx={{ fontWeight: 600 }}
                                    >
                                      {scheduledTime
                                        ? dayjs(scheduledTime).format(
                                            "ddd, MMM D, h:mm A"
                                          )
                                        : "Not set"}
                                    </Typography>
                                  </Box>
                                  {fareBreakdown && (
                                    <FareBreakdownComponent
                                      breakdown={fareBreakdown}
                                    />
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                            <Box sx={{ display: "flex", gap: 2 }}>
                              <Button
                                variant="outlined"
                                fullWidth
                                onClick={
                                  user ? handleBackToPage1 : handleBackToPage2
                                }
                              >
                                Back
                              </Button>
                              <Button
                                variant="contained"
                                fullWidth
                                onClick={handleBookNow}
                                disabled={bookingLoading}
                                sx={{ backgroundColor: "#2e7d32" }}
                              >
                                {bookingLoading ? (
                                  <CircularProgress size={20} color="inherit" />
                                ) : (
                                  "Confirm Booking"
                                )}
                              </Button>
                            </Box>
                          </Grid>
                        </Grid>
                      </>
                    ) : null}
                  </Box>
                )}
              </>
            )}
          </div>

          {isWizardFlow && !bookingSuccess && (
            <Box sx={{ pt: 1 }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ height: 6, borderRadius: 4 }}
              />
            </Box>
          )}
        </div>
      </div>
    </LocalizationProvider>
  );
}
