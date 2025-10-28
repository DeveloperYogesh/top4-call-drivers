
// File: components/booking/FareDisplay.tsx
"use client";
import React from "react";
import { Box, CircularProgress, Alert } from "@mui/material";
import FareBreakdownComponent from "./fareBreakdownComponent";

interface Props {
  fareLoading: boolean;
  fareError?: string | null;
  fareBreakdown?: any | null;
}

export default function FareDisplay({ fareLoading, fareError, fareBreakdown }: Props) {
  if (fareLoading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <CircularProgress size={20} />
        <div>Calculating fare...</div>
      </Box>
    );
  }

  if (fareError) {
    return (
      <>
        <Alert severity="warning" sx={{ mb: 2 }}>{fareError}</Alert>
        {fareBreakdown && <FareBreakdownComponent breakdown={fareBreakdown} />}
      </>
    );
  }

  return <>{fareBreakdown ? <FareBreakdownComponent breakdown={fareBreakdown} /> : null}</>;
}
