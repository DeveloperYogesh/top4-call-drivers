// File: hooks/useAuth.ts
"use client";

import { useEffect, useState, useCallback } from "react";
import { POST } from "@/utils/apiHelpres";

export function normalizeUser(raw: any, fallbackPhone?: string) {
  const mobile = raw?.MOBILE_NO ?? raw?.mobileno ?? raw?.mobile ?? fallbackPhone ?? null;
  return { ...(raw || {}), MOBILE_NO: mobile };
}

export function useAuth() {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem("userData") : null;
      if (raw) setUser(JSON.parse(raw));
    } catch (e) {
      console.warn("Failed to parse userData", e);
    }

    const onStorage = (ev: StorageEvent) => {
      if (ev.key === "userData") {
        try {
          const raw = window.localStorage.getItem("userData");
          if (!raw) return setUser(null);
          setUser(JSON.parse(raw));
        } catch (e) {
          console.warn(e);
        }
      }
    };

    const onUserChanged = () => {
      try {
        const raw = window.localStorage.getItem("userData");
        if (!raw) return setUser(null);
        setUser(JSON.parse(raw));
      } catch (e) {
        console.warn(e);
      }
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("userChanged", onUserChanged);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("userChanged", onUserChanged);
    };
  }, []);

  const persistUser = useCallback((raw: any) => {
    const normalized = normalizeUser(raw);
    try {
      window.localStorage.setItem("userData", JSON.stringify(normalized));
      window.dispatchEvent(new Event("userChanged"));
    } catch (e) {
      console.warn("Failed to persist userData", e);
    }
    setUser(normalized);
    return normalized;
  }, []);

  const sendOTP = useCallback(async (mobileno: string) => {
    try {
      const res = await POST("api/V1/booking/sendOTP", { mobileno });
      // return raw response for the caller to inspect
      return res ?? { Success: false, success: false, message: "No response" };
    } catch (e) {
      console.error("sendOTP", e);
      return { Success: false, success: false, error: e };
    }
  }, []);

async function verifyOTP(phone: string, otp: string) {
  try {
    const response = await fetch(`http://top4mobileapp.vbsit.in/api/V1/booking/verifyOTP`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile: phone, otp }),
    });

    const data = await response.json();

    // check real success flags
    const successFlag =
      data?.success === true ||
      data?.Success === true ||
      data?.status === "success" ||
      (data?.Data && data?.Data?.verified === true);

    if (!successFlag) {
      return {
        success: false,
        message: data?.message || data?.Message || "Invalid OTP",
        raw: data,
      };
    }

    // success case
    const user =
      data?.user ||
      data?.Data ||
      data?.data ||
      { MOBILE_NO: phone };

    persistUser(user);
    return { success: true, user, raw: data };
  } catch (err) {
    console.error("verifyOTP error", err);
    return { success: false, message: "Network error. Please try again." };
  }
}


  const logout = useCallback(() => {
    try {
      window.localStorage.removeItem("userData");
      window.dispatchEvent(new Event("userChanged"));
    } catch (e) {
      console.warn("logout failed", e);
    }
    setUser(null);
  }, []);

  return {
    user,
    isLoggedIn: !!user,
    sendOTP,
    verifyOTP,
    persistUser,
    logout,
  } as const;
}
