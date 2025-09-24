// src/components/layout/HeaderClient.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES, APP_CONFIG, SERVICES } from "@/utils/constants";
import type { AuthUser } from "@/lib/auth";
import HeaderControls from "@/components/layout/HeaderControls";

/**
 * HeaderClient
 * - serverUser: user object fetched on server (serializable)
 * - Header becomes transparent only when:
 *    a) pathname === ROUTES.HOME (home page)
 *    b) the hero section is visible in viewport (IntersectionObserver)
 *
 * Hero detection uses `id="home-hero"` if present, otherwise falls back to aria-label="Hero".
 */
type Props = {
  serverUser: AuthUser | null;
};

export default function HeaderClient({ serverUser }: Props) {
  const pathname = usePathname() ?? "/";
  const isHome = pathname === ROUTES.HOME || pathname === "/";

  // optimistic initial state: if on home route, assume hero visible until observer proves otherwise.
  const [heroVisible, setHeroVisible] = useState<boolean>(isHome);

  useEffect(() => {
    if (!isHome) {
      setHeroVisible(false);
      return;
    }

    // Find hero element by id first (recommended), fall back to aria-label
    const heroEl =
      document.getElementById("home-hero") ||
      document.querySelector<HTMLElement>('[aria-label="Hero"], [data-hero="home"]');

    if (!heroEl) {
      // if no hero found, assume not visible
      setHeroVisible(false);
      return;
    }

    // Observe hero visibility (if the hero intersects viewport, treat header as "over hero")
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // entry.isIntersecting is true while hero is (partly) visible
          setHeroVisible(entry.isIntersecting);
        });
      },
      { root: null, threshold: 0.05 } // small threshold, adjust if needed
    );

    obs.observe(heroEl);
    return () => obs.disconnect();
  }, [isHome, pathname]);

  const isTransparent = isHome && heroVisible;

  // classes vary based on transparency
  const headerClass = `fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${isTransparent ? "bg-gradient-to-b from-black/30 via-black/10 to-black/5 border-transparent backdrop-blur-sm" : "bg-white my-border border-b"}`;
  const logoClass = `${isTransparent ? "text-white" : "text-[#354B9C]"}`;
  const navTextActive = isTransparent ? "text-white" : "text-[#354B9C]";
  const navTextInactive = isTransparent ? "text-white hover:bg-white/5" : "text-gray-700 hover:bg-gray-100";
  const summaryBase = `list-none px-2 py-1 rounded-md font-semibold cursor-pointer ${isTransparent ? "text-white hover:bg-white/5" : "text-gray-700 hover:bg-gray-100"}`;
  const dropdownBg = "bg-white my-border border rounded-md shadow-lg";
  const signInBtn = isTransparent
    ? "hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-md bg-white text-[#354B9C] font-semibold hover:opacity-95"
    : "hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-md bg-[#354B9C] text-white font-semibold hover:opacity-95";
  const downloadBtn = isTransparent
    ? "hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-md border border-white text-white font-semibold hover:bg-white hover:text-[#354B9C] transition-colors"
    : "hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-md border border-[#354B9C] text-[#354B9C] font-semibold hover:bg-[#354B9C] hover:text-white transition-colors";
  const mobileToggleClass = `inline-flex items-center justify-center h-10 w-10 rounded-md ${isTransparent ? "text-white hover:bg-white/5" : "text-gray-700 hover:bg-gray-100"}`;

  const NAV_ITEMS = [
    { label: "Home", href: ROUTES.HOME },
    { label: "For Business", href: ROUTES.BUSINESS },
    { label: "About Us", href: ROUTES.ABOUT },
  ];

  const CITIES = [
    { label: "Tirupur", customerHref: "/call-drivers-in-tirupur", driverHref: "/car-driver-job-in-tirupur" },
    { label: "Chennai", customerHref: "/call-drivers-in-chennai", driverHref: "/car-driver-job-in-chennai" },
    { label: "Trichy", customerHref: "/call-drivers-in-trichy", driverHref: "/car-driver-job-in-trichy" },
    { label: "Madurai", customerHref: "/call-drivers-in-madurai", driverHref: "/car-driver-job-in-madurai" },
    { label: "Coimbatore", customerHref: "/call-drivers-in-coimbatore", driverHref: "/car-driver-job-in-coimbatore" },
  ];

  return (
    <header className={headerClass} data-header-transparent={isTransparent ? "true" : "false"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 h-16">
          <div className="flex-shrink-0">
            <Link href={ROUTES.HOME} aria-label={`${APP_CONFIG.name} home`} className={`inline-flex items-center`}>
              <span className={`text-lg font-extrabold ${logoClass}`}>{APP_CONFIG.name}</span>
            </Link>
          </div>

          <nav className="hidden md:flex md:flex-1 md:items-center md:justify-start gap-6" aria-label="Primary navigation">
            {NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href === ROUTES.SERVICES && pathname.startsWith("/services/"));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-2 py-1 rounded-md font-medium transition-colors ${isActive ? navTextActive : navTextInactive}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}

            <details className="relative group">
              <summary className={summaryBase} aria-haspopup="true">Services</summary>
              <div className={`absolute left-0 mt-2 w-56 ${dropdownBg} z-40`}>
                <ul className="p-2">
                  {SERVICES.map((s) => {
                    const isActive = pathname === `/services/${s.id}`;
                    return (
                      <li key={s.id}>
                        <Link
                          href={`/services/${s.id}`}
                          className={`block px-3 py-2 rounded-md text-sm font-medium ${isActive ? navTextActive : "text-gray-800 hover:bg-gray-100"}`}
                          aria-current={isActive ? "page" : undefined}
                        >
                          {s.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </details>

            <details className="relative group">
              <summary className={summaryBase} aria-haspopup="true">Cities</summary>
              <div className={`absolute left-0 mt-2 w-56 ${dropdownBg} z-40`}>
                <ul className="p-2">
                  {CITIES.map((c) => {
                    const isActive = pathname === c.customerHref;
                    return (
                      <li key={c.customerHref}>
                        <Link
                          href={c.customerHref}
                          className={`block px-3 py-2 rounded-md text-sm font-medium ${isActive ? navTextActive : "text-gray-800 hover:bg-gray-100"}`}
                          aria-current={isActive ? "page" : undefined}
                        >
                          {c.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </details>

            <details className="relative group">
              <summary className={summaryBase} aria-haspopup="true">Driver Jobs</summary>
              <div className={`absolute left-0 mt-2 w-56 ${dropdownBg} z-40`}>
                <ul className="p-2">
                  {CITIES.map((c) => {
                    const isActive = pathname === c.driverHref;
                    return (
                      <li key={c.driverHref}>
                        <Link
                          href={c.driverHref}
                          className={`block px-3 py-2 rounded-md text-sm font-medium ${isActive ? navTextActive : "text-gray-800 hover:bg-gray-100"}`}
                          aria-current={isActive ? "page" : undefined}
                        >
                          {c.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </details>
          </nav>

          <div className="flex items-center ml-auto gap-3">
            {serverUser ? (
              <div className={`hidden md:flex items-center gap-3 ${isTransparent ? "text-white" : ""}`}>
                <span className={isTransparent ? "text-sm text-white" : "text-sm text-gray-700"}>
                  Welcome, <span className="font-semibold text-[#354B9C]">{serverUser.firstname}</span>
                </span>
                <HeaderControls user={serverUser} />
              </div>
            ) : (
              <Link href="/login" className={signInBtn} aria-label="Sign In">Sign In</Link>
            )}

            <Link href={ROUTES.DOWNLOAD} className={downloadBtn} aria-label="Download App">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="inline-block">
                <path d="M12 3v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 11l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21 21H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Download App</span>
            </Link>

            <div className="md:hidden">
              <input id="nav-toggle" type="checkbox" className="peer hidden" aria-hidden="true" />
              <label htmlFor="nav-toggle" className={mobileToggleClass} aria-label="Open menu" role="button">
                <span className="block w-5 h-0.5 bg-current relative before:content-[''] before:block before:w-5 before:h-0.5 before:bg-current before:absolute before:-top-1.5 after:content-[''] after:block after:w-5 after:h-0.5 after:bg-current after:absolute after:top-1.5" />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* mobile aside + overlay: keep same mobile menu you already have */}
      <aside className="peer-checked:translate-x-0 transform translate-x-full transition-transform fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-lg z-50" role="dialog" aria-label="Mobile menu">
        {/* ... copy your mobile menu markup here (same as server version) ... */}
      </aside>

      <label htmlFor="nav-toggle" className="peer-checked:block hidden fixed inset-0 bg-black bg-opacity-40 z-40" aria-hidden="true" />
    </header>
  );
}
