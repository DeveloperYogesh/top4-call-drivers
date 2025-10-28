// File: components/booking/LocationFields.tsx
"use client";
import React from "react";
import { Box, Typography } from "@mui/material";
import LocationAutocomplete from "@/components/ui/LocationAutocomplete";
import { Location } from "@/types";
import { LocationOn } from "@mui/icons-material";

interface Props {
  includeDrop?: boolean;
  pickupLocation?: Location | null;
  dropLocation?: Location | null;
  onPickupChange?: (l: Location | null) => void;
  onDropChange?: (l: Location | null) => void;
  errors?: Record<string, any>;
}

export default function LocationFields({
  includeDrop = true,
  pickupLocation,
  dropLocation,
  onPickupChange,
  onDropChange,
  errors,
}: Props) {
  return (
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
        label="Pickup Location"
        placeholder="Enter pickup location"
        value={pickupLocation}
        onChange={onPickupChange}
        error={!!errors?.pickupLocation}
        helperText={errors?.pickupLocation}
      />
      {includeDrop && (
        <div className="mt-4">
          <LocationAutocomplete
            label="Drop Location"
            placeholder="Enter drop location"
            value={dropLocation}
            onChange={onDropChange}
            error={!!errors?.dropLocation}
            helperText={errors?.dropLocation}
          />
        </div>
      )}
    </div>
  );
}
