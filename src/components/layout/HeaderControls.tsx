"use client";

import { KeyboardArrowDown } from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from 'next/navigation';

type Props = {
  user: any;
  /** optional display name to show in the summary button */
  displayName?: string | null;
  isTransparent?: boolean;
};

export default function HeaderControls({ user, displayName, isTransparent }: Props) {
  const initial = user?.firstname ? user.firstname.charAt(0).toUpperCase() : (user?.name ? String(user.name).charAt(0).toUpperCase() : "U");
  const router = useRouter();

  return (
    <div className="relative">
      <details className="relative">
        <summary
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-md text-gray-700 ${isTransparent? "bg-white/5" : "bg-black/5"} cursor-pointer list-none`}
          aria-haspopup="true"
        >
          <span className="sr-only">Open menu</span>

          <div className="py-2 rounded-md flex items-center justify-center">
            <span className={`ml-2 font-medium text-sm text-[#354B9C] ${isTransparent? "text-white" : ""}`}>Hi, Traveller</span>
          </div>
          <KeyboardArrowDown className={`"w-5 h-5 ${isTransparent? "text-white" : "text-[#354B9C]"}`} />
        </summary>

        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-md shadow-lg z-20">
          <div className="py-1">
            <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Profile</Link>
            <Link href="/bookings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Bookings</Link>

            <div className="border-t border-gray-100" />

            <form className="m-0">
              <button onClick={(e) => {
                e.preventDefault();
                if (typeof window !== 'undefined' && window.localStorage) {
                  window.localStorage.removeItem("userData");
                  // dispatch event so header updates instantly
                  window.dispatchEvent(new Event("userChanged"));
                  router.push('/');
                  router.refresh();
                }
              }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </details>
    </div>
  );
}
