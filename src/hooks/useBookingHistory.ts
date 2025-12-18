"use client";

import { useCallback, useState } from "react";
import { POST } from "@/utils/helpers";
import { useAuth } from "./useAuth";
import { BookingHistoryResponse, BookingItem } from "@/types";

export function useBookingHistory() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [upcoming, setUpcoming] = useState<BookingItem[]>([]);
  const [past, setPast] = useState<BookingItem[]>([]);

  const fetchHistory = useCallback(async () => {
    if (!user?.MOBILE_NO) {
      setError("User not logged in");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // API expects mobileno, skipCount, totalCount
      const res = await POST("api/V1/booking/BookingHistory", {
        mobileno: user.MOBILE_NO,
        skipCount: 1,
        totalCount: 100, // Fetch reasonable amount
      }) as BookingHistoryResponse;

      if (res?.Success) {
        setUpcoming(res.UpcomingTrip || []);
        setPast(res.PastTrip || []);
      } else {
        setError(res?.Message || "Failed to fetch booking history");
      }
    } catch (err: any) {
      console.error("fetchHistory error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    loading,
    error,
    upcoming,
    past,
    fetchHistory,
  };
}
