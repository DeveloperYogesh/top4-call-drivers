import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import ThemeProvider from '@/components/common/ThemeProvider';
import AccessibilityProvider from '@/components/common/AccessibilityProvider';
import SkipToContent from '@/components/common/SkipToContent';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});


export const metadata: Metadata = generateSEOMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <AccessibilityProvider>
          <ThemeProvider>
            <div className="min-h-screen flex flex-col">
              <SkipToContent />
              <Header />
              <main id="main-content" className="flex-1" tabIndex={-1}>
                {children}
              </main>
              <Footer />
            </div>
          </ThemeProvider>
        </AccessibilityProvider>
      </body>
    </html>
  );
}

