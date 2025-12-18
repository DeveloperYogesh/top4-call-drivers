"use client";

import { useAuth } from "@/hooks/useAuth";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
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
  autoFocus = false,
  compact = false,
  showChangeNumber = true,
  className = "",
}: LoginFormProps) {
  const { sendOTP, verifyOTP, checkUserExist, signUp, persistUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [phone, setPhone] = useState(initialPhone);
  const [otpSent, setOtpSent] = useState(false);
  const [digits, setDigits] = useState<string[]>(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(0);
  
  // New User / Signup State
  const [isNewUser, setIsNewUser] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [signupData, setSignupData] = useState({
    firstname: "",
    lastname: "",
    emailid: "",
    vehiclemodel: "",
    segment: "",
    vehicletype: "",
  });

  const phoneRef = useRef<HTMLInputElement | null>(null);
  const digitRefs = useRef<Array<HTMLInputElement | null>>([]);
  const verifyingRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (initialPhone) setPhone(initialPhone);
    if (autoFocus && !otpSent && !isNewUser) {
      setTimeout(() => phoneRef.current?.focus(), 50);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [initialPhone, autoFocus, otpSent, isNewUser]);

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
        startTimer(60);
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
    
    setLoading(true);
    try {
      const res = await verifyOTP(cp, otpToVerify);
      if (res?.success) {
        // OTP verified, now check if user exists
        checkUserStatus(cp, res.user);
      } else {
        setError(res?.message || "Invalid OTP");
        setLoading(false);
      }
    } catch (err) {
      console.error("doVerify error:", err);
      setError("Network error. Please try again.");
      setLoading(false);
    } finally {
      verifyingRef.current = false;
    }
  };

  const checkUserStatus = async (cp: string, verifiedUser: any) => {
    try {
      const check = await checkUserExist(cp);
      if (check.exists) {
        // User exists, complete login
        setSuccess("Login successful!");
        persistUser(check.data); // Update with full profile
        onSuccess?.(check.data);
        if (pathname === "/login") router.push("/");
      } else {
        // User does not exist, show signup
        setIsNewUser(true);
        setShowSignup(true);
        setSuccess("OTP Verified. Please create account.");
      }
    } catch (err) {
      console.error("User check failed", err);
      setError("Failed to verify user status.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setError("");
    if (!signupData.firstname || !signupData.emailid) {
      setError("First Name and Email are required.");
      return;
    }
    
    setLoading(true);
    try {
      const payload = {
        mobileno: cleanedPhone(phone),
        ...signupData,
        userImage: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" // Placeholder or default
      };
      
      const res = await signUp(payload);
      if (res.success) {
        setSuccess("Account created successfully!");
        // Fetch full profile or use returned data
        const check = await checkUserExist(cleanedPhone(phone));
        const userData = check.exists ? check.data : { ...payload, MOBILE_NO: payload.mobileno }; // Fallback
        
        persistUser(userData);
        onSuccess?.(userData);
        if (pathname === "/login") router.push("/");
      } else {
         setError(res.message);
      }
    } catch (err) {
      console.error(err);
      setError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const otpValue = digits.join("");
    if (otpValue.length === 4 && !otpSent) return; // Guard
    if (otpValue.length === 4) {
      const t = setTimeout(() => doVerify(otpValue), 80);
      return () => clearTimeout(t);
    }
  }, [digits, otpSent]);

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

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        setDigits(prev => { const n = [...prev]; n[index] = ""; return n; });
      } else if (index > 0) {
        digitRefs.current[index - 1]?.focus();
        setDigits(prev => { const n = [...prev]; n[index - 1] = ""; return n; });
      }
    }
  };

  const handleChangeNumber = () => {
    setOtpSent(false);
    setDigits(["", "", "", ""]);
    setError("");
    setSuccess("");
    setShowSignup(false);
    setIsNewUser(false);
    setSecondsLeft(0);
    setTimeout(() => phoneRef.current?.focus(), 50);
  };

  const handleResend = async () => {
    if (secondsLeft > 0) return;
    setError("");
    setSuccess("");
    await handleSendOTP();
  };

  // Render Signup Form
  if (showSignup) {
    return (
      <div className={className}>
        <Typography variant="h6" gutterBottom>Create Account</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Complete your profile for {phone}
        </Typography>
        
        <Box display="flex" flexDirection="column" gap={2} mt={2}>
          <Box display="flex" gap={2}>
            <TextField 
              label="First Name" 
              fullWidth 
              size="small"
              value={signupData.firstname}
              onChange={(e) => setSignupData(p => ({ ...p, firstname: e.target.value }))}
            />
            <TextField 
              label="Last Name" 
              fullWidth 
              size="small"
              value={signupData.lastname}
              onChange={(e) => setSignupData(p => ({ ...p, lastname: e.target.value }))}
            />
          </Box>
          <TextField 
            label="Email" 
            fullWidth 
            size="small"
            value={signupData.emailid}
            onChange={(e) => setSignupData(p => ({ ...p, emailid: e.target.value }))}
          />
          <Box display="flex" gap={2}>
            <TextField 
              label="Vehicle Model" 
              fullWidth 
              size="small"
              value={signupData.vehiclemodel}
              onChange={(e) => setSignupData(p => ({ ...p, vehiclemodel: e.target.value }))}
            />
             <FormControl fullWidth size="small">
              <InputLabel>Type</InputLabel>
              <Select
                label="Type"
                value={signupData.vehicletype}
                onChange={(e) => setSignupData(p => ({ ...p, vehicletype: e.target.value }))}
              >
                <MenuItem value="Manual">Manual</MenuItem>
                <MenuItem value="Automatic">Automatic</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
           <FormControl fullWidth size="small">
              <InputLabel>Segment</InputLabel>
              <Select
                label="Segment"
                value={signupData.segment}
                onChange={(e) => setSignupData(p => ({ ...p, segment: e.target.value }))}
              >
                <MenuItem value="Hatchback">Hatchback</MenuItem>
                <MenuItem value="Sedan">Sedan</MenuItem>
                <MenuItem value="SUV">SUV</MenuItem>
              </Select>
            </FormControl>

          
          {error && <Typography color="error" variant="body2">{error}</Typography>}
          
          <Button variant="contained" onClick={handleSignup} disabled={loading}>
            {loading ? <CircularProgress size={20} /> : "Create Account"}
          </Button>
          <Button variant="text" onClick={handleChangeNumber}>Cancel</Button>
        </Box>
      </div>
    );
  }

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
                  digitRefs.current[i] = el;
                }}
                value={d}
                onChange={(ev) =>
                  handleDigitChange(
                    i,
                    ev.target.value.replace(/\D/g, "").slice(0, 1)
                  )
                }
                onKeyDown={(ev) => handleDigitKeyDown(i, ev)}
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

      {success && !showSignup && (
        <Typography sx={{ color: "green", mt: 1, textAlign: "center" }}>
          {success}
        </Typography>
      )}
      {error && otpSent && !showSignup && (
        <Typography color="error" sx={{ textAlign: "center" }}>
          {error}
        </Typography>
      )}
    </div>
  );
}
