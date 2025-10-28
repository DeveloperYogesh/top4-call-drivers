// File: components/booking/FareBreakdownComponent.tsx
"use client";
import React from "react";
import { Typography, Stack, Box, Divider } from "@mui/material";

export default function FareBreakdownComponent({
  breakdown,
}: {
  breakdown: { baseFare: number; nightCharge: number; total: number };
}) {
  return (
    <>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
        Fare Breakdown
      </Typography>
      <Stack spacing={1}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body2">Base Fare</Typography>
          <Typography variant="body2">
            ₹{Math.round(breakdown.baseFare)}
          </Typography>
        </Box>
        {breakdown.nightCharge > 0 && (
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2">Night Charge</Typography>
            <Typography variant="body2">
              ₹{Math.round(breakdown.nightCharge)}
            </Typography>
          </Box>
        )}
        <Divider sx={{ my: 1 }} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Total
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontWeight: 800, color: "primary.main" }}
          >
            ₹{Math.round(breakdown.total)}
          </Typography>
        </Box>
      </Stack>
    </>
  );
}
