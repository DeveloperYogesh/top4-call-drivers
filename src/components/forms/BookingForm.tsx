"use client";

import LocationAutocomplete from "@/components/ui/LocationAutocomplete";
import PhoneModal from "@/components/ui/PhoneModal";
import { useBooking } from "@/hooks/useBooking";
import { formatCurrency } from "@/utils/helpers";
import {
  DirectionsCar,
  LocationOn,
  Phone,
  Schedule,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
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

  const {
    tripType,
    pickupLocation,
    dropLocation,
    scheduledTime,
    carType,
    vehicleSize,
    damageProtection,
    phoneNumber,
    errors,
    updateField,
    canProceed,
  } = useBooking();

  const handleRequestDriver = () => {
    if (canProceed) {
      setPhoneModalOpen(true);
    }
  };

  const calculateEstimatedFare = (): number => {
    const basePrice =
      vehicleSizes.find((v) => v.value === vehicleSize)?.price || 299;
    const damageProtectionFee = damageProtection ? 50 : 0;
    return basePrice + damageProtectionFee;
  };

  const handleSetPickupTime = () => {
    // Logic to trigger DateTimePicker or proceed based on trip type
    console.log("Set Pickup Time or Continue to Schedule");
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div
        className={`max-w-[600px] min-w-[400px] md:min-w-[450px] mx-auto ${
          isEmbedded ? "" : "px-4"
        } bg-white rounded-2xl`}
      >
        <div className="">
          <CardContent>
            {/* Trip Type */}
            <div className="mb-2">
              <FormControl component="fieldset">
                <FormLabel
                  component="legend"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    mb: 1,
                  }}
                >
                  Trip Type
                </FormLabel>
                <RadioGroup
                  row
                  value={tripType}
                  onChange={(e) =>
                    updateField("tripType", e.target.value as any)
                  }
                  sx={{
                    flexWrap: "nowrap", // prevent wrapping
                    overflowX: "auto", // allow horizontal scroll
                    WebkitOverflowScrolling: "touch",
                    "& .MuiFormControlLabel-root": {
                      whiteSpace: "nowrap", // keep label text on one line
                      mr: 2,
                    },
                    "& .MuiFormControlLabel-label": {
                      fontSize: "0.85rem", // ~13.6px (try 0.75rem, 0.8rem, etc.)
                    },
                  }}
                >
                  {tripTypes.map((type) => (
                    <FormControlLabel
                      key={type.value}
                      value={type.value}
                      control={<Radio />}
                      label={type.label}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </div>

            <Divider sx={{ mb: 2 }} />

            {/* Locations */}
            <div className="mb-2">
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <LocationOn color="primary" />
                Locations
              </Typography>

              <div className="flex items-center">
                <div className="w-full">
                  <LocationAutocomplete
                    label="Pickup Location"
                    placeholder="Enter pickup location"
                    value={pickupLocation}
                    onChange={(location) =>
                      updateField("pickupLocation", location)
                    }
                    error={!!errors.pickupLocation}
                    helperText={errors.pickupLocation}
                  />
                </div>
              </div>

              {(tripType === "one-way" ||
                tripType === "round-trip" ||
                tripType === "outstation") && (
                <div className="mt-5">
                  <LocationAutocomplete
                    label="Pickup Location"
                    placeholder="Enter pickup location"
                    value={pickupLocation}
                    onChange={(location) =>
                      updateField("pickupLocation", location)
                    }
                    error={!!errors.pickupLocation}
                    helperText={errors.pickupLocation}
                  />
                </div>
              )}

              {tripType === "outstation" && (
                <div className="mt-5">
                  <LocationAutocomplete
                    label="Pickup Location"
                    placeholder="Enter pickup location"
                    value={pickupLocation}
                    onChange={(location) =>
                      updateField("pickupLocation", location)
                    }
                    error={!!errors.pickupLocation}
                    helperText={errors.pickupLocation}
                  />
                </div>
              )}
            </div>

            <Divider sx={{ my: 2 }} />

            {/* Schedule */}
            <div className="mb-2">
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
                When is driver needed?
              </Typography>

              <DateTimePicker
                label="Select date and time"
                value={scheduledTime ? dayjs(scheduledTime) : null}
                onChange={(newValue: Dayjs | null) =>
                  updateField("scheduledTime", newValue?.toDate() || null)
                }
                minDateTime={dayjs().add(1, "hour")} // Minimum 1 hour from now (04:17 PM IST, Sep 04, 2025)
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.scheduledTime,
                    helperText: errors.scheduledTime,
                  },
                }}
              />
            </div>

            {tripType === "daily" && (
              <>
                <Divider sx={{ my: 2 }} />

                {/* Estimated Usage */}
                <div className="mb-2">
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

                {/* Car Preferences */}
                <div className="mb-2">
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
                    <DirectionsCar color="primary" />
                    Car Preferences
                  </Typography>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <FormControl fullWidth>
                        <FormLabel sx={{ fontWeight: 600, mb: 1 }}>
                          Car Type
                        </FormLabel>
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
                    </div>

                    <div>
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
                              {size.label} - {formatCurrency(size.price)}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                </div>
              </>
            )}

            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleSetPickupTime}
              sx={{
                mt: 2,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 600,
                borderRadius: 2,
                backgroundColor: tripType === "daily" ? "#000" : "#2e7d32",
              }}
            >
              {tripType === "daily"
                ? "Continue to Schedule Driver"
                : "Set Pickup Time"}
            </Button>

            <Typography
              variant="caption"
              sx={{
                display: "block",
                textAlign: "center",
                mt: 2,
                color: theme.palette.text.secondary,
              }}
            >
              * Final fare may vary based on actual distance and time
            </Typography>

            {/* Promotional Message */}
            <Box
              sx={{
                mt: 2,
                p: 2,
                backgroundColor: "#fff3e0",
                borderRadius: 1,
                textAlign: "center",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Rs 100 off on your first trip - Don&apos;t forget to apply
                FIRST100
              </Typography>
            </Box>
          </CardContent>
        </div>

        {/* Phone Modal */}
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
