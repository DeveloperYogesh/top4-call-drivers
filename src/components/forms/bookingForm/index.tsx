// File: components/booking/BookingForm.tsx
"use client";

import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/hooks/useAuth";
import { useBooking } from "@/hooks/useBooking";
import { Location } from "@/types";
import { POST } from "@/utils/helpers";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  LinearProgress,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import CarFields from "./carFields";
import ConfirmView from "./confirmView";
import LocationFields from "./locationFields";
import LottieDone from "./lottieDone";
import ScheduleField from "./scheduleField";
import UsageField from "./usageField";

// --- constants ---
const tripTypes = [
  { value: "one-way", label: "One Way" },
  { value: "round-trip", label: "Round Trip" },
  { value: "outstation", label: "Outstation" },
  { value: "daily", label: "Daily" },
];

const WEEKDAY_LABELS = [
  { key: "Sun", label: "Sun" },
  { key: "Mon", label: "Mon" },
  { key: "Tue", label: "Tue" },
  { key: "Wed", label: "Wed" },
  { key: "Thu", label: "Thu" },
  { key: "Fri", label: "Fri" },
  { key: "Sat", label: "Sat" },
];

// map to numeric values expected by backend (if it expects numbers)
const WEEKDAY_MAP: Record<string, number> = {
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
  Sun: 7,
};

interface BookingFormProps {
  isEmbedded?: boolean;
}

