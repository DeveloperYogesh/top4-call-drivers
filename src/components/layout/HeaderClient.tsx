"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES, APP_CONFIG, SERVICES } from "@/utils/constants";
import type { AuthUser } from "@/lib/auth";
import HeaderControls from "@/components/layout/HeaderControls";
import PhoneIcon from "@mui/icons-material/Phone";
import DownloadIcon from "@mui/icons-material/Download";

type Props = {
  serverUser: AuthUser | null;
};

export default function HeaderClient({ serverUser }: Props) {
  const pathname = usePathname() ?? "/";
  const isHome = pathname === ROUTES.HOME || pathname === "/";

  const [heroVisible, setHeroVisible] = useState<boolean>(isHome);

  useEffect(() => {
    if (!isHome) {
      setHeroVisible(false);
      return;
    }

    const heroEl =
      document.getElementById("home-hero") ||
      document.querySelector<HTMLElement>('[aria-label="Hero"], [data-hero="home"]');

    if (!heroEl) {
      setHeroVisible(false);
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setHeroVisible(entry.isIntersecting);
        });
      },
      { root: null, threshold: 0.05 }
    );

    obs.observe(heroEl);
    return () => obs.disconnect();
  }, [isHome, pathname]);

  const isTransparent = isHome && heroVisible;

  const headerClass = `fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
    isTransparent
      ? "bg-gradient-to-b from-black/30 via-black/10 to-black/5 border-transparent backdrop-blur-sm"
      : "bg-white border-b border-gray-200"
  }`;
  const logoClass = `${isTransparent ? "text-white" : "text-[#354B9C]"}`;
  const navTextActive = isTransparent ? "text-white" : "text-[#354B9C]";
  const navTextInactive = isTransparent ? "text-white hover:bg-white/5" : "text-gray-700 hover:bg-gray-100";
  const summaryBase = `list-none px-2 py-1 rounded-md font-semibold cursor-pointer ${
    isTransparent ? "text-white hover:bg-white/5" : "text-gray-700 hover:bg-gray-100"
  }`;
  const dropdownBg = "bg-white my-border border rounded-md shadow-lg";
  const signInBtn = isTransparent
    ? "hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-md bg-white text-[#354B9C] font-semibold hover:opacity-95"
    : "hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-md bg-[#354B9C] text-white font-semibold hover:opacity-95";
  const downloadBtn = isTransparent
    ? "hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-md border border-white text-white font-semibold hover:bg-white hover:text-[#354B9C] transition-colors"
    : "hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-md border border-[#354B9C] text-[#354B9C] font-semibold hover:bg-[#354B9C] hover:text-white transition-colors";
  const callBtn = isTransparent
    ? "inline-flex items-center gap-2 p-2 rounded-full text-white hover:bg-white/10 transition-colors border border-white"
    : "inline-flex items-center gap-2 p-2 rounded-full text-[#354B9C] hover:bg-gray-100 transition-colors border border-[#354B9C]";
  const mobileToggleClass = `inline-flex items-center justify-center h-10 w-10 rounded-md ${
    isTransparent ? "text-white hover:bg-white/5" : "text-gray-700 hover:bg-gray-100"
  }`;

  const NAV_ITEMS = [
    { label: "Home", href: ROUTES.HOME },
    { label: "Tariff", href: ROUTES.TARIFF },
    { label: "About Us", href: ROUTES.ABOUT },
  ];

  const CITIES = [
    { label: "Tirupur", customerHref: "/call-drivers-in-tirupur", driverHref: "/car-driver-job-in-tirupur" },
    { label: "Chennai", customerHref: "/call-drivers-in-chennai", driverHref: "/car-driver-job-in-chennai" },
    { label: "Trichy", customerHref: "/call-drivers-in-trichy", driverHref: "/car-driver-job-in-trichy" },
    { label: "Madurai", customerHref: "/call-drivers-in-madurai", driverHref: "/car-driver-job-in-madurai" },
    { label: "Coimbatore", customerHref: "/call-drivers-in-coimbatore", driverHref: "/car-driver-job-in-coimbatore" },
  ];

  // State to track which dropdown is open: "services" | "cities" | "driverJobs" | null
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Ref to hold close timeout ID to delay submenu closing
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);

  // Open a dropdown menu and cancel any pending close timeout
  const openMenu = (menu: string) => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
    setOpenDropdown(menu);
  };

  // Start delayed closing of dropdown (100ms delay)
  const closeMenuWithDelay = () => {
    if (closeTimeout.current) return; // avoid multiple timers
    closeTimeout.current = setTimeout(() => {
      setOpenDropdown(null);
      closeTimeout.current = null;
    }, 100);
  };

  // Immediately close dropdown (used on link click)
  const closeMenuImmediately = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
    setOpenDropdown(null);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (closeTimeout.current) {
        clearTimeout(closeTimeout.current);
      }
    };
  }, []);

  // Chevron SVG component
  const Chevron = ({ open }: { open: boolean }) => (
    <svg
      className={`ml-2 transition-transform duration-150 transform ${open ? "rotate-180" : "rotate-0"}`}
      width="14"
      height="14"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
    >
      <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <header className={headerClass} data-header-transparent={isTransparent ? "true" : "false"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 h-16">
          <div className="flex-shrink-0">
            <Link href={ROUTES.HOME} aria-label={`${APP_CONFIG.name} home`} className="inline-flex items-center">
              <span className={`text-lg font-extrabold ${logoClass}`}>{APP_CONFIG.name}</span>
            </Link>
          </div>

          <nav className="hidden md:flex md:flex-1 md:items-center md:justify-start gap-6" aria-label="Primary navigation">
            {NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.href || (item.href === ROUTES.SERVICES && pathname.startsWith("/services/"));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-2 py-1 rounded-md font-medium transition-colors ${
                    isActive ? navTextActive : navTextInactive
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => openMenu("services")}
              onMouseLeave={closeMenuWithDelay}
            >
              <button
                className={summaryBase + " inline-flex items-center"}
                aria-haspopup="true"
                aria-expanded={openDropdown === "services"}
                onClick={(e) => {
                  e.preventDefault();
                  // toggle on click
                  setOpenDropdown((prev) => (prev === "services" ? null : "services"));
                }}
              >
                <span>Services</span>
                <Chevron open={openDropdown === "services"} />
              </button>
              {openDropdown === "services" && (
                <div className={`absolute left-0 mt-2 w-56 ${dropdownBg} z-40`}>
                  <ul className="p-2">
                    {SERVICES.map((s) => {
                      const isActive = pathname === `/services/${s.id}`;
                      return (
                        <li key={s.id}>
                          <Link
                            href={`/services/${s.id}`}
                            className={`block px-3 py-2 rounded-md text-sm font-medium ${
                              isActive ? navTextActive : "text-gray-800 hover:bg-gray-100"
                            }`}
                            aria-current={isActive ? "page" : undefined}
                            onClick={closeMenuImmediately}
                          >
                            {s.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            {/* Cities Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => openMenu("cities")}
              onMouseLeave={closeMenuWithDelay}
            >
              <button
                className={summaryBase + " inline-flex items-center"}
                aria-haspopup="true"
                aria-expanded={openDropdown === "cities"}
                onClick={(e) => {
                  e.preventDefault();
                  setOpenDropdown((prev) => (prev === "cities" ? null : "cities"));
                }}
              >
                <span>Cities</span>
                <Chevron open={openDropdown === "cities"} />
              </button>
              {openDropdown === "cities" && (
                <div className={`absolute left-0 mt-2 w-56 ${dropdownBg} z-40`}>
                  <ul className="p-2">
                    {CITIES.map((c) => {
                      const isActive = pathname === c.customerHref;
                      return (
                        <li key={c.customerHref}>
                          <Link
                            href={c.customerHref}
                            className={`block px-3 py-2 rounded-md text-sm font-medium ${
                              isActive ? navTextActive : "text-gray-800 hover:bg-gray-100"
                            }`}
                            aria-current={isActive ? "page" : undefined}
                            onClick={closeMenuImmediately}
                          >
                            {c.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            {/* Driver Jobs Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => openMenu("driverJobs")}
              onMouseLeave={closeMenuWithDelay}
            >
              <button
                className={summaryBase + " inline-flex items-center"}
                aria-haspopup="true"
                aria-expanded={openDropdown === "driverJobs"}
                onClick={(e) => {
                  e.preventDefault();
                  setOpenDropdown((prev) => (prev === "driverJobs" ? null : "driverJobs"));
                }}
              >
                <span>Driver Jobs</span>
                <Chevron open={openDropdown === "driverJobs"} />
              </button>
              {openDropdown === "driverJobs" && (
                <div className={`absolute left-0 mt-2 w-56 ${dropdownBg} z-40`}>
                  <ul className="p-2">
                    {CITIES.map((c) => {
                      const isActive = pathname === c.driverHref;
                      return (
                        <li key={c.driverHref}>
                          <Link
                            href={c.driverHref}
                            className={`block px-3 py-2 rounded-md text-sm font-medium ${
                              isActive ? navTextActive : "text-gray-800 hover:bg-gray-100"
                            }`}
                            aria-current={isActive ? "page" : undefined}
                            onClick={closeMenuImmediately}
                          >
                            {c.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </nav>

          {/* Right Side */}
          <div className="flex items-center ml-auto gap-3">
            {/* {serverUser ? (
              <div className={`hidden md:flex items-center gap-3 ${isTransparent ? "text-white" : ""}`}>
                <span className={isTransparent ? "text-sm text-white" : "text-sm text-gray-700"}>
                  Welcome, <span className="font-semibold text-[#354B9C]">{serverUser.firstname}</span>
                </span>
                <HeaderControls user={serverUser} />
              </div>
            ) : (
              <Link href="/login" className={signInBtn} aria-label="Sign In">
                Sign In
              </Link>
            )} */}

            <Link href="tel:+9104428287777" className={callBtn} aria-label="Call Us">
              <PhoneIcon style={{ fontSize: 26 }} />
            </Link>

            <Link href={ROUTES.DOWNLOAD} className={downloadBtn} aria-label="Download App">
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

      <aside
        className="peer-checked:translate-x-0 transform translate-x-full transition-transform fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-lg z-50"
        role="dialog"
        aria-label="Mobile menu"
      >
        {/* TODO: Add your mobile menu content here */}
      </aside>

      <label
        htmlFor="nav-toggle"
        className="peer-checked:block hidden fixed inset-0 bg-black bg-opacity-40 z-40"
        aria-hidden="true"
      />
    </header>
  );
}