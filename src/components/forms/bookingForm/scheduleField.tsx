// File: components/booking/ScheduleField.tsx
"use client";
import React from "react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";
import { Typography } from "@mui/material";
import { Schedule } from "@mui/icons-material";

interface Props {
  value: Dayjs | null;
  onChange: (v: Dayjs | null) => void;
  errors?: Record<string, any>;
}

export default function ScheduleField({ value, onChange, errors }: Props) {
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
        <Schedule color="primary" /> When is driver needed?
      </Typography>
      <DateTimePicker
        label="Select date and time"
        value={value}
        onChange={onChange}
        minDateTime={dayjs().add(1, "hour")}
        slotProps={{
          textField: {
            fullWidth: true,
            error: !!errors?.scheduledTime,
            helperText:
              errors?.scheduledTime || "Select time at least 1 hour from now",
          },
        }}
      />
    </div>
  );
}
