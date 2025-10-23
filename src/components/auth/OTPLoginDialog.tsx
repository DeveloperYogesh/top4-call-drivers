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
  const [phone, setPhone] = useState<string>(initialPhone ?? "");
  const [otp, setOtp] = useState<string>("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (open) {
      setPhone(initialPhone ?? "");
      setOtp("");
      setOtpSent(false);
      setError("");
      setSuccess("");
      setSecondsLeft(0);
    }
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [open, initialPhone]);

  const startTimer = (s: number) => {
    setSecondsLeft(s);
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setSecondsLeft((p) => {
        if (p <= 1) {
          if (timerRef.current) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return 0;
        }
        return p - 1;
      });
    }, 1000);
  };

  const handleSendOTP = async () => {
    setError("");
    setSuccess("");
    const cleaned = phone.replace(/\\D/g, "");
    if (cleaned.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    setLoading(true);
    try {
      const res = await sendOTP(cleaned);
      if (res?.success || res?.Success) {
        setOtpSent(true);
        setSuccess("OTP sent. Please check your phone.");
        startTimer(60);
      } else {
        setError(res?.message || res?.Message || "Failed to send OTP");
      }
    } catch (e: any) {
      console.error(e);
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError("");
    setSuccess("");
    if (!otp || otp.replace(/\\D/g, "").length !== 4) {
      setError("Enter the 4-digit OTP");
      return;
    }
    setLoading(true);
    try {
      const res = await verifyOTP(phone.replace(/\\D/g, ""), otp);
      if (res?.success) {
        setSuccess("Verified successfully");
        onSuccess?.(res.user);
        setTimeout(() => onClose(), 700);
      } else {
        setError(res?.message || res?.Message || "Invalid OTP");
      }
    } catch (e) {
      console.error(e);
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
            onChange={(e) => setPhone(e.target.value.replace(/\\D/g, "").slice(0, 10))}
            inputProps={{ maxLength: 10 }}
            fullWidth
            disabled={loading || (otpSent && secondsLeft > 0)}
          />

          {otpSent && (
            <TextField
              label="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\\D/g, "").slice(0, 4))}
              inputProps={{ maxLength: 4 }}
              fullWidth
            />
          )}

          {error && <Typography color="error">{error}</Typography>}
          {success && <Typography color="primary">{success}</Typography>}

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {!otpSent ? (
              <Button onClick={handleSendOTP} disabled={loading} variant="contained">
                {loading ? <CircularProgress size={18} /> : "Send OTP"}
              </Button>
            ) : (
              <>
                <Button onClick={handleVerify} disabled={loading} variant="contained">
                  {loading ? <CircularProgress size={18} /> : "Verify OTP"}
                </Button>
                <Button
                  onClick={() => {
                    if (secondsLeft === 0) {
                      handleSendOTP();
                      setOtp("");
                    }
                  }}
                  disabled={secondsLeft > 0 || loading}
                >
                  {secondsLeft > 0 ? ` Resend in ${secondsLeft}s` : "Resend"}
                </Button>
              </>
            )}

            <Button onClick={onClose} variant="text">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}