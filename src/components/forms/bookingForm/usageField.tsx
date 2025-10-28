
// File: components/booking/UsageField.tsx
"use client";
import React from "react";
import { FormControl, FormLabel, Select, MenuItem, Typography } from "@mui/material";

const usageOptions = [3, 4, 6, 8, 10, 12];

interface Props {
  value: number;
  onChange: (n: number) => void;
  error?: string;
}

export default function UsageField({ value, onChange, error }: Props) {
  return (
    <div className="mb-4">
      <FormControl fullWidth>
        <FormLabel sx={{ fontWeight: 600, mb: 1 }}>Package Hours</FormLabel>
        <Select value={value} onChange={(e) => onChange(Number(e.target.value))}>
          {usageOptions.map((hours) => (
            <MenuItem key={hours} value={hours}>{hours} Hrs</MenuItem>
          ))}
        </Select>
        {error && <Typography color="error" variant="caption">{error}</Typography>}
      </FormControl>
    </div>
  );
}


