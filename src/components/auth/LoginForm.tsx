"use client";

import { useAuth } from "@/hooks/useAuth";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

interface LoginFormProps {
  onSuccess?: (userData: any) => void;
  onCancel?: () => void;
  initialPhone?: string;
  autoFocus?: boolean;
  compact?: boolean;
  showChangeNumber?: boolean;
  className?: string;
}

export default function LoginForm({
  onSuccess,
  onCancel,
  initialPhone = "",
  autoFocus = true,
  compact = false,
  showChangeNumber = true,
  className = "",
}: LoginFormProps) {
  const { sendOTP, verifyOTP } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [phone, setPhone] = useState(initialPhone);
  const [otpSent, setOtpSent] = useState(false);
  const [digits, setDigits] = useState<string[]>(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(0);

  const phoneRef = useRef<HTMLInputElement | null>(null);
  const digitRefs = useRef<Array<HTMLInputElement | null>>([]);
  const verifyingRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null); // ✅ fixed timer ref

  useEffect(() => {
    if (initialPhone) setPhone(initialPhone);
    if (autoFocus && !otpSent) {
      setTimeout(() => phoneRef.current?.focus(), 50);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [initialPhone, autoFocus, otpSent]);

  const startTimer = (secs: number) => {
    setSecondsLeft(secs);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
  };

  const cleanedPhone = (p: string) => p.replace(/\D/g, "").slice(0, 10);

  const handleSendOTP = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    setError("");
    setSuccess("");
    const cp = cleanedPhone(phone);
    if (cp.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    setLoading(true);
    try {
      const res = await sendOTP(cp);
      if (res?.success || res?.Success) {
        setOtpSent(true);
        setDigits(["", "", "", ""]);
        setSuccess("OTP sent. Please check your phone.");
        startTimer(60); // ✅ starts the countdown
        setTimeout(() => digitRefs.current[0]?.focus(), 80);
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

  const doVerify = async (otpToVerify: string) => {
    if (verifyingRef.current) return;
    verifyingRef.current = true;
    setError("");
    setSuccess("");
    const cp = cleanedPhone(phone);
    if (cp.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      verifyingRef.current = false;
      return;
    }
    if (otpToVerify.length !== 4) {
      setError("Please enter a valid 4-digit OTP");
      verifyingRef.current = false;
      return;
    }

    setLoading(true);
    try {
      const res = await verifyOTP(cp, otpToVerify);
      if (res?.success) {
        setSuccess("Login successful!");
        onSuccess?.(res.user);
        if (pathname === "/login") router.push("/");
      } else {
        setError(res?.message || "Invalid OTP");
      }
    } catch (err) {
      console.error("doVerify error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
      verifyingRef.current = false;
    }
  };

  useEffect(() => {
    const otpValue = digits.join("");
    if (otpValue.length === 4) {
      const t = setTimeout(() => doVerify(otpValue), 80);
      return () => clearTimeout(t);
    }
  }, [digits]);

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    setDigits((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    if (value && index < 3) {
      digitRefs.current[index + 1]?.focus();
    }
  };

  const handleDigitKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    const key = e.key;
    if (key === "Backspace") {
      if (digits[index]) {
        setDigits((prev) => {
          const next = [...prev];
          next[index] = "";
          return next;
        });
      } else if (index > 0) {
        digitRefs.current[index - 1]?.focus();
        setDigits((prev) => {
          const next = [...prev];
          next[index - 1] = "";
          return next;
        });
      }
    } else if (key === "ArrowLeft" && index > 0) {
      digitRefs.current[index - 1]?.focus();
    } else if (key === "ArrowRight" && index < 3) {
      digitRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("Text");
    const onlyDigits = text.replace(/\D/g, "");
    if (onlyDigits.length === 0) return;
    const firstFour = onlyDigits.slice(0, 4).split("");
    setDigits((prev) => {
      const next = [...prev];
      for (let i = 0; i < 4; i++) next[i] = firstFour[i] ?? "";
      return next;
    });
    const lastFilled = Math.min(onlyDigits.length, 4) - 1;
    const focusIndex = lastFilled >= 0 ? lastFilled : 0;
    setTimeout(() => digitRefs.current[focusIndex]?.focus(), 50);
    e.preventDefault();
  };

  const handleChangeNumber = () => {
    setOtpSent(false);
    setDigits(["", "", "", ""]);
    setError("");
    setSuccess("");
    if (timerRef.current) clearInterval(timerRef.current);
    setSecondsLeft(0);
    setTimeout(() => phoneRef.current?.focus(), 50);
  };

  const handleResend = async () => {
    if (secondsLeft > 0) return;
    setError("");
    setSuccess("");
    await handleSendOTP(); // ✅ this restarts timer properly
  };

  return (
    <div className={className}>
      {!otpSent ? (
        <>
          <TextField
            label="Mobile Number"
            value={phone}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 10);
              setPhone(val);
              setError("");
              setSuccess("");
            }}
            inputRef={phoneRef}
            inputProps={{ maxLength: 10 }}
            fullWidth
            error={!!error}
            helperText={error}
            sx={{ mb: 2 }}
          />

          <Box
            display="flex"
            justifyContent="center"
            gap={2}
            mt={compact ? 1 : 3}
          >
            <Button
              type="button"
              variant="contained"
              onClick={handleSendOTP}
              disabled={loading}
            >
              {loading ? <CircularProgress size={18} /> : "Send OTP"}
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Typography variant="body1" sx={{ mb: 2, textAlign: "center" }}>
            Enter OTP sent to <strong>{phone}</strong>
          </Typography>

          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={1}
            mb={2}
          >
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => {
                  digitRefs.current[i] = el; // ✅ fixed ref
                }}
                value={d}
                onChange={(ev) =>
                  handleDigitChange(
                    i,
                    ev.target.value.replace(/\D/g, "").slice(0, 1)
                  )
                }
                onKeyDown={(ev) => handleDigitKeyDown(i, ev)}
                onPaste={handlePaste}
                maxLength={1}
                inputMode="numeric"
                style={{
                  width: 50,
                  height: 56,
                  textAlign: "center",
                  fontSize: 20,
                  borderRadius: 8,
                  border: "1px solid rgba(0,0,0,0.23)",
                  outline: "none",
                }}
              />
            ))}
          </Box>

          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={2}
            mb={2}
          >
            {showChangeNumber && (
              <Button
                size="small"
                onClick={handleChangeNumber}
                variant="outlined"
              >
                Change Number
              </Button>
            )}

            <Button
              size="small"
              onClick={handleResend}
              disabled={secondsLeft > 0}
              variant="text"
            >
              Resend {secondsLeft > 0 ? `(${secondsLeft}s)` : ""}
            </Button>
          </Box>
        </>
      )}

      {success && (
        <Typography sx={{ color: "green", mt: 1, textAlign: "center" }}>
          {success}
        </Typography>
      )}
      {error && otpSent && (
        <Typography color="error" sx={{ textAlign: "center" }}>
          {error}
        </Typography>
      )}
    </div>
  );
}
