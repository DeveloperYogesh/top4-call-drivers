// File: components/booking/CarFields.tsx
"use client";
import React from "react";
import { FormControl, FormLabel, Select, MenuItem } from "@mui/material";

const carTypes = [
  { value: "manual", label: "Manual" },
  { value: "automatic", label: "Automatic" },
];
const vehicleSizes = [
  { value: "hatchback", label: "Hatchback" },
  { value: "sedan", label: "Sedan" },
  { value: "suv", label: "SUV" },
];

interface Props {
  carType?: string | null;
  vehicleSize?: string | null;
  onCarTypeChange?: (v: string) => void;
  onVehicleSizeChange?: (v: string) => void;
}

export default function CarFields({
  carType,
  vehicleSize,
  onCarTypeChange,
  onVehicleSizeChange,
}: Props) {
  return (
    <div className="mb-4 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FormControl fullWidth>
          <FormLabel sx={{ fontWeight: 600, mb: 1 }}>Car Type</FormLabel>
          <Select
            value={carType || "manual"}
            onChange={(e) => onCarTypeChange?.(e.target.value)}
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
            value={vehicleSize || "sedan"}
            onChange={(e) => onVehicleSizeChange?.(e.target.value)}
          >
            {vehicleSizes.map((s) => (
              <MenuItem key={s.value} value={s.value}>
                {s.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </div>
  );
}
