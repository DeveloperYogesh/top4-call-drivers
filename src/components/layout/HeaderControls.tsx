"use client";

import { KeyboardArrowDown } from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';

type Props = {
  user: any;
  /** optional display name to show in the summary button */
  displayName?: string | null;
  isTransparent?: boolean;
};

export default function HeaderControls({ user, displayName, isTransparent }: Props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeout.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  return (
    <div className="relative">
      <div
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-md text-gray-700 ${isTransparent ? "bg-white/5" : "bg-black/5"} cursor-pointer select-none`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="sr-only">Open menu</span>
        <div className="py-2 rounded-md flex items-center justify-center">
          <span className={`ml-2 font-medium text-sm text-[#354B9C] ${isTransparent ? "text-white drop-shadow-md" : ""}`}>
            Hi, {displayName || "Traveller"}
          </span>
        </div>
        <KeyboardArrowDown
          className={`w-5 h-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""} ${isTransparent ? "text-white" : "text-[#354B9C]"}`}
        />
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-md shadow-lg z-20 overflow-hidden">
          <div className="py-1">
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              My Profile
            </Link>
            <Link
              href="/history"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              My Bookings
            </Link>

            <div className="border-t border-gray-100 my-1" />

            <button
              onClick={(e) => {
                e.preventDefault();
                setIsOpen(false);
                if (typeof window !== "undefined" && window.localStorage) {
                  window.localStorage.removeItem("userData");
                  window.dispatchEvent(new Event("userChanged"));
                  router.push("/");
                  router.refresh();
                }
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
