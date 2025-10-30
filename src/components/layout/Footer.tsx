import {
  APP_CONFIG,
  ROUTES,
  SOCIAL_LINKS,
  APP_STORE_LINKS,
  CITIES,
} from "@/utils/constants";
import {
  EmailOutlined,
  Facebook,
  LocationOn,
  Phone,
  Twitter,
} from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Company Info & Contact - First Column */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <Link
                href={ROUTES.HOME}
                aria-label={`${APP_CONFIG.name} home`}
                className="inline-flex items-center"
              >
                <Image
                  width="47"
                  height="47"
                  src="/images/top4-call-drivers-logo.png"
                  className="mr-2"
                  alt={APP_CONFIG.name}
                />
                <span className={`text-lg font-semibold text-white`}>
                  {APP_CONFIG.name}
                </span>
              </Link>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <a
                  href="tel:04428287777"
                  className="text-gray-300 hover:text-white"
                >
                  044-28287777
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <a
                  href="tel:+918190081900"
                  className="text-gray-300 hover:text-white"
                >
                  8190081900
                </a>
              </div>

              <div className="flex items-center gap-3">
                <EmailOutlined className="w-4 h-4 text-gray-400" />
                <a
                  href="mailto:info@example.com"
                  className="text-gray-300 hover:text-white"
                >
                  top4calldriverservices@gmail.com
                </a>
              </div>

              <div className="flex items-center gap-3">
                <LocationOn className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">
                  No: 26 Jayalakshmipuram, 3rd Street, Nungambakkam, Chennai -
                  600034.
                </span>
              </div>
            </div>
          </div>

          {/* Online Booking */}
          <div>
            <h4 className="text-white font-semibold mb-3">ONLINE BOOKING</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Hourly Basis</li>
              <li>Monthly Basis</li>
              <li>Valet Parking</li>
              <li>Outstation</li>
              <li>Distance Calculator</li>
              <li>User Login</li>
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h4 className="text-white font-semibold mb-3">OUR SERVICES</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Airports / Railway Stations</li>
              <li>Local / Our Stations</li>
              <li>Home / Office</li>
              <li>Personal Appointment</li>
              <li>Well Trained Drivers</li>
              <li>Tours / Anywheres!</li>
            </ul>
          </div>

          {/* Branches & Social */}
          <div>
            <h4 className="text-white font-semibold mb-3">BRANCHES</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link
                  href="/best-acting-drivers-in-chennai"
                  title="Best Acting Drivers in Chennai - TOP4 Call Drivers"
                  className="hover:text-white transition-colors"
                >
                  Chennai 044-28287777
                </Link>
              </li>
              <li>Trichy 0431-2791779</li>
              <li>
                <Link
                  href="/best-acting-drivers-in-coimbatore"
                  title="Best Acting Drivers in Coimbatore - TOP4 Call Drivers"
                  className="hover:text-white transition-colors"
                >
                  Coimbatore 7418922002
                </Link>
              </li>
              <li>
                <Link
                  href="/best-acting-drivers-in-madurai"
                  title="Best Acting Drivers in Madurai - TOP4 Call Drivers"
                  className="hover:text-white transition-colors"
                >
                  Madurai 7338878427
                </Link>
              </li>
              <li>
                <Link
                  href="/best-acting-drivers-in-tiruppur"
                  title="Best Acting Drivers in Tiruppur - TOP4 Call Drivers"
                  className="hover:text-white transition-colors"
                >
                  Tiruppur 7418922002
                </Link>
              </li>
            </ul>

            {/* Social Icons */}
            {/* <div className="mt-6">
              <h4 className="text-white font-semibold mb-3">FOLLOW US</h4>
              <div className="flex gap-3">
                <a
                  href={SOCIAL_LINKS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="text-white text-lg" />
                </a>
                <a
                  href={SOCIAL_LINKS.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="text-white text-lg" />
                </a>
                <a
                  href={SOCIAL_LINKS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors"
                  aria-label="LinkedIn"
                >
                  <LinkedIn className="text-white text-lg" />
                </a>
              </div>
            </div> */}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8" />

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p className="text-gray-400">
            © {new Date().getFullYear()} {APP_CONFIG.name}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              href={ROUTES.TERMS}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Terms & Conditions
            </Link>
            <Link
              href={ROUTES.PRIVACY}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href={ROUTES.REFUND}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
