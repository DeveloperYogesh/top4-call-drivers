import {
  APP_CONFIG,
  ROUTES,
} from "@/utils/constants";
import {
  EmailOutlined,
  LocationOn,
  Phone,
} from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/common/FadeIn";

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-gray-300 pt-16 pb-8 mt-auto border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <FadeIn delay={0.1}>
            <div className="space-y-6">
              <Link href={ROUTES.HOME} className="flex items-center gap-3">
                <Image
                  width={50}
                  height={50}
                  src="/images/top4-call-drivers-logo.png"
                  alt={APP_CONFIG.name}
                  className="brightness-110"
                />
                <span className="text-xl font-bold text-white tracking-tight">
                  {APP_CONFIG.name}
                </span>
              </Link>
              <p className="text-sm leading-relaxed text-gray-400">
                Professional driver services at your doorstep. Safe, reliable, and 24/7 available for all your travel needs.
              </p>
              <div className="space-y-3">
                <a href="tel:04428287777" className="flex items-center gap-3 hover:text-blue-400 transition-colors">
                  <Phone fontSize="small" /> 044-28287777
                </a>
                <a href="mailto:top4calldriverservices@gmail.com" className="flex items-center gap-3 hover:text-blue-400 transition-colors">
                  <EmailOutlined fontSize="small" /> top4calldriverservices@gmail.com
                </a>
              </div>
            </div>
          </FadeIn>

          {/* Quick Links */}
          <FadeIn delay={0.2}>
            <h4 className="text-white font-semibold mb-6 text-lg">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href={ROUTES.ABOUT} className="hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link href={ROUTES.TARIFF} className="hover:text-blue-400 transition-colors">Tariff & Rates</Link></li>
              <li><Link href={ROUTES.BLOG} className="hover:text-blue-400 transition-colors">Blog</Link></li>
              <li><Link href={ROUTES.CONTACT} className="hover:text-blue-400 transition-colors">Contact Us</Link></li>
              <li><Link href="/login" className="hover:text-blue-400 transition-colors">Driver Login</Link></li>
            </ul>
          </FadeIn>

          {/* Services */}
          <FadeIn delay={0.3}>
            <h4 className="text-white font-semibold mb-6 text-lg">Our Services</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/services/driver-service" className="hover:text-blue-400 transition-colors">Acting Drivers</Link></li>
              <li><Link href="/services/valet-parking" className="hover:text-blue-400 transition-colors">Valet Parking</Link></li>
              <li><Link href="/services/outstation" className="hover:text-blue-400 transition-colors">Outstation Trips</Link></li>
              <li><Link href="/services/car-wash" className="hover:text-blue-400 transition-colors">Car Wash</Link></li>
              <li><Link href="/services/car-maintenance" className="hover:text-blue-400 transition-colors">Car Maintenance</Link></li>
            </ul>
          </FadeIn>

          {/* Locations */}
          <FadeIn delay={0.4}>
            <h4 className="text-white font-semibold mb-6 text-lg">Locations</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <LocationOn fontSize="small" className="mt-1 shrink-0 text-gray-500" />
                <span>No: 26 Jayalakshmipuram, 3rd Street, Nungambakkam, Chennai - 600034</span>
              </li>
              <li className="pt-2 border-t border-gray-800 mt-2">
                <span className="block text-gray-500 text-xs mb-1">Serving in:</span>
                <div className="flex flex-wrap gap-2">
                  {['Chennai', 'Trichy', 'Madurai', 'Coimbatore', 'Tiruppur'].map(city => (
                    <Link
                      key={city}
                      href={`/best-acting-drivers-in-${city.toLowerCase()}`}
                      className="bg-gray-800 px-2 py-1 rounded text-xs hover:bg-blue-600 hover:text-white transition-colors"
                    >
                      {city}
                    </Link>
                  ))}
                </div>
              </li>
            </ul>
          </FadeIn>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} {APP_CONFIG.name}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href={ROUTES.TERMS} className="hover:text-white transition-colors">Terms</Link>
            <Link href={ROUTES.PRIVACY} className="hover:text-white transition-colors">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
