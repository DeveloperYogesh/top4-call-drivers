// File: components/auth/LoginForm.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

type LoginMethod = "otp" | "password";

interface LoginFormData {
  phone: string;
  email: string;
  password: string;
  otp: string;
}

interface LoginFormProps {
  onLogin?: (userData: any) => void;
  resendSeconds?: number;
}

export default function LoginForm({
  onLogin,
  resendSeconds = 60,
}: LoginFormProps) {
  const router = useRouter();
  const { sendOTP, verifyOTP, persistUser } = useAuth();
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("otp");
  const [formData, setFormData] = useState<LoginFormData>({
    phone: "",
    email: "",
    password: "",
    otp: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [success, setSuccess] = useState("");
  const [secondsLeft, setSecondsLeft] = useState<number>(0);

  const timerRef = useRef<number | null>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startResendTimer = (secs: number) => {
    setSecondsLeft(secs);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const cleaned = value.replace(/\D/g, "").slice(0, 10);
      setFormData((p) => ({ ...p, phone: cleaned }));
    } else if (name === "email" || name === "password") {
      setFormData((p) => ({ ...p, [name]: value }));
    }
    setError("");
    setSuccess("");
  };

  const handleOTPChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // allow only digits or empty
    const otpArray = (formData.otp || "").padEnd(4, " ").split("");
    otpArray[index] = value || " ";
    const newOtp = otpArray.join("").trim();
    setFormData((p) => ({ ...p, otp: newOtp }));

    if (value && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }
    if (!value && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }

    // Auto verify when 4 digits filled
    if (newOtp.length === 4) {
      handleOTPLogin(newOtp);
    }
  };

  const normalizeAndStoreUserData = (data: any) => {
    const mobileFromResponse =
      data?.MOBILE_NO ?? data?.mobileno ?? data?.mobile ?? formData.phone ?? "";
    const normalized = { ...data, MOBILE_NO: mobileFromResponse };
    if (typeof window !== "undefined") {
      localStorage.setItem("userData", JSON.stringify(normalized));
      // notify same-tab listeners
      window.dispatchEvent(new Event("userChanged"));
    }
    if (onLogin) onLogin(normalized);
    return normalized;
  };

  const handleSendOTP = async () => {
    if (!formData.phone || formData.phone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Use useAuth.sendOTP if available
      const data = await sendOTP(formData.phone);
      console.log("sendOTP response:", data);
      if (data?.Success || data?.success) {
        setOtpSent(true);
        setSuccess("");
        startResendTimer(resendSeconds);
      } else {
        setError(data?.message || data?.Message || "Failed to send OTP");
      }
    } catch (e) {
      console.error("sendOTP error", e);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPLogin = async (otpValue?: string) => {
    const otpToUse = otpValue ?? formData.otp;
    if (!formData.phone || formData.phone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    if (!otpToUse || otpToUse.length !== 4) {
      setError("Please enter a valid 4-digit OTP");
      return;
    }
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // call verifyOTP from hook which includes stricter checks
      const res = await verifyOTP(formData.phone, otpToUse);
      console.log("verifyOTP result:", res);

      if (res?.success) {
        // persistUser already called inside verifyOTP, but normalize again for local use
        const user = res.user ?? (res.raw?.Data ?? res.raw ?? null);
        const normalized = normalizeAndStoreUserData(user);
        setSuccess("Login successful!");
        setTimeout(() => {
          // route where you want
          router.push("/");
        }, 600);
      } else {
        // Show server message if present, else a default message
        const msg =
          res?.message ||
          res?.raw?.message ||
          res?.raw?.Message ||
          "Invalid OTP. Please try again.";
        setError(msg);
      }
    } catch (e) {
      console.error("verify error", e);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordLogin = async () => {
    if (!formData.email || !formData.password) {
      setError("Please enter both email and password");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        // If backend returned user info, store it
        if (data?.user || data?.Data) {
          const normalized = normalizeAndStoreUserData(data.user ?? data.Data);
          persistUser(normalized);
        }
        setSuccess("Login successful!");
        setTimeout(() => router.push("/"), 800);
      } else {
        setError(data?.message || "Invalid credentials");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginMethod === "otp") {
      if (!otpSent) await handleSendOTP();
      else await handleOTPLogin();
    } else {
      await handlePasswordLogin();
    }
  };

  return (
    <div className="space-y-6">
      {/* Login Toggle */}
      <div className="flex rounded-lg bg-gray-100 p-1">
        {["otp", "password"].map((method) => (
          <button
            key={method}
            type="button"
            onClick={() => {
              setLoginMethod(method as LoginMethod);
              setOtpSent(false);
              setFormData({ phone: "", email: "", password: "", otp: "" });
              setError("");
              setSuccess("");
            }}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              loginMethod === method ? "bg-white text-[#354B9C] shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {method === "otp" ? "Login with OTP" : "Login with Password"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {loginMethod === "otp" ? (
          <>
            {/* Phone Number with Flag */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
              <div className="mt-1 flex items-center gap-2 border border-gray-300 rounded-md pl-3">
                <div className="flex items-center gap-1">
                  <img src="https://flagcdn.com/w20/in.png" alt="India" className="w-5 h-4 rounded-sm" />
                  <span className="text-gray-700 font-medium">+91</span>
                </div>
                <input
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="Enter your 10-digit mobile number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={otpSent}
                  className="flex-1 outline-none !border-none text-gray-900 placeholder-gray-400 py-2 pl-2 text-base"
                />
              </div>

              {otpSent && (
                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    setFormData((p) => ({ ...p, otp: "" }));
                  }}
                  className="text-xs text-[#354B9C] hover:text-[#2a3a7a] mt-2"
                >
                  Change phone number
                </button>
              )}
            </div>

            {/* OTP Input */}
            {otpSent && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
                <div className="flex gap-3 justify-center">
                  {Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <input
                        key={i}
                        ref={(el) => (otpRefs.current[i] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={formData.otp[i] || ""}
                        onChange={(e) => handleOTPChange(i, e.target.value)}
                        onPaste={(e) => {
                          e.preventDefault();
                          const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
                          if (!paste) return;
                          setFormData((p) => ({ ...p, otp: paste }));
                          const lastIndex = Math.min(paste.length - 1, 3);
                          otpRefs.current[lastIndex]?.focus();
                          if (paste.length === 4) handleOTPLogin(paste);
                        }}
                        className="w-12 h-12 text-center text-lg border border-gray-300 rounded-md focus:ring-2 focus:ring-[#354B9C] focus:border-[#354B9C]"
                      />
                    ))}
                </div>

                <div className="mt-2 text-sm text-center text-gray-600">
                  <span>Didn't receive OTP? </span>
                  <button
                    type="button"
                    onClick={() => secondsLeft === 0 && handleSendOTP()}
                    disabled={isLoading || secondsLeft > 0}
                    className="font-medium text-[#354B9C] hover:text-[#2a3a7a]"
                  >
                    {secondsLeft > 0 ? `Resend in ${secondsLeft}s` : "Resend"}
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Email + Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#354B9C] focus:border-[#354B9C] sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                name="password"
                type="password"
                required
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#354B9C] focus:border-[#354B9C] sm:text-sm"
              />
            </div>

            <div className="text-right">
              <Link href="/forgot-password" className="text-sm text-[#354B9C] hover:text-[#2a3a7a]">
                Forgot password?
              </Link>
            </div>
          </>
        )}

        {/* Error / Success */}
        {error && <p className="text-center text-red-600 bg-red-50 p-2 rounded">{error}</p>}
        {success && <p className="text-center text-green-600 bg-green-50 p-2 rounded">{success}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 rounded-md text-white bg-[#354B9C] hover:bg-[#2a3a7a] transition disabled:opacity-50"
        >
          {isLoading ? "Processing..." : loginMethod === "otp" ? (otpSent ? "Verify OTP" : "Send OTP") : "Sign In"}
        </button>
      </form>
    </div>
  );
}
