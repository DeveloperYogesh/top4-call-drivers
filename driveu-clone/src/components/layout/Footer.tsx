import {
  APP_CONFIG,
  ROUTES,
  SOCIAL_LINKS,
  APP_STORE_LINKS,
  CITIES,
} from "@/utils/constants";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-bold mb-2">{APP_CONFIG.name}</h2>
            <p className="text-gray-300 mb-2 text-sm">
              {APP_CONFIG.description}
            </p>
            <p className="text-gray-300 text-sm">Simplify Car Ownership</p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Services</h3>
            <ul className="flex flex-col gap-1 text-sm">
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Professional Drivers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Car Wash
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  FASTag Recharge
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Car Maintenance
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Car Insurance
                </a>
              </li>
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Cities</h3>
            <ul className="flex flex-col gap-1 text-sm">
              {CITIES.slice(0, 5).map((city) => (
                <li key={city.id}>
                  <a
                    href={ROUTES.CITY_DRIVERS(city.slug)}
                    className="text-gray-300 hover:text-white"
                  >
                    {city.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Company</h3>
            <ul className="flex flex-col gap-1 text-sm">
              <li>
                <a
                  href={ROUTES.ABOUT}
                  className="text-gray-300 hover:text-white"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href={ROUTES.BUSINESS}
                  className="text-gray-300 hover:text-white"
                >
                  For Business
                </a>
              </li>
              <li>
                <a
                  href={ROUTES.CONTACT}
                  className="text-gray-300 hover:text-white"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href={ROUTES.BLOG}
                  className="text-gray-300 hover:text-white"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href={ROUTES.COMPARE}
                  className="text-gray-300 hover:text-white"
                >
                  Compare
                </a>
              </li>
            </ul>
          </div>

          {/* Download App */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-2">Download App</h3>
            <div className="flex flex-col gap-2 mb-3 text-sm">
              <a
                href={APP_STORE_LINKS.android}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-300 hover:text-white"
              >
                {/* Android SVG */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.6 9.48V4.5h-11.2v4.98H2.4v9.51h19.2V9.48h-4zM9 20.02v-3.5h6v3.5H9z" />
                </svg>
                Google Play
              </a>
              <a
                href={APP_STORE_LINKS.ios}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-300 hover:text-white"
              >
                {/* Apple SVG */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M16.365 1.43c0 1.14-.427 2.25-1.23 3.04-.785.77-2.02 1.36-3.194 1.27-.112-1.11.438-2.27 1.198-3.04.82-.83 2.264-1.42 3.226-1.27zM21 17.56c-.46 1.09-.997 2.17-1.61 3.23-.94 1.62-1.915 3.23-3.45 3.26-1.5.03-1.98-.95-3.69-.95-1.71 0-2.25.92-3.67.98-1.47.05-2.6-1.75-3.54-3.36C3.07 17.39 2 13.77 3.5 11.15c.96-1.65 2.68-2.69 4.54-2.72 1.42-.03 2.75.98 3.67.98.89 0 2.45-1.21 4.12-1.04.7.03 2.68.28 3.95 2.12-.1.06-2.36 1.38-2.34 4.11.01 3.28 2.88 4.36 2.88 4.36z" />
                </svg>
                App Store
              </a>
            </div>

            <p className="text-gray-300 text-sm mb-1">Follow Us</p>
            <div className="flex gap-2">
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12a10 10 0 10-11.6 9.9v-7h-2.1v-3h2.1V9.5c0-2 1.2-3.1 3-3.1.9 0 1.8.2 1.8.2v2h-1c-1 0-1.3.6-1.3 1.2V12h2.3l-.4 3h-1.9v7A10 10 0 0022 12z" />
                </svg>
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm0 2h10c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3zm5 2.8A5.2 5.2 0 0012 17.2 5.2 5.2 0 0017.2 12 5.2 5.2 0 0012 6.8zm0 2A3.2 3.2 0 1112 16a3.2 3.2 0 010-6.2zm5.8-2.9a1.1 1.1 0 110 2.2 1.1 1.1 0 010-2.2z" />
                </svg>
              </a>
              {/* Add similar SVGs for Twitter, LinkedIn, YouTube */}
            </div>
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
            <a href={ROUTES.TERMS} className="text-gray-400 hover:text-white">
              Terms & Conditions
            </a>
            <a href={ROUTES.PRIVACY} className="text-gray-400 hover:text-white">
              Privacy Policy
            </a>
            <a href={ROUTES.REFUND} className="text-gray-400 hover:text-white">
              Refund Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
