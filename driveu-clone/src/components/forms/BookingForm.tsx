"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  Checkbox,
  TextField,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";
import {
  LocationOn,
  Schedule,
  DirectionsCar,
  LocalOffer,
  Phone,
  SwapVert,
} from "@mui/icons-material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import LocationAutocomplete from "@/components/ui/LocationAutocomplete";
import PhoneModal from "@/components/ui/PhoneModal";
import { useBooking } from "@/hooks/useBooking";
import { formatCurrency } from "@/utils/helpers";

const tripTypes = [
  { value: "one-way", label: "One Way" },
  { value: "round-trip", label: "Round Trip" },
  { value: "outstation", label: "Outstation" },
];

const carTypes = [
  { value: "manual", label: "Manual" },
  { value: "automatic", label: "Automatic" },
];

const vehicleSizes = [
  { value: "hatchback", label: "Hatchback", price: 299 },
  { value: "sedan", label: "Sedan", price: 399 },
  { value: "suv", label: "SUV", price: 499 },
];

export default function BookingForm({
  isEmbedded = false,
}: {
  isEmbedded?: boolean;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);

  const {
    tripType,
    pickupLocation,
    dropLocation,
    scheduledTime,
    carType,
    vehicleSize,
    damageProtection,
    couponCode,
    phoneNumber,
    errors,
    updateField,
    canProceed,
  } = useBooking();

  const handleSwapLocations = () => {
    if (pickupLocation && dropLocation) {
      updateField("pickupLocation", dropLocation);
      updateField("dropLocation", pickupLocation);
    }
  };

  const handleRequestDriver = () => {
    if (canProceed) {
      setPhoneModalOpen(true);
    }
  };

  const calculateEstimatedFare = () => {
    const basePrice =
      vehicleSizes.find((v) => v.value === vehicleSize)?.price || 299;
    const damageProtectionFee = damageProtection ? 50 : 0;
    return basePrice + damageProtectionFee;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div
        className={`max-w-[600px] mx-auto ${
          isEmbedded ? "" : "px-4"
        } bg-white rounded-2xl`}
      >
        {!isEmbedded && (
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: theme.palette.text.primary,
                fontSize: { xs: "2rem", md: "2.5rem" },
              }}
            >
              Book Professional Driver
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.text.secondary,
                maxWidth: 600,
                mx: "auto",
              }}
            >
              Hire verified professional drivers for hassle-free commutes and
              safe rides
            </Typography>
          </Box>
        )}

        <div className="">
          {/* Booking Form */}
          <div className="col-span-1 md:col-span-8">
            <div>
              <CardContent>
                {/* Trip Type */}
                <div className="mb-2">
                  <FormControl component="fieldset">
                    <FormLabel
                      component="legend"
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        mb: 2,
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
                    >
                      {tripTypes.map((type) => (
                        <FormControlLabel
                          key={type.value}
                          value={type.value}
                          control={<Radio />}
                          label={type.label}
                          sx={{ mr: 3 }}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </div>

                <Divider sx={{ my: 2 }} />

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

                  <div className="flx items-center">
                    <div className="w-full">
                      <div className="col-span-1 md:col-span-5">
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
                      <div className="mt-5">
                        <LocationAutocomplete
                          label="Drop Location"
                          placeholder="Enter drop location"
                          value={dropLocation}
                          onChange={(location) =>
                            updateField("dropLocation", location)
                          }
                          error={!!errors.dropLocation}
                          helperText={errors.dropLocation}
                        />
                      </div>
                    </div>
                    {/* <div className="">
                      <Button
                        variant="outlined"
                        onClick={handleSwapLocations}
                        disabled={!pickupLocation || !dropLocation}
                        sx={{
                          minWidth: "auto",
                          width: { xs: "100%", md: "auto" },
                          height: 56,
                          borderRadius: 2,
                        }}
                      >
                        <SwapVert />
                      </Button>
                    </div> */}
                  </div>
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
                    onChange={(newValue) =>
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

                <Divider sx={{ my: 2 }} />

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

                <Divider sx={{ my: 2 }} />

                {/* Additional Options */}

                {/* Coupon Code */}
                {/* <div className="mt-2">
                  <TextField
                    fullWidth
                    label="Coupon Code (Optional)"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => updateField("couponCode", e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocalOffer />
                        </InputAdornment>
                      ),
                    }}
                  />
                </div> */}
                <div className="mt-2">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={damageProtection}
                        onChange={(e) =>
                          updateField("damageProtection", e.target.checked)
                        }
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          Damage Protection (+₹50)
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Get coverage for minor damages during the trip
                        </Typography>
                      </Box>
                    }
                  />
                </div>
              </CardContent>
            </div>
          </div>

          {/* Fare Summary */}
          <div className="col-span-1 md:col-span-4 hidden">
            <Card sx={{ position: "sticky", top: 24 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Fare Summary
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">Base Fare</Typography>
                    <Typography variant="body2">
                      {formatCurrency(
                        vehicleSizes.find((v) => v.value === vehicleSize)
                          ?.price || 299
                      )}
                    </Typography>
                  </Box>

                  {damageProtection && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2">Damage Protection</Typography>
                      <Typography variant="body2">
                        {formatCurrency(50)}
                      </Typography>
                    </Box>
                  )}

                  <Divider sx={{ my: 2 }} />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 3,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Estimated Total
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.primary.main,
                      }}
                    >
                      {formatCurrency(calculateEstimatedFare())}
                    </Typography>
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={handleRequestDriver}
                  disabled={!canProceed}
                  startIcon={<Phone />}
                  sx={{
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    borderRadius: 2,
                  }}
                >
                  Request Driver
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
              </CardContent>
            </Card>
          </div>
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
