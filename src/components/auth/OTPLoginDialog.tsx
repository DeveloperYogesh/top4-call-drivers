"use client";

import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogTitle, DialogContent, Button, TextField, CircularProgress, Typography } from "@mui/material";
import { useAuth } from "@/hooks/useAuth";

interface OTPLoginDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (userData: any) => void;
  initialPhone?: string;
}

export default function OTPLoginDialog({ open, onClose, onSuccess, initialPhone = "" }: OTPLoginDialogProps) {
  const { sendOTP, verifyOTP } = useAuth();
  const [phone, setPhone] = useState<string>(initialPhone);
  const [otp, setOtp] = useState<string>("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (open) {
      setPhone(initialPhone);
      setOtp("");
      setOtpSent(false);
      setError("");
      setSuccess("");
      setSecondsLeft(0);
      console.log("Dialog opened with initialPhone:", initialPhone);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      console.log("Dialog closed");
    };
  }, [open, initialPhone]);

  const startTimer = (secs: number) => {
    setSecondsLeft(secs);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
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
      console.log("Sending OTP for:", cleanedPhone);
      const res = await sendOTP(cleanedPhone);
      console.log("Send OTP response:", res);
      if (res?.success || res?.Success) {
        setOtpSent(true);
        setOtp("");
        setSuccess("OTP sent. Please check your phone.");
        startTimer(60);
      } else {
        setError(res?.message || res?.Message || "Failed to send OTP");
      }
    } catch (e: any) {
      console.error("Send OTP error:", e);
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    console.log("Dialog handleVerify start");
    console.trace("Dialog handleVerify trace");
    setError("");
    setSuccess("");
    const cleanedPhone = phone.replace(/\D/g, "").slice(0, 10);
    const cleanedOtp = otp.replace(/\D/g, "").slice(0, 4);
    console.log("Verify button clicked - Phone:", cleanedPhone, "OTP:", cleanedOtp);
    if (cleanedPhone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    if (cleanedOtp.length !== 4) {
      setError("Enter the 4-digit OTP");
      return;
    }
    setLoading(true);
    try {
      console.log("Calling verifyOTP with:", { mobileno: cleanedPhone, OTP: cleanedOtp, devicetoken: "" });
      const res = await verifyOTP(cleanedPhone, cleanedOtp);
      console.log("Verify OTP response:", res);
      if (res?.success) {
        setSuccess("Verified successfully");
        onSuccess?.(res.user);
        setTimeout(() => onClose(), 700);
      } else {
        setError(res?.message || "Invalid OTP");
      }
    } catch (e: any) {
      console.error("Verify error:", e);
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Login with OTP</DialogTitle>
      <DialogContent>
        <div style={{ minWidth: 320, display: "flex", flexDirection: "column", gap: 12 }}>
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
            disabled={loading || (otpSent && secondsLeft > 0)}
            error={!!error && !otpSent}
            helperText={error && !otpSent ? error : ""}
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
              error={!!error}
              helperText={error}
            />
          )}

          {success && <Typography color="primary">{success}</Typography>}
          {error && <Typography color="error">{error}</Typography>}

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {!otpSent ? (
              <Button type="button" onClick={handleSendOTP} disabled={loading} variant="contained" fullWidth>
                {loading ? <CircularProgress size={18} /> : "Send OTP"}
              </Button>
            ) : (
              <>
                <Button type="button" onClick={handleVerify} disabled={loading} variant="contained" fullWidth>
                  {loading ? <CircularProgress size={18} /> : "Verify OTP"}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    if (secondsLeft === 0) {
                      handleSendOTP();
                      setOtp("");
                    }
                  }}
                  disabled={secondsLeft > 0 || loading}
                  variant="outlined"
                >
                  {secondsLeft > 0 ? `Resend in ${secondsLeft}s` : "Resend"}
                </Button>
              </>
            )}

            <Button type="button" onClick={onClose} variant="text">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
