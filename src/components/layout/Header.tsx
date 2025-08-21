// components/HeaderServer.tsx
import Link from 'next/link';
import { ROUTES, APP_CONFIG } from '@/utils/constants';

type Props = {
  currentPath?: string; // optional, pass from server layout to highlight active link
};

const NAV_ITEMS = [
  { label: 'Home', href: ROUTES.HOME },
  { label: 'Services', href: ROUTES.SERVICES },
  { label: 'For Business', href: ROUTES.BUSINESS },
  { label: 'About Us', href: ROUTES.ABOUT },
];

// Cities to include under "Cities" menu
const CITIES = [
  { label: 'Tirupur', href: '/call-drivers-in-tirupur' },
  { label: 'Chennai', href: '/call-drivers-in-chennai' },
  { label: 'Trichy', href: '/call-drivers-in-trichy' },
  { label: 'Madurai', href: '/call-drivers-in-madurai' },
  { label: 'Coimbatore', href: '/call-drivers-in-coimbatore' },
];

export default function HeaderServer({ currentPath }: Props) {
  return (
    <header className="sticky top-0 z-50 bg-white my-border border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 h-16">
          {/* Brand / Logo */}
          <div className="flex-shrink-0">
            <Link href={ROUTES.HOME} aria-label={`${APP_CONFIG.name} home`} className="inline-flex items-center">
              <span className="text-lg font-extrabold text-blue-600">{APP_CONFIG.name}</span>
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex md:flex-1 md:items-center md:justify-start gap-6" aria-label="Primary navigation">
            {NAV_ITEMS.map((item) => {
              const isActive = currentPath ? currentPath === item.href : false;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-2 py-1 rounded-md font-semibold transition-colors ${
                    isActive ? 'text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Cities dropdown using details/summary (accessible, no JS) */}
            <details className="relative group">
              <summary
                className="list-none px-2 py-1 rounded-md font-semibold cursor-pointer text-gray-700 hover:bg-gray-100"
                aria-haspopup="true"
              >
                Cities
              </summary>

              {/* Dropdown panel */}
              <div className="absolute left-0 mt-2 w-56 bg-white my-border border rounded-md shadow-lg z-40">
                <ul className="p-2">
                  {CITIES.map((c) => {
                    const isActive = currentPath ? currentPath === c.href : false;
                    return (
                      <li key={c.href}>
                        <Link
                          href={c.href}
                          className={`block px-3 py-2 rounded-md text-sm font-medium ${
                            isActive ? 'text-blue-600' : 'text-gray-800 hover:bg-gray-100'
                          }`}
                          aria-current={isActive ? 'page' : undefined}
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
            {/* CTA anchor styled like MUI button but server-only */}
            <Link
              href={ROUTES.DOWNLOAD}
              className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-md bg-blue-600 text-white font-bold hover:opacity-95"
              aria-label="Download App"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="inline-block">
                <path d="M12 3v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 11l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 21H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Download App</span>
            </Link>

            {/* Mobile hamburger (pure CSS, server-rendered) */}
            <div className="md:hidden">
              <input id="nav-toggle" type="checkbox" className="peer hidden" aria-hidden="true" />
              <label
                htmlFor="nav-toggle"
                className="inline-flex items-center justify-center h-10 w-10 rounded-md text-gray-700 hover:bg-gray-100"
                aria-label="Open menu"
                role="button"
              >
                <span className="block w-5 h-0.5 bg-current relative before:content-[''] before:block before:w-5 before:h-0.5 before:bg-current before:absolute before:-top-1.5 after:content-[''] after:block after:w-5 after:h-0.5 after:bg-current after:absolute after:top-1.5" />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile drawer - controlled by checkbox peer (Tailwind peer-checked required) */}
      <aside
        className="peer-checked:translate-x-0 transform translate-x-full transition-transform fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-lg z-50"
        role="dialog"
        aria-label="Mobile menu"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <Link href={ROUTES.HOME} className="text-lg font-extrabold text-blue-600" aria-label={`${APP_CONFIG.name} home`}>
            {APP_CONFIG.name}
          </Link>
          <label htmlFor="nav-toggle" className="p-2 text-gray-700 hover:bg-gray-100 rounded-md" aria-label="Close menu" role="button">
            ✕
          </label>
        </div>

        <nav className="px-4 py-6">
          <ul className="flex flex-col gap-3">
            {NAV_ITEMS.map((item) => {
              const isActive = currentPath ? currentPath === item.href : false;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block px-3 py-2 rounded-md font-semibold ${isActive ? 'text-blue-600' : 'text-gray-800 hover:bg-gray-100'}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}

            {/* Mobile cities section */}
            <li>
              <div className="mt-2 my-border border-t pt-3">
                <p className="text-sm font-medium text-gray-500 mb-2">Cities</p>
                <ul className="flex flex-col gap-1">
                  {CITIES.map((c) => {
                    const isActive = currentPath ? currentPath === c.href : false;
                    return (
                      <li key={c.href}>
                        <Link
                          href={c.href}
                          className={`block px-3 py-2 rounded-md font-semibold ${isActive ? 'text-blue-600' : 'text-gray-800 hover:bg-gray-100'}`}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          {c.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </li>

            <li className="mt-3">
              <Link
                href={ROUTES.DOWNLOAD}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white font-bold"
                aria-label="Download App"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 3v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 11l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 21H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Download App</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Backdrop */}
      <label
        htmlFor="nav-toggle"
        className="peer-checked:block hidden fixed inset-0 bg-black bg-opacity-40 z-40"
        aria-hidden="true"
      />
    </header>
  );
}
