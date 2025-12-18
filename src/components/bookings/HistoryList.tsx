"use client";

import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { useBookingHistory } from "@/hooks/useBookingHistory";
import BookingCard from "./BookingCard";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`history-tabpanel-${index}`}
      aria-labelledby={`history-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function HistoryList() {
  const { fetchHistory, loading, error, upcoming, past } = useBookingHistory();
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="booking history tabs">
          <Tab label={`Upcoming (${upcoming.length})`} />
          <Tab label={`Past (${past.length})`} />
        </Tabs>
      </Box>

      <CustomTabPanel value={value} index={0}>
        {upcoming.length === 0 ? (
          <Typography textAlign="center" color="text.secondary">
            No upcoming trips.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {upcoming.map((booking) => (
              <Grid key={booking.BOOKING_ID}>
                <BookingCard booking={booking} />
              </Grid>
            ))}
          </Grid>
        )}
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        {past.length === 0 ? (
          <Typography textAlign="center" color="text.secondary">
            No past trips.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {past.map((booking) => (
              <Grid key={booking.BOOKING_ID}>
                <BookingCard booking={booking} />
              </Grid>
            ))}
          </Grid>
        )}
      </CustomTabPanel>
    </Box>
  );
}
