"use client";

import React, { useEffect, useState } from "react";
import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import { useAuth } from "@/hooks/useAuth";

interface LoginFormProps {
  onSuccess?: (userData: any) => void;
  initialPhone?: string;
}

export default function LoginForm({ onSuccess, initialPhone = "" }: LoginFormProps) {
  const { sendOTP, verifyOTP } = useAuth();
  const [phone, setPhone] = useState(initialPhone);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (initialPhone) setPhone(initialPhone);
    return () => {
      try { if ((window as any).timerRef) clearInterval((window as any).timerRef); } catch {}
    };
  }, [initialPhone]);

  const startTimer = (secs: number) => {
    setSecondsLeft(secs);
    try { clearInterval((window as any).timerRef); } catch {}
    (window as any).timerRef = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
  };

  const handleSendOTP = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    setError("");
    setSuccess("");
    const cleanedPhone = phone.replace(/\D/g, "").slice(0, 10);
    if (cleanedPhone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    setLoading(true);
    try {
      console.log("handleSendOTP -> calling sendOTP(", cleanedPhone, ")");
      const res = await sendOTP(cleanedPhone);
      console.log("sendOTP response:", res);
      if (res?.success || res?.Success) {
        setOtpSent(true);
        setOtp("");
        setSuccess("OTP sent. Please check your phone.");
        startTimer(60);
      } else {
        setError(res?.message || res?.Message || "Failed to send OTP");
      }
    } catch (e) {
      console.error("handleSendOTP error:", e);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    console.log("handleVerify start");
    console.trace("handleVerify trace");
    setError("");
    setSuccess("");

    const cleanedPhone = phone.replace(/\D/g, "").slice(0, 10); // ensure defined
    const cleanedOtp = otp.replace(/\D/g, "").slice(0, 4);

    console.log("handleVerify -> cleanedPhone:", cleanedPhone, "cleanedOtp:", cleanedOtp);

    if (cleanedPhone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    if (cleanedOtp.length !== 4) {
      setError("Please enter a valid 4-digit OTP");
      return;
    }

    setLoading(true);
    try {
      console.log("Calling verifyOTP...");
      const res = await verifyOTP(cleanedPhone, cleanedOtp);
      console.log("verifyOTP result:", res);
      if (res?.success) {
        setSuccess("Login successful!");
        onSuccess?.(res.user);
      } else {
        setError(res?.message || "Invalid OTP");
      }
    } catch (err) {
      console.error("handleVerify error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <TextField
        label="Mobile Number"
        value={phone}
        onChange={(e) => {
          const val = e.target.value.replace(/\D/g, "").slice(0, 10);
          setPhone(val);
          setError("");
          setSuccess("");
        }}
        inputProps={{ maxLength: 10 }}
        fullWidth
        disabled={otpSent && secondsLeft > 0}
        error={!!error && !otpSent}
        helperText={error && !otpSent ? error : ""}
        className="my-2"
      />

      {otpSent && (
        <TextField
          label="Enter OTP"
          value={otp}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "").slice(0, 4);
            setOtp(val);
            setError("");
            setSuccess("");
          }}
          inputProps={{ maxLength: 4 }}
          fullWidth
          error={!!error && otpSent}
          helperText={error && otpSent ? error : ""}
          className="my-2"
        />
      )}

      {success && <Typography color="success.main">{success}</Typography>}
      {error && <Typography color="error">{error}</Typography>}

      <div className="flex gap-2 mt-3 w-fit mx-auto">
        {!otpSent ? (
          <Button type="button" variant="contained" onClick={handleSendOTP} disabled={loading}>
            {loading ? <CircularProgress size={18} /> : "Send OTP"}
          </Button>
        ) : (
          <>
            <Button type="button" variant="contained" onClick={handleVerify} disabled={loading}>
              {loading ? <CircularProgress size={18} /> : "Verify OTP"}
            </Button>

            <Button
              type="button"
              onClick={() => {
                if (secondsLeft === 0) handleSendOTP();
              }}
              disabled={secondsLeft > 0 || loading}
            >
              {secondsLeft > 0 ? `Resend in ${secondsLeft}s` : "Resend"}
            </Button>
          </>
        )}

        <Button
          type="button"
          onClick={() => {
            setOtpSent(false);
            setOtp("");
            setError("");
            setSuccess("");
            try { if ((window as any).timerRef) clearInterval((window as any).timerRef); } catch {}
          }}
          variant="outlined"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
