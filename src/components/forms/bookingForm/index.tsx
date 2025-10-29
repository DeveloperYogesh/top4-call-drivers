// File: components/booking/BookingForm.tsx
"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  LinearProgress,
  Tabs,
  Tab,
  Typography,
} from "@mui/material";
import { useAuth } from "@/hooks/useAuth";
import { useBooking } from "@/hooks/useBooking";
import { Location } from "@/types";
import LocationFields from "./locationFields";
import UsageField from "./usageField";
import CarFields from "./carFields";
import LottieDone from "./lottieDone";
import FareDisplay from "./fareDisplay";
import ScheduleField from "./scheduleField";
import ConfirmView from "./confirmView";
import LoginForm from "@/components/auth/LoginForm";
import { POST } from "@/utils/helpers";

// --- constants (kept small) ---
const tripTypes = [
  { value: "one-way", label: "One Way" },
  { value: "round-trip", label: "Round Trip" },
  { value: "outstation", label: "Outstation" },
  // { value: "daily", label: "Daily" },
];

interface BookingFormProps {
  isEmbedded?: boolean;
}

export default function BookingForm({ isEmbedded = false }: BookingFormProps) {
  const { user } = useAuth();
  const [estimatedUsage, setEstimatedUsage] = useState<number>(3);
  const [estimatedUsageError, setEstimatedUsageError] = useState<string>("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingResponse, setBookingResponse] = useState<any | null>(null);

  const [selectedTripType, setSelectedTripType] = useState<string>(
    tripTypes[1].value
  );
  const [fareLoading, setFareLoading] = useState(false);
  const [fareError, setFareError] = useState<string | null>(null);
  const [fareBreakdown, setFareBreakdown] = useState<any | null>(null);

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

  // tolerant lat/long extractor to avoid TypeScript errors when Location shape varies
  const getLatLong = (loc?: Location | null) => {
    const lat =
      (loc as any)?.latitude ?? (loc as any)?.lat ?? (loc as any)?.LAT ?? 0;
    const lng =
      (loc as any)?.longitude ??
      (loc as any)?.lng ??
      (loc as any)?.lon ??
      (loc as any)?.LON ??
      0;
    return `${lat}, ${lng}`;
  };

  // set defaults on mount
  useEffect(() => {
    const defaultTime = dayjs().add(1, "hour").add(5, "second").toDate();
    updateField("scheduledTime", defaultTime);
    updateField("vehicleSize", "sedan");
    updateField("carType", "manual");
    if (user?.phone) updateField("phoneNumber", user.phone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateField, user]);

  // keep a memoized Dayjs value for date picker child
  const scheduledDayjs = useMemo(
    () => (scheduledTime ? dayjs(scheduledTime) : null),
    [scheduledTime]
  );

  // Placeholders for the fare API logic — you can move this into a service file later
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

  // full callFareApi implementation (uses your live API via the proxy)
  const calculateFareBreakdown = (): {
    baseFare: number;
    nightCharge: number;
    total: number;
  } => {
    const baseFare = 450;
    const nightCharge = 100;
    const subtotal = baseFare + nightCharge;
    const total = subtotal;
    return { baseFare, nightCharge, total };
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
        requestdt: scheduledTime ? dayjs(scheduledTime).format("DD/MM/YYYY") : "",
        pickuptime: scheduledTime ? dayjs(scheduledTime).format("HH:mm") : "",
        tripkms: "0",
      };

      // Use POST helper that calls /api/proxy/booking/GetFareAmount
      const data = await POST("api/V1/booking/GetFareAmount", payload, { signal });

      // If remote returns non-JSON or a string, handle gracefully
      if (typeof data === "string") {
        // Remote returned raw text — fall back to estimate
        const breakdown = calculateFareBreakdown();
        setFareBreakdown(breakdown);
      } else if (
        data &&
        (typeof (data as any).TOTALFARE !== "undefined" ||
          typeof (data as any).BASEFARE !== "undefined")
      ) {
        const baseFare = Number((data as any).BASEFARE ?? 0);
        const nightCharge = Number((data as any).NIGHTCHARGES ?? 0);
        const totalFromApi = Number((data as any).TOTALFARE ?? NaN);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (!pickupLocation || !pickupLocation.name)
      newErrors.pickupLocation = "Pickup location is required.";
    if (!dropLocation || !dropLocation.name)
      newErrors.dropLocation = "Drop location is required.";
    if (!scheduledTime) newErrors.scheduledTime = "Schedule time is required.";
    // cast updateField to any temporarily so TS accepts "errors" key
    (updateField as any)("errors", newErrors);
    if (Object.keys(newErrors).length === 0) setPage(2);
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
    setSelectedTripType(tripTypes[0].value);
    setEstimatedUsage(3);
  };

  // memoized callbacks handed to children
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

  // unified booking function with insertbooking API (via proxy)
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

    if (!effectivePhone) {
      (updateField as any)("errors", {
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
      [
        { value: "hatchback", label: "Hatchback" },
        { value: "sedan", label: "Sedan" },
        { value: "suv", label: "SUV" },
      ].find((v) => v.value === vehicleSize)?.label || vehicleSize;

    const payload = {
      tripType: tripLabel,
      reqType: tripLabel,
      pickupLocation: pickupLocation?.name || "",
      // use tolerant extractor to avoid TS errors if Location shape differs
      pickupLatLong: getLatLong(pickupLocation),
      dropLocation: dropLocation?.name || "",
      dropLatLong: getLatLong(dropLocation),
      pickupTime: scheduledTime
        ? dayjs(scheduledTime).format("YYYY-MM-DD HH:mm:ss")
        : "",
      returnTime: "",
      price: String(fareBreakdown.total),
      carType: carLabel,
      packageHours: String(estimatedUsage),
      mobileNumber: effectivePhone,
    };

    try {
      // use POST helper which will call /api/proxy/booking/insertbookingnew
      const data = await POST("api/V1/booking/insertbookingnew", payload);

      console.log("Booking Response:", data);

      if (!data || data.Success !== true) {
        throw new Error((data && (data.Message || data.message)) || "Booking failed. Please try again.");
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
                  Driver details will be sent via SMS to{" "}
                  {phoneNumber || "your phone"}.
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
                    {user ? (
                      <FareDisplay
                        fareLoading={fareLoading}
                        fareError={fareError}
                        fareBreakdown={fareBreakdown}
                      />
                    ) : (
                      <>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600, mb: 2 }}
                        >
                          Login to Continue
                        </Typography>
                        <LoginForm
                          onSuccess={(userData: any) => {
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
                      <Box sx={{ mb: 2 }}>
                        <Typography color="error">{bookingError}</Typography>
                      </Box>
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
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600, mb: 2 }}
                        >
                          Login to Continue
                        </Typography>
                        <LoginForm
                          onSuccess={(userData: any) => {
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
