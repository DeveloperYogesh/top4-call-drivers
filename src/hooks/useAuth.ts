"use client";

import { POST } from "@/utils/apiHelpres";
import { useEffect, useState, useCallback } from "react";

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
      console.log("Sending OTP to:", mobileno);
      const res = await POST("api/V1/booking/sendOTP", { mobileno });
      console.log("Send OTP response:", res);
      return res ?? { Success: false, success: false, message: "No response" };
    } catch (e) {
      console.error("sendOTP error:", e);
      return { Success: false, success: false, error: e };
    }
  }, []);

  const verifyOTP = useCallback(
    async (phone: string, otp: string) => {
      try {
        console.log("Verifying OTP for phone:", phone, "with OTP:", otp);
        const res = await POST("api/V1/booking/verifyOTP", { mobileno: phone, OTP: otp, devicetoken: "" });
        console.log("Verify OTP response:", res);
        const successFlag =
          res?.success === true || res?.Success === true || res?.Message === "OTP Verified Successfully";

        if (!successFlag) {
          return { success: false, message: res?.message || res?.Message || "Invalid OTP", raw: res };
        }

        const user = res?.Data || { MOBILE_NO: phone };
        persistUser(user);
        return { success: true, user, raw: res };
      } catch (err: any) {
        console.error("verifyOTP error:", err);
        return {
          success: false,
          message: err.name === "TypeError" ? "Network error: Unable to connect to server." : err.message || "Verification failed.",
        };
      }
    },
    [persistUser]
  );

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
