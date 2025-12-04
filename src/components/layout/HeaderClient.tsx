"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES, APP_CONFIG, SERVICES } from "@/utils/constants";
import HeaderControls from "@/components/layout/HeaderControls";
import PhoneIcon from "@mui/icons-material/Phone";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

export default function HeaderClientUpdated() {
  const pathname = usePathname() ?? "/";
  const isHome = pathname === ROUTES.HOME || pathname === "/";
  const { user: loggedUser } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine header style
  // If on Home and NOT scrolled -> Transparent
  // If on Home and Scrolled -> White Glass
  // If NOT on Home -> White (always)
  const isTransparent = isHome && !isScrolled;

  const headerClass = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isTransparent
      ? "bg-gradient-to-b from-black/60 to-transparent py-4"
      : "bg-white/90 backdrop-blur-md shadow-sm py-2 border-b border-gray-100"
  }`;

  const logoClass = isTransparent ? "text-white drop-shadow-md" : "text-[#354B9C]";
  const navTextClass = (isActive: boolean) =>
    `text-sm font-medium transition-colors duration-200 ${
      isActive
        ? isTransparent
          ? "text-white font-bold drop-shadow-md"
          : "text-[#354B9C] font-bold"
        : isTransparent
        ? "text-white/90 hover:text-white drop-shadow-md"
        : "text-gray-600 hover:text-[#354B9C]"
    }`;

  const NAV_ITEMS = [
    { label: "Tariff", href: ROUTES.TARIFF },
    { label: "About", href: ROUTES.ABOUT },
    { label: "Blog", href: ROUTES.BLOG },
    { label: "Contact", href: ROUTES.CONTACT },
  ];

  const CITIES = [
    { label: "Tiruppur", customerHref: "/best-acting-drivers-in-tiruppur", driverHref: "/car-driver-job-in-tiruppur" },
    { label: "Chennai", customerHref: "/best-acting-drivers-in-chennai", driverHref: "/car-driver-job-in-chennai" },
    { label: "Trichy", customerHref: "/best-acting-drivers-in-trichy", driverHref: "/car-driver-job-in-trichy" },
    { label: "Madurai", customerHref: "/best-acting-drivers-in-madurai", driverHref: "/car-driver-job-in-madurai" },
    { label: "Coimbatore", customerHref: "/best-acting-drivers-in-coimbatore", driverHref: "/car-driver-job-in-coimbatore" },
  ];

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);

  const openMenu = (menu: string) => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setOpenDropdown(menu);
  };

  const closeMenuWithDelay = () => {
    closeTimeout.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  const closeMenuImmediately = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  };

  const Chevron = ({ open }: { open: boolean }) => (
    <motion.svg
      animate={{ rotate: open ? 180 : 0 }}
      className={`ml-1 w-4 h-4 ${isTransparent ? "text-white" : "text-gray-500"}`}
      viewBox="0 0 20 20"
      fill="none"
    >
      <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </motion.svg>
  );

  return (
    <header className={headerClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href={ROUTES.HOME} className="flex items-center gap-2 group">
            <div className="relative w-10 h-10 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/images/top4-call-drivers-logo.png"
                alt={APP_CONFIG.name}
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className={`text-xl font-bold tracking-tight ${logoClass}`}>
              {APP_CONFIG.name}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={navTextClass(pathname === item.href)}
              >
                {item.label}
              </Link>
            ))}

            {/* Services Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => openMenu("services")}
              onMouseLeave={closeMenuWithDelay}
            >
              <button className={`flex items-center ${navTextClass(pathname.startsWith("/services"))}`}>
                Services <Chevron open={openDropdown === "services"} />
              </button>
              <AnimatePresence>
                {openDropdown === "services" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-100 overflow-hidden p-2"
                  >
                    {SERVICES.map((s) => (
                      <Link
                        key={s.id}
                        href={`/services/${s.id}`}
                        onClick={closeMenuImmediately}
                        className="block px-4 py-3 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        {s.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cities Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => openMenu("cities")}
              onMouseLeave={closeMenuWithDelay}
            >
              <button className={`flex items-center ${navTextClass(pathname.includes("best-acting-drivers"))}`}>
                Cities <Chevron open={openDropdown === "cities"} />
              </button>
              <AnimatePresence>
                {openDropdown === "cities" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-100 overflow-hidden p-2"
                  >
                    {CITIES.map((c) => (
                      <Link
                        key={c.customerHref}
                        href={c.customerHref}
                        onClick={closeMenuImmediately}
                        className="block px-4 py-3 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

             {/* Driver Jobs Dropdown */}
             <div
              className="relative group"
              onMouseEnter={() => openMenu("driverJobs")}
              onMouseLeave={closeMenuWithDelay}
            >
              <button className={`flex items-center ${navTextClass(pathname.includes("car-driver-job"))}`}>
                Driver Jobs <Chevron open={openDropdown === "driverJobs"} />
              </button>
              <AnimatePresence>
                {openDropdown === "driverJobs" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-100 overflow-hidden p-2"
                  >
                    {CITIES.map((c) => (
                      <Link
                        key={c.driverHref}
                        href={c.driverHref}
                        onClick={closeMenuImmediately}
                        className="block px-4 py-3 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="tel:+9104428287777"
              className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                isTransparent
                  ? "bg-white/10 text-white hover:bg-white/20 border border-white/30"
                  : "bg-blue-50 text-blue-600 hover:bg-blue-100"
              }`}
            >
              <PhoneIcon fontSize="small" />
              <span>Call Us</span>
            </Link>

            {loggedUser ? (
              <HeaderControls
                user={loggedUser}
                displayName={(loggedUser as any)?.firstname || "Traveller"}
                isTransparent={isTransparent}
              />
            ) : (
              <Link
                href="/login"
                className={`px-5 py-2 rounded-full text-sm font-semibold shadow-lg transition-transform hover:scale-105 active:scale-95 ${
                  isTransparent
                    ? "bg-white text-[#354B9C]"
                    : "bg-[#354B9C] text-white"
                }`}
              >
                Sign In
              </Link>
            )}

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-md ${
                isTransparent ? "text-white" : "text-gray-800"
              }`}
            >
              <span className="sr-only">Open menu</span>
              <div className="space-y-1.5">
                <span className={`block w-6 h-0.5 bg-current transition-transform ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
                <span className={`block w-6 h-0.5 bg-current transition-opacity ${mobileMenuOpen ? "opacity-0" : ""}`} />
                <span className={`block w-6 h-0.5 bg-current transition-transform ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-white lg:hidden flex flex-col"
          >
            <div className="p-4 flex justify-between items-center border-b border-gray-100">
              <span className="text-xl font-bold text-[#354B9C]">{APP_CONFIG.name}</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
              >
                ✕
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <div className="space-y-4">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-lg font-medium text-gray-800"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Services</h3>
                <div className="space-y-3 pl-2">
                  {SERVICES.map((s) => (
                    <Link
                      key={s.id}
                      href={`/services/${s.id}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-gray-600"
                    >
                      {s.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Cities</h3>
                <div className="grid grid-cols-2 gap-3">
                  {CITIES.map((c) => (
                    <Link
                      key={c.customerHref}
                      href={c.customerHref}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm text-gray-600 bg-gray-50 p-2 rounded-lg text-center"
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50">
              {!loggedUser && (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-3 bg-[#354B9C] text-white text-center rounded-xl font-semibold shadow-lg mb-3"
                >
                  Sign In
                </Link>
              )}
              <a
                href="tel:+9104428287777"
                className="block w-full py-3 bg-white border border-gray-200 text-gray-700 text-center rounded-xl font-semibold"
              >
                Call Support
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
