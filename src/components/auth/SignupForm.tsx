"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

interface SignupFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  vehicleModel: string;
  segment: string;
  vehicleType: string;
  otp: string;
}

export default function SignupForm() {
  const router = useRouter();
  const { sendOTP, verifyOTP, registerUser } = useAuth();

  const [formData, setFormData] = useState<SignupFormData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    vehicleModel: "",
    segment: "SUV", // default
    vehicleType: "Manual", // default
    otp: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [success, setSuccess] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const startTimer = (secs: number) => {
    setSecondsLeft(secs);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError("First name is required");
      return false;
    }
    if (!formData.phone || formData.phone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return false;
    }
    if (
      !formData.email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!formData.vehicleModel.trim()) {
      setError("Vehicle model is required");
      return false;
    }
    return true;
  };

  const handleSendOTP = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Use useAuth hook instead of direct fetch
      const res = await sendOTP(formData.phone);

      if (res?.success || res?.Success) {
        setOtpSent(true);
        setSuccess("OTP sent successfully! Please check your mobile.");
        startTimer(60);
      } else {
        setError(res?.message || res?.Message || "Failed to send OTP");
      }
    } catch (error) {
      setError("Network error. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      await handleSendOTP();
      return;
    }

    if (!formData.otp || formData.otp.length !== 4) {
      setError("Please enter a valid 4-digit OTP");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // 1. Verify OTP first
      const verifyRes = await verifyOTP(formData.phone, formData.otp);

      if (!verifyRes.success) {
        setError(verifyRes.message || "Invalid OTP");
        setIsLoading(false);
        return;
      }

      // 2. If valid, Register User
      const regRes = await registerUser({
        mobileno: formData.phone,
        firstname: formData.firstName,
        lastname: formData.lastName,
        emailid: formData.email,
        vehiclemodel: formData.vehicleModel,
        segment: formData.segment,
        vehicletype: formData.vehicleType,
        userImage: "", // default empty
      });

      if (regRes.success) {
        setSuccess("Account created successfully! Redirecting...");
        // useAuth persistor typically handles storing session, so just redirect
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1000);
      } else {
        if (regRes.message?.toLowerCase().includes("already exists")) {
          setError("User already registered with this number. Please Sign In.");
          // Optional: You could automatically redirect or show a button, 
          // but a clear message is a good first step.
        } else {
          setError(regRes.message || "Failed to create account");
        }
      }
    } catch (error) {
      setError("Network error. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-6">
      {!otpSent ? (
        <>
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name *
              </label>
              <div className="mt-1">
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-[#354B9C] focus:border-[#354B9C] sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <div className="mt-1">
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-[#354B9C] focus:border-[#354B9C] sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Mobile Number *
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
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-[#354B9C] focus:border-[#354B9C] sm:text-sm"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address *
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

          {/* Vehicle Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-3">
              <label
                htmlFor="vehicleModel"
                className="block text-sm font-medium text-gray-700"
              >
                Vehicle Model *
              </label>
              <div className="mt-1">
                <input
                  id="vehicleModel"
                  name="vehicleModel"
                  type="text"
                  required
                  placeholder="e.g. Swift, Innova"
                  value={formData.vehicleModel}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-[#354B9C] focus:border-[#354B9C] sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="segment"
                className="block text-sm font-medium text-gray-700"
              >
                Segment *
              </label>
              <div className="mt-1">
                <select
                  id="segment"
                  name="segment"
                  value={formData.segment}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#354B9C] focus:border-[#354B9C] sm:text-sm"
                >
                  <option value="Hatchback">Hatchback</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Luxury">Luxury</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="vehicleType"
                className="block text-sm font-medium text-gray-700"
              >
                Transmission Type *
              </label>
              <div className="mt-1">
                <select
                  id="vehicleType"
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#354B9C] focus:border-[#354B9C] sm:text-sm"
                >
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* OTP Verification */}
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Verify Your Mobile Number
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              We've sent a 4-digit OTP to <strong>{formData.phone}</strong>
            </p>
          </div>

          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700"
            >
              Enter OTP *
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
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-[#354B9C] focus:border-[#354B9C] sm:text-sm text-center text-lg tracking-widest"
              />
            </div>
            <div className="mt-2 text-sm text-gray-600 text-center">
              Didn't receive?{" "}
              <button
                type="button"
                onClick={async () => {
                  if (secondsLeft > 0) return;
                  setOtpSent(false);
                  setFormData((prev) => ({ ...prev, otp: "" }));
                  await handleSendOTP();
                }}
                className={`font-medium ${secondsLeft > 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-[#354B9C] hover:text-[#2a3a7a]"
                  }`}
                disabled={secondsLeft > 0 || isLoading}
              >
                {secondsLeft > 0 ? `Resend in ${secondsLeft}s` : "Resend"}
              </button>
            </div>
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
            <>{otpSent ? "Create Account" : "Send OTP"}</>
          )}
        </button>
      </div>

      {!otpSent && (
        <div className="text-xs text-gray-500 text-center">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="text-[#354B9C] hover:text-[#2a3a7a]">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-[#354B9C] hover:text-[#2a3a7a]"
          >
            Privacy Policy
          </Link>
        </div>
      )}
    </form>
  );
}
