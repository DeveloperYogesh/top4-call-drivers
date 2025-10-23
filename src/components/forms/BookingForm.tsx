"use client";

import LocationAutocomplete from "@/components/ui/LocationAutocomplete";
import PhoneModal from "@/components/ui/PhoneModal";
import { useBooking } from "@/hooks/useBooking";
import { Location } from "@/types";
import { POST } from "@/utils/apiHelpres";
import { APP_CONFIG } from "@/utils/constants";
import { LocationOn, Schedule } from "@mui/icons-material";
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
  Typography,
  TextField,
  IconButton,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useRef, useState } from "react";

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
  { value: "hatchback", label: "Hatchback", price: 299 },
  { value: "sedan", label: "Sedan", price: 399 },
  { value: "suv", label: "SUV", price: 499 },
];

const usageOptions: number[] = [4, 6, 8, 10, 12];

interface BookingFormProps {
  isEmbedded?: boolean;
}

export default function BookingForm({ isEmbedded = false }: BookingFormProps) {
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);

  // Keep local state for estimated usage (always required)
  const [estimatedUsage, setEstimatedUsage] = useState<number>(4);
  const [estimatedUsageError, setEstimatedUsageError] = useState<string>("");

  // booking states
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

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

  // Initialize scheduledTime with default value (1 hour from now)
  useEffect(() => {
    if (!scheduledTime) {
      const defaultTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
      updateField("scheduledTime", defaultTime);
    }
  }, []); // Empty dependency array - run once on mount

  // Keep packageHours in central booking state so backend receives it
  useEffect(() => {
    updateField("packageHours", estimatedUsage);
  }, [estimatedUsage, updateField]);

  const getTripTypeLabel = (value: string) =>
    tripTypes.find((t) => t.value === value)?.label ?? value;

  // helper to format lat/lng strings
  function formatPickupLatLong(loc?: Location | null) {
    if (!loc) return "";
    const lat = (loc as any).latitude ?? (loc as any).lat ?? null;
    const lng = (loc as any).longitude ?? (loc as any).lng ?? null;
    if (lat != null && lng != null) return `${lat}, ${lng}`;
    return "";
  }

  // Convert location object to a printable place name
  function placeName(loc?: Location | null) {
    if (!loc) return "";
    return (
      (loc as any)?.name ??
      (loc as any)?.label ??
      (loc as any)?.formatted_address ??
      ""
    );
  }

  // ----------------- OTP Login Dialog (nested) -----------------
  function OTPLoginDialog({
    open,
    onClose,
    onSuccess,
    initialPhone,
  }: {
    open: boolean;
    onClose: () => void;
    onSuccess: (normalizedUserData: any) => void;
    initialPhone?: string;
  }) {
    const [phone, setPhone] = useState<string>(initialPhone ?? "");
    const [otp, setOtp] = useState<string>("");
    const [isLoadingLocal, setIsLoadingLocal] = useState(false);
    const [otpSentLocal, setOtpSentLocal] = useState(false);
    const [errorLocal, setErrorLocal] = useState("");
    const [successLocal, setSuccessLocal] = useState("");
    const [secondsLeft, setSecondsLeft] = useState<number>(0);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
      if (open) {
        setPhone(initialPhone ?? "");
        setOtp("");
        setOtpSentLocal(false);
        setErrorLocal("");
        setSuccessLocal("");
        setSecondsLeft(0);
      }
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };
    }, [open, initialPhone]);

    const startTimer = (s: number) => {
      setSecondsLeft(s);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      timerRef.current = window.setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    };

    const sendOTPLocal = async () => {
      setErrorLocal("");
      if (!phone || phone.replace(/\D/g, "").length !== 10) {
        setErrorLocal("Enter a valid 10-digit mobile number");
        return;
      }
      setIsLoadingLocal(true);
      try {
        const data = await POST("api/V1/booking/sendOTP", { mobileno: phone });
        if (data?.Success || data?.success) {
          setOtpSentLocal(true);
          setSuccessLocal("OTP sent. Please check your phone.");
          startTimer(60);
        } else {
          setErrorLocal(data?.message || data?.Message || "Failed to send OTP");
        }
      } catch (err) {
        console.error("sendOTP error", err);
        setErrorLocal("Network error. Please try again.");
      } finally {
        setIsLoadingLocal(false);
      }
    };

    const verifyOTPLocal = async () => {
      setErrorLocal("");
      if (!otp || otp.length !== 4) {
        setErrorLocal("Enter the 4-digit OTP");
        return;
      }
      setIsLoadingLocal(true);
      try {
        const data = await POST("api/V1/booking/sendOTP", {
          mobileno: phone,
          otp,
        });
        if (data?.Success || data?.success) {
          // normalize & persist user data
          const raw = data?.Data ?? data;
          const mobileFromResponse =
            raw?.MOBILE_NO ?? raw?.mobileno ?? raw?.mobile ?? phone;
          const normalized = { ...(raw || {}), MOBILE_NO: mobileFromResponse };
          try {
            localStorage.setItem("userData", JSON.stringify(normalized));
          } catch (e) {
            console.warn("localStorage write failed", e);
          }
          // inform parent
          onSuccess(normalized);
          setSuccessLocal("Verified!");
        } else {
          setErrorLocal(data?.message || data?.Message || "Invalid OTP");
        }
      } catch (err) {
        console.error("verify OTP error", err);
        setErrorLocal("Network error. Please try again.");
      } finally {
        setIsLoadingLocal(false);
      }
    };

    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Login with OTP</DialogTitle>
        <DialogContent>
          <div className="space-y-3" style={{ minWidth: 320 }}>
            <TextField
              label="Mobile Number"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              inputProps={{ maxLength: 10 }}
              fullWidth
              disabled={otpSentLocal && secondsLeft > 0}
            />
            {otpSentLocal && (
              <TextField
                label="Enter OTP"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))
                }
                inputProps={{ maxLength: 4 }}
                fullWidth
              />
            )}

            {errorLocal && <Typography color="error">{errorLocal}</Typography>}
            {successLocal && (
              <Typography color="success">{successLocal}</Typography>
            )}

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {!otpSentLocal ? (
                <Button onClick={sendOTPLocal} disabled={isLoadingLocal}>
                  {isLoadingLocal ? <CircularProgress size={18} /> : "Send OTP"}
                </Button>
              ) : (
                <>
                  <Button onClick={verifyOTPLocal} disabled={isLoadingLocal}>
                    {isLoadingLocal ? (
                      <CircularProgress size={18} />
                    ) : (
                      "Verify OTP"
                    )}
                  </Button>
                  <Button
                    onClick={() => {
                      if (secondsLeft === 0) {
                        sendOTPLocal();
                        setOtp("");
                      }
                    }}
                    disabled={secondsLeft > 0 || isLoadingLocal}
                  >
                    {secondsLeft > 0 ? `Resend in ${secondsLeft}s` : "Resend"}
                  </Button>
                </>
              )}

              <Button onClick={onClose} variant="text">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  // ----------------- End OTP Login Dialog -----------------

  // ----- Fare fetching (uses the real endpoint) -----
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastPayloadRef = useRef<string | null>(null);

  async function fetchFareAmount() {
    setFareLoading(true);
    setFareError(null);
    setFareAmount(null);
    setFareData(null);

    try {
      const classIdMap: Record<string, string> = {
        hatchback: "1",
        sedan: "2",
        suv: "3",
      };
      const classid = classIdMap[vehicleSize as string] ?? vehicleSize ?? "1";

      const pickupPlace = placeName(pickupLocation).toUpperCase();
      const dropPlace = placeName(dropLocation).toUpperCase();

      const requestdt = scheduledTime
        ? dayjs(scheduledTime).format("DD/MM/YYYY")
        : dayjs().format("DD/MM/YYYY");

      const pickuptime = scheduledTime
        ? dayjs(scheduledTime).format("HH:mm")
        : dayjs().format("HH:mm");

      const payload = {
        classid: String(classid),
        Hours: String(estimatedUsage),
        triptype: getTripTypeLabel(selectedTripType),
        pickuptype: "InCity",
        pickupplace: pickupPlace || "",
        dropplace: dropPlace || "",
        requestdt,
        pickuptime,
        tripkms: "0",
      };

      const payloadKey = JSON.stringify(payload);
      if (payloadKey === lastPayloadRef.current && fareAmount != null) {
        setFareLoading(false);
        return { cached: true, fare: fareAmount, data: fareData };
      }

      // cancel previous
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      // use POST helper if it supports passing signal, else call fetch directly
      // Here we use fetch so AbortController works reliably.
      const res = await fetch("/api/V1/booking/GetFareAmount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Fare API error: ${res.status} ${txt}`);
      }

      const json: any = await res.json();

      const total =
        json?.TOTALFARE ??
        json?.TOTAL_FARE ??
        json?.totalFare ??
        json?.total ??
        json?.data?.TOTALFARE ??
        json?.result?.TOTALFARE;

      if (total == null) {
        console.warn("fetchFareAmount - unexpected response shape:", json);
        throw new Error("Fare API returned unexpected response shape");
      }

      setFareAmount(Number(total));
      setFareData(json);
      lastPayloadRef.current = payloadKey;
      return json;
    } catch (err: any) {
      if (err?.name === "AbortError") {
        console.info("Fare fetch aborted");
        return Promise.reject({ aborted: true });
      }
      console.error("Fare fetch error (client):", err);
      setFareError(err?.message ?? "Failed to calculate fare");

      // fallback optimistic estimate
      const vehicleBasePrice = vehicleSizes.find(
        (v) => v.value === vehicleSize
      )?.price;
      if (vehicleBasePrice && estimatedUsage) {
        const fallback = vehicleBasePrice * estimatedUsage;
        setFareAmount(fallback);
      } else {
        setFareAmount(null);
      }
      return Promise.reject(err);
    } finally {
      setFareLoading(false);
      abortControllerRef.current = null;
    }
  }

  // Debounced auto-fetch
  const debounceRef = useRef<number | null>(null);
  useEffect(() => {
    const needsDrop = selectedTripType !== "daily";
    const havePickup = !!placeName(pickupLocation);
    const haveVehicle = !!vehicleSize;
    const haveHours = !!estimatedUsage && estimatedUsage > 0;
    const haveDrop = needsDrop ? !!placeName(dropLocation) : true;

    if (!havePickup || !haveVehicle || !haveHours || !haveDrop) {
      setFareAmount(null);
      setFareData(null);
      setFareError(null);
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      lastPayloadRef.current = null;
      return;
    }

    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      fetchFareAmount().catch(() => {});
      debounceRef.current = null;
    }, 700);

    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, [
    pickupLocation,
    dropLocation,
    scheduledTime,
    vehicleSize,
    estimatedUsage,
    selectedTripType,
  ]);

  // ---------- New: Modal state for OTP login from BookingForm ----------
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  // Called after user confirms fare and wants to create booking
  const confirmAndCreateBooking = async () => {
    setConfirmOpen(false);
    setBookingLoading(true);
    const pickupPlace = placeName(pickupLocation).toUpperCase();
    const dropPlace = placeName(dropLocation).toUpperCase();
    const pickuptime = scheduledTime
      ? dayjs(scheduledTime).format("YYYY-MM-DD HH:mm:ss")
      : dayjs().format("YYYY-MM-DD HH:mm:ss");
    try {
      const pickupLatLongStr = formatPickupLatLong(pickupLocation);
      const dropLatLongStr = formatPickupLatLong(dropLocation);
      const userDataStr = localStorage.getItem("userData");
      const userData = userDataStr ? JSON.parse(userDataStr) : null;
      const classIdMap: Record<string, string> = {
        hatchback: "1",
        sedan: "2",
        suv: "3",
      };
      const classid = classIdMap[vehicleSize as string] ?? vehicleSize ?? "1";
      const payload: any = {
        mobileNumber: phoneNumber || userData?.MOBILE_NO,
        pickupTime: pickuptime,
        returnTime: pickuptime,
        pickupLatLong: pickupLatLongStr,
        dropLatLong: dropLatLongStr,
        pickupLocation: pickupPlace,
        dropLocation: dropPlace,
        pickUpKMS: "0",
        carType: vehicleSize,
        VehicleType: String(classid),
        tripType: "InCity",
        reqType: "Round Trip",
        price: fareAmount,
        packageHours: estimatedUsage, // send hours, not fare
      };

      const res = await fetch("/api/V1/booking/insertbookingnew", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (json && (json.Success || json.success)) {
        setSuccessMessage(json.Message ?? "Booking successful");
        setBookingSuccess(true);
      } else {
        throw new Error(json.Message ?? "Booking failed");
      }
    } catch (err: any) {
      console.error("Booking error:", err);
      alert("Booking failed: " + (err?.message ?? "Unknown error"));
    } finally {
      setBookingLoading(false);
    }
  };

  // ---------- Updated flow: when user clicks Request Driver, ensure logged in ----------
  const handleRequestDriver = async () => {
    // Override time validation - allow 1 hour minimum
    const currentTime = new Date();
    const minAllowedTime = new Date(currentTime.getTime() + 60 * 60 * 1000); // 1 hour from now
    
    if (scheduledTime && new Date(scheduledTime) < minAllowedTime) {
      // Clear the time validation error
      updateField("errors", {
        ...errors,
        scheduledTime: ""
      });
    }

    // run existing validation first
    const ok = validateBooking();

    // ensure hours selected
    if (!estimatedUsage || estimatedUsage <= 0) {
      setEstimatedUsageError("Please select package hours / estimated usage.");
      return;
    } else {
      setEstimatedUsageError("");
    }

    if (!ok) {
      console.log("Validation failed:", errors);
      return;
    }

    // check login: booking state phoneNumber or localStorage userData
    const userDataStr =
      typeof window !== "undefined" ? localStorage.getItem("userData") : null;
    const userData = userDataStr ? JSON.parse(userDataStr) : null;
    const mobileAvailable = !!(phoneNumber || userData?.MOBILE_NO);

    if (!mobileAvailable) {
      // open login dialog in-place
      setLoginDialogOpen(true);
      return;
    }

    // If fare hasn't been calculated yet (race or first-time), fetch it now.
    try {
      if (fareAmount == null) {
        await fetchFareAmount();
      }
      setConfirmOpen(true);
    } catch (err) {
      alert("Unable to calculate fare: " + ((err as any)?.message ?? ""));
    }
  };

  // callback when OTP login success from dialog
  const onOTPLoginSuccess = (normalizedUserData: any) => {
    // update booking state immediately
    if (normalizedUserData?.MOBILE_NO) {
      updateField("phoneNumber", String(normalizedUserData.MOBILE_NO));
    }
    setLoginDialogOpen(false);

    // proceed: if fare not present, trigger fetch, else open confirm
    (async () => {
      try {
        if (fareAmount == null) {
          await fetchFareAmount();
        }
        setConfirmOpen(true);
      } catch (err) {
        alert(
          "Unable to calculate fare after login: " +
            ((err as any)?.message ?? "")
        );
      }
    })();
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedTripType(newValue);
  };

  // Label for the hours selector (dynamic)
  const hoursLabel =
    selectedTripType === "round-trip" ? "Package Hours" : "Estimated Usage";

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div
        className={`max-w-[500px] min-w-[400px] md:min-w-[450px] w-full mx-auto ${
          isEmbedded ? "" : "px-4"
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
                  "& .MuiTab-root": {
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    textTransform: "none",
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
                display: "flex",
                alignItems: "center",
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
                updateField("pickupLocation", location)
              }
              error={!!errors.pickupLocation}
              helperText={errors.pickupLocation}
              fetchSuggestions={async (q) => {
                try {
                  const response = await fetch(
                    `/api/locations/search?query=${encodeURIComponent(q)}`
                  );
                  const data = await response.json();
                  return data.status === "success" ? data.data : [];
                } catch {
                  return [];
                }
              }}
            />

            {selectedTripType !== "daily" && (
              <div className="mt-4">
                <LocationAutocomplete
                  label="Drop Location"
                  placeholder="Enter drop location"
                  value={dropLocation}
                  onChange={(location: Location | null) =>
                    updateField("dropLocation", location)
                  }
                  error={!!errors.dropLocation}
                  helperText={errors.dropLocation}
                  fetchSuggestions={async (q) => {
                    try {
                      const response = await fetch(
                        `/api/locations/search?query=${encodeURIComponent(q)}`
                      );
                      const data = await response.json();
                      return data.status === "success" ? data.data : [];
                    } catch {
                      return [];
                    }
                  }}
                />
              </div>
            )}
          </div>

          {/* Schedule / Time */}
          {selectedTripType !== "daily" && (
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
                <Schedule color="primary" />
                {selectedTripType === "outstation"
                  ? "Date & Time"
                  : "When is driver needed?"}
              </Typography>

              <DateTimePicker
                label="Select date and time"
                value={scheduledTime ? dayjs(scheduledTime) : dayjs().add(1, "hour")}
                onChange={(newValue: Dayjs | null) =>
                  updateField("scheduledTime", newValue?.toDate() || null)
                }
                minDateTime={dayjs().add(1, "hour")}
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
              <FormLabel sx={{ fontWeight: 600, mb: 1 }}>
                {hoursLabel}
              </FormLabel>
              <Select
                value={estimatedUsage}
                onChange={(e) =>
                  setEstimatedUsage(
                    Number((e.target as HTMLSelectElement).value)
                  )
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
                  sx={{ color: "error.main", mt: 0.5 }}
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
                  onChange={(e) =>
                    updateField("carType", e.target.value as any)
                  }
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
                    updateField("vehicleSize", e.target.value as any)
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
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <CircularProgress size={18} />
                <Typography variant="body2">Calculating fare...</Typography>
              </div>
            ) : fareAmount != null ? (
              <div className="text-center">
                <h4 className="text-lg !mb-1">
                  Estimated Fare:{" "}
                  <span className="text-blue-800">
                    ₹{fareAmount.toFixed(2)}
                  </span>
                </h4>
                {fareData?.NIGHTCHARGES ? (
                  <p className="!text-xs">(Includes night charges)</p>
                ) : null}
              </div>
            ) : fareError ? (
              <Typography
                variant="caption"
                color="error"
                sx={{ display: "block" }}
              >
                {fareError}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Fare will be calculated automatically when required fields are
                filled.
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
              fontSize: "1.1rem",
              fontWeight: 600,
              borderRadius: 2,
              backgroundColor:
                selectedTripType === "daily" ? "#000" : "#2e7d32",
            }}
          >
            {bookingLoading || fareLoading ? (
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CircularProgress size={20} style={{ color: "#fff" }} />
                Booking...
              </div>
            ) : selectedTripType === "daily" ? (
              "Continue to Schedule Driver"
            ) : (
              "Request Driver"
            )}
          </Button>
        </div>

        <PhoneModal
          open={phoneModalOpen}
          onClose={() => setPhoneModalOpen(false)}
          phoneNumber={phoneNumber}
          onPhoneNumberChange={(phone) => updateField("phoneNumber", phone)}
        />

        {/* OTP login modal from booking form */}
        <OTPLoginDialog
          open={loginDialogOpen}
          onClose={() => setLoginDialogOpen(false)}
          onSuccess={onOTPLoginSuccess}
          initialPhone={phoneNumber ?? ""}
        />

        {/* Fare confirmation dialog */}
        <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
          <DialogTitle>Confirm Booking</DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 1 }}>
              Estimated Fare:
              <strong>
                {" "}
                {fareAmount != null ? ` ₹${fareAmount.toFixed(2)}` : " -"}
              </strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please confirm to create the booking. The final fare will be
              validated by the server.
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
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              py: 4,
            }}
          >
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: 120,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  "linear-gradient(135deg, rgba(46,125,50,0.15), rgba(0,200,83,0.15))",
                boxShadow: "0 8px 20px rgba(46,125,50,0.12)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Animated checkmark - CSS keyframes */}
              <svg
                width="80"
                height="80"
                viewBox="0 0 52 52"
                style={{
                  transform: "scale(1)",
                  transition: "transform .3s ease",
                }}
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
                    animation: "dashCircle 0.7s ease-out forwards",
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
                    animation: "dashCheck 0.5s 0.7s ease-out forwards",
                  }}
                />
              </svg>
            </div>

            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Booking Confirmed
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              {successMessage || "Your booking was created successfully."}
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