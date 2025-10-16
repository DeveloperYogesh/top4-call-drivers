"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { APP_CONFIG } from "@/utils/constants";
import { POST } from "@/utils/apiHelpres";
type LoginMethod = "otp" | "password";

interface LoginFormData {
  phone: string;
  email: string;
  password: string;
  otp: string;
}

export default function LoginForm() {
  const router = useRouter();
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSendOTP = async () => {
    if (!formData.phone || formData.phone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const data = await POST("api/V1/booking/sendOTP", {
        mobileno: formData.phone,
      });

      if (data?.Success) {
        setOtpSent(true);
        setSuccess("OTP sent successfully! Please check your mobile.");
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPLogin = async () => {
    if (!formData.phone || !formData.otp) {
      setError("Please enter both phone number and OTP");
      return;
    }

    if (formData.otp.length !== 4) {
      setError("Please enter a valid 4-digit OTP");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const data = await POST("api/V1/booking/sendOTP", {
        mobileno: formData.phone,
        otp: formData.otp,
      });
      console.log(data,"this is data");
      
      if (data?.Success) {
        setSuccess("Login successful! Redirecting...");
        if (window.localStorage) {
          window.localStorage.setItem("userData", JSON.stringify(data.Data));
          router.push("/");
        }
      } else {
        setError(data.message || "Invalid OTP");
      }
    } catch (error) {
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
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1000);
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loginMethod === "otp") {
      if (!otpSent) {
        await handleSendOTP();
      } else {
        await handleOTPLogin();
      }
    } else {
      await handlePasswordLogin();
    }
  };

  return (
    <div className="space-y-6">
      {/* Login Method Toggle */}
      <div className="flex rounded-lg bg-gray-100 p-1">
        <button
          type="button"
          onClick={() => {
            setLoginMethod("otp");
            setOtpSent(false);
            setFormData((prev) => ({
              ...prev,
              otp: "",
              email: "",
              password: "",
            }));
            setError("");
            setSuccess("");
          }}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
            loginMethod === "otp"
              ? "bg-white text-[#354B9C] shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Login with OTP
        </button>
        <button
          type="button"
          onClick={() => {
            setLoginMethod("password");
            setOtpSent(false);
            setFormData((prev) => ({ ...prev, phone: "", otp: "" }));
            setError("");
            setSuccess("");
          }}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
            loginMethod === "password"
              ? "bg-white text-[#354B9C] shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Login with Password
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {loginMethod === "otp" ? (
          <>
            {/* Phone Number Input */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Mobile Number
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  maxLength={10}
                  placeholder="Enter your 10-digit mobile number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={otpSent}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-[#354B9C] focus:border-[#354B9C] sm:text-sm disabled:bg-gray-100"
                />
              </div>
            </div>

            {/* OTP Input (shown after OTP is sent) */}
            {otpSent && (
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700"
                >
                  Enter OTP
                </label>
                <div className="mt-1">
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    maxLength={4}
                    placeholder="Enter 4-digit OTP"
                    value={formData.otp}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-[#354B9C] focus:border-[#354B9C] sm:text-sm"
                  />
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Didn't receive OTP?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setFormData((prev) => ({ ...prev, otp: "" }));
                      handleSendOTP();
                    }}
                    className="font-medium text-[#354B9C] hover:text-[#2a3a7a]"
                    disabled={isLoading}
                  >
                    Resend
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-[#354B9C] focus:border-[#354B9C] sm:text-sm"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-[#354B9C] focus:border-[#354B9C] sm:text-sm"
                />
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-[#354B9C] hover:text-[#2a3a7a]"
              >
                Forgot your password?
              </Link>
            </div>
          </>
        )}

        {/* Error Message */}
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="text-sm text-green-700">{success}</div>
          </div>
        )}

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#354B9C] hover:bg-[#2a3a7a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#354B9C] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </div>
            ) : (
              <>
                {loginMethod === "otp"
                  ? otpSent
                    ? "Verify OTP"
                    : "Send OTP"
                  : "Sign In"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
