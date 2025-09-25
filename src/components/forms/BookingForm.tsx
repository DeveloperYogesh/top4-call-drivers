// src/components/forms/BookingForm.tsx
"use client";

import LocationAutocomplete from "@/components/ui/LocationAutocomplete";
import PhoneModal from "@/components/ui/PhoneModal";
import { useBooking } from "@/hooks/useBooking";
import { formatCurrency } from "@/utils/helpers";
import { Location } from "@/types";
import {
  DirectionsCar,
  LocationOn,
  Phone,
  Schedule,
} from "@mui/icons-material";
import {
  Box,
  Button,
  CardContent,
  Divider,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";

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
  const theme = useTheme();
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [estimatedUsage, setEstimatedUsage] = useState<number>(4);
  const [selectedTripType, setSelectedTripType] = useState<string>(tripTypes[0].value);

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

  const calculateEstimatedFare = (): number => {
    const basePrice =
      vehicleSizes.find((v) => v.value === vehicleSize)?.price || 299;
    const damageProtectionFee = damageProtection ? 50 : 0;
    return basePrice + damageProtectionFee;
  };

  const handleRequestDriver = () => {
    const ok = validateBooking();
    if (ok) {
      setPhoneModalOpen(true);
    }
  };

  const fetchSuggestions = async (query: string): Promise<Location[]> => {
    try {
      const response = await fetch(
        `/api/locations/search?query=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      return data.status === "success" ? data.data : [];
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      return [];
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedTripType(newValue);
  };

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
                    <Tab
                      key={type.value}
                      value={type.value}
                      label={type.label}
                    />
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
                fetchSuggestions={fetchSuggestions}
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
                    fetchSuggestions={fetchSuggestions}
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
                  value={scheduledTime ? dayjs(scheduledTime) : null}
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

            {/* Package Hours (for Round Trip only) */}
            {selectedTripType === "round-trip" && (
              <div className="mb-4">
                <FormControl fullWidth>
                  <FormLabel sx={{ fontWeight: 600, mb: 1 }}>
                    Select Package Hours
                  </FormLabel>
                  <Select
                    value={estimatedUsage}
                    onChange={(e) =>
                      setEstimatedUsage(e.target.value as number)
                    }
                  >
                    {usageOptions.map((hours) => (
                      <MenuItem key={hours} value={hours}>
                        {hours} Hrs
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            )}

            {/* Estimated Usage (for Outstation or Daily) */}
            {(selectedTripType === "outstation" || selectedTripType === "daily") && (
              <div className="mb-4">
                <FormControl fullWidth>
                  <FormLabel sx={{ fontWeight: 600, mb: 1 }}>
                    Estimated Usage
                  </FormLabel>
                  <Select
                    value={estimatedUsage}
                    onChange={(e) =>
                      setEstimatedUsage(e.target.value as number)
                    }
                  >
                    {usageOptions.map((hours) => (
                      <MenuItem key={hours} value={hours}>
                        {hours} Hrs
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            )}

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

            {/* Submit Button */}
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleRequestDriver}
              sx={{
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 600,
                borderRadius: 2,
                backgroundColor: selectedTripType === "daily" ? "#000" : "#2e7d32",
              }}
            >
              {selectedTripType === "daily"
                ? "Continue to Schedule Driver"
                : "Request Driver"}
            </Button>
        </div>

        <PhoneModal
          open={phoneModalOpen}
          onClose={() => setPhoneModalOpen(false)}
          phoneNumber={phoneNumber}
          onPhoneNumberChange={(phone) => updateField("phoneNumber", phone)}
        />
      </div>
    </LocalizationProvider>
  );
}
