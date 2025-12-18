// File: hooks/useAuth.ts
"use client";

import { POST } from "@/utils/helpers";
import { useEffect, useState, useCallback } from "react";

export function normalizeUser(raw: any, fallbackPhone?: string) {
  const mobile = raw?.firstname || raw?.FIRST_NAME ? (raw?.mobileno ?? raw?.MOBILE_NO ?? raw?.mobile ?? fallbackPhone ?? null) : (raw?.MOBILE_NO ?? raw?.mobileno ?? raw?.mobile ?? fallbackPhone ?? null);

  // Prioritize lowercase keys (manual updates/normalized state) over uppercase keys (raw API response)
  const firstname = raw?.firstname ?? raw?.FIRST_NAME ?? "";
  const lastname = raw?.lastname ?? raw?.LAST_NAME ?? "";
  const email = raw?.email ?? raw?.emailid ?? raw?.E_MAIL ?? "";
  const segment = raw?.segment ?? raw?.SEGMENT ?? "Hatchback";
  const vehicletype = raw?.vehicletype ?? raw?.VEHICLETYPE ?? "Manual";
  const vehiclemodel = raw?.vehiclemodel ?? raw?.VEHICLEMODEL ?? "";

  return {
    ...(raw || {}),
    MOBILE_NO: mobile,
    firstname,
    lastname,
    email,
    segment,
    vehicletype,
    vehiclemodel
  };
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

        let user = res?.Data || { MOBILE_NO: phone };

        // If user data is missing critical fields (firstname), try to fetch full profile
        // This handles the case where existing users don't get their profile data in verifyOTP response
        if (!user.FIRST_NAME && !user.firstname) {
          console.log("User profile incomplete, fetching from newuser_SignUp...");
          try {
            const signupRes = await POST("api/V1/booking/newuser_SignUp", {
              mobileno: phone,
              firstname: "",
              lastname: "",
              emailid: "",
            });

            console.log("Fetch existing user response:", signupRes);
            // Even if it says "User already exists", it returns the user data in Data field
            if (signupRes?.Data) {
              user = signupRes.Data;
              console.log("Successfully fetched existing user data");
            }
          } catch (err) {
            console.warn("Failed to fetch existing user data:", err);
            // Continue with partial user data if fetch fails
          }
        }

        const normalizedUser = persistUser(user);
        return { success: true, user: normalizedUser, raw: res };
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

  const registerUser = useCallback(async (details: {
    mobileno: string;
    firstname: string;
    lastname: string;
    emailid: string;
    vehiclemodel?: string;
    segment?: string;
    vehicletype?: string;
    userImage?: string;
  }) => {
    try {
      console.log("Registering user:", details);
      const res = await POST("api/V1/booking/newuser_SignUp", details);
      console.log("Register response:", res);

      if (res?.Data) {
        const normalizedUser = persistUser(res.Data);
        return { success: true, user: normalizedUser, raw: res };
      } else if (res?.Success) {
        return { success: true, raw: res };
      }

      return { success: !!res?.Success, message: res?.Message || "Registration failed", raw: res };
    } catch (err: any) {
      console.error("registerUser error:", err);
      return { success: false, message: err.message || "Registration failed" };
    }
  }, [persistUser]);

  const checkUserExist = useCallback(async (mobileno: string) => {
    try {
      console.log("Checking user existence for:", mobileno);
      const res = await POST("api/V1/booking/UserDetails", { mobileno });
      console.log("Check user response:", res);
      if (res?.Success === true || res?.success === true) {
        return { exists: true, data: res.Data };
      }
      return { exists: false };
    } catch (e) {
      console.error("checkUserExist error:", e);
      return { exists: false, error: e };
    }
  }, []);

  const signUp = useCallback(async (data: any) => {
    try {
      console.log("Signing up user:", data);
      const res = await POST("api/V1/booking/newuser_SignUp", data);
      console.log("Signup response:", res);
      if (res?.Success === true || res?.success === true) {
        return { success: true, data: res };
      }
      return { success: false, message: res?.Message || res?.message || "Signup failed" };
    } catch (e: any) {
      console.error("signUp error:", e);
      return { success: false, message: e.message || "Signup failed" };
    }
  }, []);

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
    registerUser,
    persistUser,
    logout,
    checkUserExist,
    signUp,
  } as const;
}
