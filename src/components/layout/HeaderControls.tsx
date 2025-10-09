// src/components/layout/HeaderControls.tsx
import Link from "next/link";
import { AuthUser } from "@/lib/auth";
import { useRouter } from 'next/navigation';

type Props = {
  user: AuthUser;
};

export default function HeaderControls({ user }: Props) {
  const initial = user?.firstname ? user.firstname.charAt(0).toUpperCase() : "U";
  const router = useRouter();

  return (
    <div className="relative">
      <details className="relative">
        <summary
          className="inline-flex items-center gap-1 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer list-none"
          aria-haspopup="true"
        >
          <span className="sr-only">Open menu</span>
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="font-semibold text-sm text-[#354B9C]">{initial}</span>
          </div>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-gray-400" aria-hidden>
            <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </summary>

        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-20">
          <div className="py-1">
            <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Profile</Link>
            <Link href="/bookings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Bookings</Link>

            <div className="border-t border-gray-100" />


            <form className="m-0">
              <button onClick={()=>{
                if(window.localStorage){
                  window.localStorage.removeItem("userData")
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
