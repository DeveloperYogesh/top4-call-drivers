import React from "react";
import Link from "next/link";
import { APP_CONFIG } from "@/utils/constants";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
      <div className="max-w-lg mx-auto text-center px-4">
        <div className="mb-8">
          <p className="text-8xl font-bold text-[#354B9C] mb-2">404</p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 !mb-3">
            Page Not Found
          </h1>
          <p className="text-gray-600 leading-relaxed">
            Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
            Let us help you find what you need.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <Link
            href="/"
            className="bg-[#354B9C] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#2a3a7a] transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/book-driver"
            className="bg-white text-[#354B9C] border border-[#354B9C] px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Book a Driver
          </Link>
          <Link
            href="/contact"
            className="bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Contact Us
          </Link>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-500 mb-3">Popular pages:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link href="/call-drivers-tariff" className="text-sm text-[#354B9C] hover:underline">
              Tariff & Rates
            </Link>
            <span className="text-gray-300">·</span>
            <Link href="/best-acting-drivers-in-chennai" className="text-sm text-[#354B9C] hover:underline">
              Drivers in Chennai
            </Link>
            <span className="text-gray-300">·</span>
            <Link href="/best-acting-drivers-in-tiruppur" className="text-sm text-[#354B9C] hover:underline">
              Drivers in Tiruppur
            </Link>
            <span className="text-gray-300">·</span>
            <Link href="/blog" className="text-sm text-[#354B9C] hover:underline">
              Blog
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-sm text-gray-500">
            Need help? Call us at{" "}
            <a href={`tel:${APP_CONFIG.primaryPhone}`} className="text-[#354B9C] font-medium hover:underline">
              {APP_CONFIG.primaryPhoneFormatted}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
