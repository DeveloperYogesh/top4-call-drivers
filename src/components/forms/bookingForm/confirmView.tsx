// File: components/booking/ConfirmView.tsx
"use client";
import React from "react";
import {
  Card,
  CardContent,
  Chip,
  Typography,
  Divider,
  Box,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";
import FareBreakdownComponent from "./fareBreakdownComponent";
import dayjs from "dayjs";

interface Props {
  pickupLocation?: any;
  dropLocation?: any;
  scheduledTime?: Date | null;
  vehicleSize?: string | null;
  carType?: string | null;
  estimatedUsage: number;
  fareBreakdown?: any | null;
  bookingError?: string | null;
  bookingLoading?: boolean;
  onBack: () => void;
  onConfirm: () => void;
}

export default function ConfirmView({
  pickupLocation,
  dropLocation,
  scheduledTime,
  vehicleSize,
  carType,
  estimatedUsage,
  fareBreakdown,
  bookingError,
  bookingLoading,
  onBack,
  onConfirm,
}: Props) {
  return (
    <>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Review & Confirm
      </Typography>
      {bookingError && (
        <Box sx={{ mb: 2 }}>
          <Typography color="error">{bookingError}</Typography>
        </Box>
      )}
      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <Card variant="outlined" sx={{ mb: 2, minWidth: "100%" }}>
            <CardContent>
              <div className="w-full">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Chip
                    label={`${vehicleSize || "Any"} • ${carType || "Any"}`}
                    color="primary"
                    variant="outlined"
                  />
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {estimatedUsage} Hrs
                  </Typography>
                </Box>
                <Divider sx={{ my: 1.5, minWidth: "100%" }} />
                <Box sx={{ mb: 2, width: "100%" }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {pickupLocation?.name || "Not set"} →{" "}
                    {dropLocation?.name || "Not set"}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    When
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {scheduledTime
                      ? dayjs(scheduledTime).format("ddd, MMM D, h:mm A")
                      : "Not set"}
                  </Typography>
                </Box>
                {fareBreakdown && (
                  <FareBreakdownComponent breakdown={fareBreakdown} />
                )}
              </div>
            </CardContent>
          </Card>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="outlined" fullWidth onClick={onBack}>
              Back
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={onConfirm}
              disabled={bookingLoading}
              sx={{ backgroundColor: "#2e7d32" }}
            >
              {bookingLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Confirm Booking"
              )}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