export default function BookingForm({ isEmbedded = false }: BookingFormProps) {
  const { user } = useAuth();

  // common UI state
  const [estimatedUsage, setEstimatedUsage] = useState<number>(3);
  const [estimatedUsageError, setEstimatedUsageError] = useState<string>("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingResponse, setBookingResponse] = useState<any | null>(null);

  const [selectedTripType, setSelectedTripType] = useState<string>(
    tripTypes[1].value
  ); // default Round Trip

  // fare state (used for non-daily)
  const [fareLoading, setFareLoading] = useState(false);
  const [fareError, setFareError] = useState<string | null>(null);
  const [fareBreakdown, setFareBreakdown] = useState<any | null>(null);

  // wizard pages
  const [page, setPage] = useState(1);
  const totalPages = user ? 2 : 3; // for non-daily wizard progress
  // IMPORTANT: non-daily flows remain wizard; daily is NOT wizard in original behavior
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

  // daily-specific
  const [dailyWeekDays, setDailyWeekDays] = useState<string[]>([]);
  const [weekdayError, setWeekdayError] = useState<string | null>(null);
  const [loginCompleted, setLoginCompleted] = useState(false);

  // fetch cancellation refs for fare API
  const fetchControllerRef = useRef<AbortController | null>(null);
  const fetchTimerRef = useRef<number | null>(null);

  // tolerant lat/long extractor
  const getLatLong = (loc?: Location | null) => {
    if (!loc) {
      console.warn("getLatLong: location is null or undefined");
      return "0, 0";
    }
    
    // Try different property names for latitude (check both direct and nested)
    const latValue = 
      (loc as any)?.latitude ?? 
      (loc as any)?.lat ?? 
      (loc as any)?.LAT ?? 
      loc.lat ??
      (loc as any)?.coordinates?.lat ??
      (loc as any)?.geometry?.location?.lat ??
      (typeof (loc as any)?.geometry?.location?.lat === 'function' 
        ? (loc as any).geometry.location.lat() 
        : undefined);
    
    // Try different property names for longitude (check both direct and nested)
    const lngValue =
      (loc as any)?.longitude ??
      (loc as any)?.lng ??
      (loc as any)?.lon ??
      (loc as any)?.LON ??
      loc.lng ??
      (loc as any)?.coordinates?.lng ??
      (loc as any)?.geometry?.location?.lng ??
      (typeof (loc as any)?.geometry?.location?.lng === 'function' 
        ? (loc as any).geometry.location.lng() 
        : undefined);
    
    // Convert to numbers and validate
    const lat = latValue != null && !isNaN(Number(latValue)) ? Number(latValue) : 0;
    const lng = lngValue != null && !isNaN(Number(lngValue)) ? Number(lngValue) : 0;
    
    // Debug log to see what we're getting
    if (lat === 0 && lng === 0) {
      console.warn("getLatLong: coordinates are 0,0. Location object:", JSON.stringify(loc, null, 2));
    } else {
      console.log("getLatLong - location:", loc.name, "lat:", lat, "lng:", lng);
    }
    
    return `${lat}, ${lng}`;
  };

  // default on mount
  useEffect(() => {
    const defaultTime = dayjs().add(1, "hour").add(5, "second").toDate();
    updateField("scheduledTime", defaultTime);
    updateField("vehicleSize", "sedan");
    updateField("carType", "manual");
    if (user?.phone) updateField("phoneNumber", user.phone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateField, user]);

  const scheduledDayjs = useMemo(
    () => (scheduledTime ? dayjs(scheduledTime) : null),
    [scheduledTime]
  );

  // fare calc helpers (unchanged for non-daily)
  const canCalculateFare = () => {
    if (!vehicleSize) return false;
    if (!isWizardFlow) {
      // daily (non-wizard) -> fare calculation not used for UI, but we still allow background calc only when weekdays chosen
      return true;
    }
    // wizard flow: require full details
    if (isWizardFlow) {
      if (!pickupLocation || !dropLocation || !scheduledTime) return false;
    }
    return true;
  };

  const calculateFareBreakdown = (): {
    baseFare: number;
    nightCharge: number;
    total: number;
  } => {
    const baseFare = 450;
    const nightCharge = 100;
    const total = baseFare + nightCharge;
    return { baseFare, nightCharge, total };
  };

  const callFareApi = async (signal?: AbortSignal) => {
    setFareLoading(true);
    setFareError(null);

    try {
      const payload: any = {
        classid: "1",
        Hours: String(estimatedUsage),
        triptype:
          selectedTripType === "one-way"
            ? "One Way"
            : selectedTripType === "daily"
            ? "Daily"
            : selectedTripType,
        pickuptype: "InCity",
        pickupplace: pickupLocation?.name || "",
        dropplace: dropLocation?.name || "",
        requestdt: scheduledTime ? dayjs(scheduledTime).format("DD/MM/YYYY") : "",
        pickuptime: scheduledTime ? dayjs(scheduledTime).format("HH:mm") : "",
        tripkms: "0",
      };
      
      

      if (selectedTripType === "daily") {
        // API-friendly weekdays as numbers "1,2,3"
        payload.weekDays = dailyWeekDays
          .map((k) => WEEKDAY_MAP[k])
          .filter(Boolean)
          .join(",");
      }

      const data = await POST("api/V1/booking/GetFareAmount", payload, {
        signal,
      });

      if (typeof data === "string") {
        setFareBreakdown(calculateFareBreakdown());
      } else if (
        data &&
        (typeof (data as any).TOTALFARE !== "undefined" ||
          typeof (data as any).BASEFARE !== "undefined")
      ) {
        const baseFare = Number((data as any).BASEFARE ?? 0);
        const nightCharge = Number((data as any).NIGHTCHARGES ?? 0);
        const totalFromApi = Number((data as any).TOTALFARE ?? NaN);

        if (!Number.isNaN(totalFromApi)) {
          setFareBreakdown({
            baseFare: Math.round(baseFare),
            nightCharge: Math.round(nightCharge),
            total: Math.round(totalFromApi),
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
        setFareBreakdown(calculateFareBreakdown());
      }
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      console.error("Fare calculation error (API):", err);
      setFareBreakdown(calculateFareBreakdown());
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

    // For daily we only calculate fare in background when weekdays are selected (optional)
    if (selectedTripType === "daily" && dailyWeekDays.length === 0) {
      setFareBreakdown(null);
      setFareError(null);
      setFareLoading(false);
      return;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pickupLocation,
    dropLocation,
    vehicleSize,
    carType,
    estimatedUsage,
    scheduledTime,
    selectedTripType,
    dailyWeekDays,
  ]);

  // Step helpers
  const handleNextToPage2 = () => {
    const newErrors: Record<string, string> = {};
    if (!pickupLocation || !pickupLocation.name)
      newErrors.pickupLocation = "Pickup location is required.";
    if (!dropLocation || !dropLocation.name)
      newErrors.dropLocation = "Drop location is required.";
    if (!scheduledTime) newErrors.scheduledTime = "Schedule time is required.";
    (updateField as any)("errors", newErrors);
    if (Object.keys(newErrors).length === 0) setPage(2);
  };

  const handleNextToPage2Daily = () => {
    const newErrors: Record<string, string> = {};
    if (!pickupLocation || !pickupLocation.name)
      newErrors.pickupLocation = "Pickup location is required.";
    if (!estimatedUsage || estimatedUsage <= 0)
      setEstimatedUsageError("Please select package hours.");
    else setEstimatedUsageError("");
    (updateField as any)("errors", newErrors);
    if (Object.keys(newErrors).length === 0 && !estimatedUsageError) {
      setLoginCompleted(false);
      setPage(2);
    }
  };

  const handleNextToPage3 = () => {
    if (!phoneNumber) {
      (updateField as any)("errors", {
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

    updateField("pickupLocation", null);
    updateField("dropLocation", null);
    updateField(
      "scheduledTime",
      dayjs().add(1, "hour").add(5, "second").toDate()
    );
    updateField("vehicleSize", "sedan");
    updateField("carType", "manual");
    updateField("phoneNumber", user?.phone || "");

    setFareBreakdown(null);
    setBookingLoading(false);
    setSelectedTripType(tripTypes[1].value);
    setEstimatedUsage(3);
    setDailyWeekDays([]);
    setWeekdayError(null);
    setLoginCompleted(false);
  };

  // callbacks to children
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

  // weekdays toggle
  const toggleWeekday = (dayKey: string) => {
    setWeekdayError(null);
    setDailyWeekDays((prev) => {
      if (prev.includes(dayKey)) return prev.filter((d) => d !== dayKey);
      return [...prev, dayKey];
    });
  };

  const validateDailyWeekdays = (): boolean => {
    if (selectedTripType !== "daily") return true;
    if (dailyWeekDays.length < 3) {
      setWeekdayError("Select at least 3 days.");
      return false;
    }
    if (dailyWeekDays.length > 7) {
      setWeekdayError("Select at most 7 days.");
      return false;
    }
    setWeekdayError(null);
    return true;
  };

  const canProceedDaily = dailyWeekDays.length >= 3;

  // unified booking function (daily: price = "")
  const handleBookNow = async () => {
    setBookingError(null);
    if (!estimatedUsage || estimatedUsage <= 0) {
      setEstimatedUsageError("Please select package hours.");
      return;
    }
    setEstimatedUsageError("");

    if (selectedTripType === "daily") {
      if (!validateDailyWeekdays()) {
        setBookingError("Please select valid weekdays (3–7 days).");
        return;
      }
    }

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

    if (!effectivePhone) {
      (updateField as any)("errors", {
        ...errors,
        phoneNumber: "Phone number is required.",
      });
      setBookingError("Phone number is required to confirm booking.");
      return;
    }

    updateField("phoneNumber", effectivePhone);

    // For non-daily flows require fareBreakdown.total; for daily we send empty price
    if (selectedTripType !== "daily" && !fareBreakdown?.total) {
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
      [
        { value: "hatchback", label: "Hatchback" },
        { value: "sedan", label: "Sedan" },
        { value: "suv", label: "SUV" },
      ].find((v) => v.value === vehicleSize)?.label || vehicleSize;

    // Debug: Log location objects before creating payload
    console.log("pickupLocation object:", pickupLocation);
    console.log("dropLocation object:", dropLocation);
    
    const payload: any = {
      tripType: selectedTripType === "one-way"
      ? "InCity"
      : selectedTripType === "outstation"
      ? "Outstation"
      : selectedTripType === "daily"
      ? "Daily"
      : selectedTripType === "round-trip"
      ? "InCity"
      : selectedTripType,
      reqType: tripLabel,
      pickupLocation: pickupLocation?.name || "",
      pickupLatLong: getLatLong(pickupLocation),
      dropLocation: dropLocation?.name || "",
      dropLatLong: getLatLong(dropLocation),
      pickupTime: scheduledTime
        ? dayjs(scheduledTime).format("YYYY-MM-DD HH:mm:ss")
        : "",
      returnTime: "",
      price: selectedTripType === "daily" ? "0" : String(fareBreakdown?.total ?? ""),
      carType: carLabel,
      packageHours: String(estimatedUsage),
      mobileNumber: effectivePhone,
    };

    console.log("payload", payload);

    if (selectedTripType === "daily") {
      payload.weekDays = dailyWeekDays
        .map((k) => WEEKDAY_MAP[k])
        .filter(Boolean)
        .join(",");
      payload.startDate = scheduledTime
        ? dayjs(scheduledTime).format("YYYY-MM-DD")
        : "";
      payload.pickupTime = scheduledTime
        ? dayjs(scheduledTime).format("HH:mm")
        : "";
    }

    try {
      const data = await POST("api/V1/booking/insertbookingnew", payload);

      if (!data || data.Success !== true) {
        throw new Error(
          (data && (data.Message || data.message)) || "Booking failed. Please try again."
        );
      }

      const bookingNo = data.Data?.BookingNo?.split(":").pop()?.trim() || "N/A";
      const paymentType = data.Data?.PaymentType || "Cash/UPI";

      setBookingResponse({ bookingNo, paymentType });
      setBookingSuccess(true);
    } catch (error: any) {
      console.error("Booking error:", error);
      setBookingError(error?.message || "An unknown error occurred. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

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
                <LottieDone />
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                  Booking Confirmed!
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Booking ID: {bookingResponse.bookingNo}
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Driver details will be sent via SMS to {phoneNumber || "your phone"}.
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
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
                    // reset daily-specific when switching
                    setDailyWeekDays([]);
                    setWeekdayError(null);
                    setLoginCompleted(false);
                  }}
                  indicatorColor="primary"
                  textColor="primary"
                  centered
                >
                  {tripTypes.map((type) => (
                    <Tab key={type.value} value={type.value} label={type.label} />
                  ))}
                </Tabs>

                <Divider sx={{ mb: 2 }} />

                {/* Non-daily flows — KEEP EXACT behavior */}
                {isWizardFlow ? (
                  // original wizard flow for one-way / round-trip / outstation
                  <Box sx={{ position: "relative" }}>
                    {page === 1 && (
                      <>
                        <LocationFields
                          includeDrop
                          pickupLocation={pickupLocation}
                          dropLocation={dropLocation}
                          onPickupChange={onPickupChange}
                          onDropChange={onDropChange}
                          errors={errors}
                        />
                        <ScheduleField
                          value={scheduledDayjs}
                          onChange={onDateChange}
                          errors={errors}
                        />
                        <CarFields
                          carType={carType}
                          vehicleSize={vehicleSize}
                          onCarTypeChange={onCarTypeChange}
                          onVehicleSizeChange={onVehicleSizeChange}
                        />
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
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                          Login to Continue
                        </Typography>
                        <LoginForm
                          onSuccess={(userData: any) => {
                            setPage(3);
                            updateField("phoneNumber", userData.phone || userData.mobile);
                          }}
                          onCancel={handleBackToPage1}
                          initialPhone={phoneNumber}
                          compact={true}
                          className="mb-4"
                        />
                        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                          <Button variant="outlined" fullWidth onClick={handleBackToPage1}>
                            Back
                          </Button>
                        </Box>
                      </>
                    )}

                    {showReview ? (
                      <>
                        <UsageField
                          value={estimatedUsage}
                          onChange={setEstimatedUsage}
                          error={estimatedUsageError}
                        />
                        <ConfirmView
                          pickupLocation={pickupLocation}
                          dropLocation={dropLocation}
                          scheduledTime={scheduledTime}
                          vehicleSize={vehicleSize}
                          carType={carType}
                          estimatedUsage={estimatedUsage}
                          fareBreakdown={fareBreakdown}
                          bookingError={bookingError}
                          bookingLoading={bookingLoading}
                          onBack={user ? handleBackToPage1 : handleBackToPage2}
                          onConfirm={handleBookNow}
                        />
                      </>
                    ) : null}
                  </Box>
                ) : (
                  // DAILY flow (3-step wizard specific to daily)
                  <Box sx={{ position: "relative" }}>
                    {/* Page 1 - pickup, usage, car (no drop) */}
                    {page === 1 && (
                      <>
                        <LocationFields
                          includeDrop={false}
                          pickupLocation={pickupLocation}
                          dropLocation={dropLocation}
                          onPickupChange={onPickupChange}
                          onDropChange={onDropChange}
                          errors={errors}
                        />
                        <UsageField
                          value={estimatedUsage}
                          onChange={setEstimatedUsage}
                          error={estimatedUsageError}
                        />
                        <CarFields
                          carType={carType}
                          vehicleSize={vehicleSize}
                          onCarTypeChange={onCarTypeChange}
                          onVehicleSizeChange={onVehicleSizeChange}
                        />
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={handleNextToPage2Daily}
                          sx={{ mt: 2 }}
                        >
                          Next
                        </Button>
                      </>
                    )}

                    {/* Page 2 - date/time + weekdays (no fare display here) */}
                    {page === 2 && (
                      <>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle1" sx={{ mb: 1 }}>
                            Select start date
                          </Typography>
                          <DatePicker
                            value={scheduledDayjs}
                            slotProps={{
                              textField: { fullWidth: true },
                            }}
                            onChange={(d: Dayjs | null) => {
                              const base = scheduledDayjs ? dayjs(scheduledDayjs) : dayjs();
                              if (!d) return onDateChange(null);
                              const combined = base
                                .set("year", d.year())
                                .set("month", d.month())
                                .set("date", d.date());
                              onDateChange(combined as Dayjs);
                            }}
                          />
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle1" sx={{ mb: 1 }}>
                            Select pick-up time
                          </Typography>
                          <TimePicker
                            value={scheduledDayjs}
                            slotProps={{
                              textField: { fullWidth: true },
                            }}
                            onChange={(t: Dayjs | null) => {
                              if (!t) return onDateChange(null);
                              const base = scheduledDayjs ? dayjs(scheduledDayjs) : dayjs();
                              const combined = base.set("hour", t.hour()).set("minute", t.minute());
                              onDateChange(combined as Dayjs);
                            }}
                          />
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle1" sx={{ mb: 1 }}>
                            Choose weekdays (select 3 to 7)
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap">
                            {WEEKDAY_LABELS.map((w) => (
                              <Chip
                                key={w.key}
                                label={w.label}
                                clickable
                                color={dailyWeekDays.includes(w.key) ? "primary" : "default"}
                                variant={dailyWeekDays.includes(w.key) ? "filled" : "outlined"}
                                onClick={() => toggleWeekday(w.key)}
                                sx={{ mb: 1 }}
                              />
                            ))}
                          </Stack>
                          {weekdayError && (
                            <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                              {weekdayError}
                            </Typography>
                          )}
                        </Box>

                        {/* intentionally not showing FareDisplay here */}

                        {bookingError && (
                          <Box sx={{ mb: 2 }}>
                            <Typography color="error">{bookingError}</Typography>
                          </Box>
                        )}

                        {user ? (
                          // logged-in user sees Confirm & Book here (must click to place booking)
                          <Box sx={{ display: "flex", gap: 2 }}>
                            <Button variant="outlined" fullWidth onClick={handleBackToPage1}>
                              Back
                            </Button>
                            <Button
                              variant="contained"
                              fullWidth
                              onClick={() => {
                                if (!validateDailyWeekdays()) return;
                                handleBookNow();
                              }}
                              disabled={bookingLoading || !canProceedDaily}
                            >
                              {bookingLoading ? <CircularProgress size={20} /> : "Confirm & Book"}
                            </Button>
                          </Box>
                        ) : (
                          // not logged in -> go to login (page 3)
                          <Box sx={{ display: "flex", gap: 2 }}>
                            <Button variant="outlined" fullWidth onClick={handleBackToPage1}>
                              Back
                            </Button>
                            <Button
                              variant="contained"
                              fullWidth
                              onClick={() => {
                                if (!validateDailyWeekdays()) {
                                  setWeekdayError("Select at least 3 days.");
                                  return;
                                }
                                setPage(3);
                              }}
                            >
                              Continue
                            </Button>
                          </Box>
                        )}
                      </>
                    )}

                    {/* Page 3 - login & confirm (for not-logged-in users or final confirm) */}
                    {page === 3 && (
                      <>
                        {!user ? (
                          <>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                              Login to Continue
                            </Typography>
                            <LoginForm
                              onSuccess={(userData: any) => {
                                setLoginCompleted(true);
                                updateField("phoneNumber", userData.phone || userData.mobile);
                              }}
                              onCancel={() => setPage(2)}
                              initialPhone={phoneNumber}
                              compact={true}
                              className="mb-4"
                            />

                            {/* show confirm after login completes */}
                            {(loginCompleted || user) && (
                              <Box sx={{ display: "flex", gap: 2 }}>
                                <Button variant="outlined" fullWidth onClick={handleBackToPage2}>
                                  Back
                                </Button>
                                <Button
                                  variant="contained"
                                  fullWidth
                                  onClick={() => {
                                    if (!validateDailyWeekdays()) {
                                      setPage(2);
                                      return;
                                    }
                                    handleBookNow();
                                  }}
                                  disabled={bookingLoading || !canProceedDaily}
                                >
                                  {bookingLoading ? <CircularProgress size={20} /> : "Confirm & Book"}
                                </Button>
                              </Box>
                            )}
                          </>
                        ) : (
                          // if user somehow reached page 3 while logged in -> show Confirm (safe)
                          <Box sx={{ display: "flex", gap: 2 }}>
                            <Button variant="outlined" fullWidth onClick={handleBackToPage2}>
                              Back
                            </Button>
                            <Button
                              variant="contained"
                              fullWidth
                              onClick={() => {
                                if (!validateDailyWeekdays()) {
                                  setPage(2);
                                  return;
                                }
                                handleBookNow();
                              }}
                              disabled={bookingLoading || !canProceedDaily}
                            >
                              {bookingLoading ? <CircularProgress size={20} /> : "Confirm & Book"}
                            </Button>
                          </Box>
                        )}
                      </>
                    )}
                  </Box>
                )}
              </>
            )}
          </div>

          {/* progress bar only for wizard flows (keeps previous behaviour) */}
          {isWizardFlow && !bookingSuccess && (
            <Box sx={{ pt: 1 }}>
              <LinearProgress variant="determinate" value={progress} sx={{ height: 6, borderRadius: 4 }} />
            </Box>
          )}
        </div>
      </div>
    </LocalizationProvider>
  );
}
