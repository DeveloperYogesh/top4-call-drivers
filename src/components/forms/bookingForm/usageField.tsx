
// File: components/booking/UsageField.tsx
"use client";
import React from "react";
import { FormControl, FormLabel, Select, MenuItem, Typography } from "@mui/material";

const defaultUsageOptions = [
  { value: 3, label: "3 Hrs" },
  { value: 4, label: "4 Hrs" },
  { value: 6, label: "6 Hrs" },
  { value: 8, label: "8 Hrs" },
  { value: 10, label: "10 Hrs" },
  { value: 12, label: "12 Hrs" },
];

const outstationUsageOptions = [
  { value: 12, label: "12 hours" },
  { value: 24, label: "1 day" },
  { value: 48, label: "2 days" },
  { value: 72, label: "3 days" },
  { value: 96, label: "4 days" },
  { value: 120, label: "5 days" },
  { value: 144, label: "6 days" },
];

interface Props {
  value: number;
  onChange: (n: number) => void;
  error?: string;
  tripType?: string;
}

export default function UsageField({ value, onChange, error, tripType }: Props) {
  const isOutstation = tripType === "outstation";
  const options = isOutstation ? outstationUsageOptions : defaultUsageOptions;

  // Ensure current value is valid for the new options, if not, default to first option
  // functionality handled in parent or just let user switch.

  return (
    <div className="mb-4">
      <FormControl fullWidth>
        <FormLabel sx={{ fontWeight: 600, mb: 1 }}>Package Hours</FormLabel>
        <Select value={value} onChange={(e) => onChange(Number(e.target.value))}>
          {options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
        {error && <Typography color="error" variant="caption">{error}</Typography>}
      </FormControl>
    </div>
  );
}


