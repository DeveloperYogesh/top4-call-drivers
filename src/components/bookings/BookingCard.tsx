"use client";

import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import LocationOn from "@mui/icons-material/LocationOn";
import AccessTime from "@mui/icons-material/AccessTime";
import CalendarToday from "@mui/icons-material/CalendarToday";
import Person from "@mui/icons-material/Person";
import DirectionsCar from "@mui/icons-material/DirectionsCar";
import { BookingItem } from "@/types";

interface BookingCardProps {
    booking: BookingItem;
}

const getStatusColor = (status: string) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("complete") || s.includes("finish")) return "success";
    if (s.includes("cancel")) return "error";
    if (s.includes("assign") || s.includes("process")) return "info";
    return "warning";
};

export default function BookingCard({ booking }: BookingCardProps) {
    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 2, borderRadius: 2 }}>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box>
                        <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                            Booking #{booking.BOOKING_NO}
                        </Typography>
                        <Typography variant="h6" component="div" sx={{ color: '#354B9C', fontWeight: 'bold' }}>
                            ₹{booking.FARE}
                        </Typography>
                    </Box>
                    <Chip
                        label={booking.STATUS || "Pending"}
                        size="small"
                        color={getStatusColor(booking.STATUS) as any}
                        sx={{ fontWeight: 'bold' }}
                    />
                </Box>

                <Stack spacing={2}>
                    <Box display="flex" gap={1.5}>
                        <CalendarToday sx={{ fontSize: 18, color: 'text.secondary', mt: 0.3 }} />
                        <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                {booking.TRAVELDTTM}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {booking.PICKUPTIME2}
                            </Typography>
                        </Box>
                    </Box>

                    <Divider />

                    <Box display="flex" gap={1.5}>
                        <LocationOn sx={{ fontSize: 18, color: '#d32f2f', mt: 0.3 }} />
                        <Box>
                            <Typography variant="caption" color="text.secondary" display="block">
                                PICKUP
                            </Typography>
                            <Typography variant="body2" sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                            }}>
                                {booking.PICKUP_PLACE}
                            </Typography>
                        </Box>
                    </Box>

                    {booking.DROP_PLACE && (
                        <Box display="flex" gap={1.5}>
                            <LocationOn sx={{ fontSize: 18, color: '#2e7d32', mt: 0.3 }} />
                            <Box>
                                <Typography variant="caption" color="text.secondary" display="block">
                                    DROP
                                </Typography>
                                <Typography variant="body2" sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                }}>
                                    {booking.DROP_PLACE}
                                </Typography>
                            </Box>
                        </Box>
                    )}

                    <Divider />

                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center" gap={1}>
                            <Person sx={{ fontSize: 18, color: 'text.secondary' }} />
                            <Typography variant="body2">
                                {booking.DRIVER_NAME || "Assigning..."}
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={0.5}>
                            <DirectionsCar sx={{ fontSize: 18, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                                {booking.BOOKING_TYPE}
                            </Typography>
                        </Box>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
}
