import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/common/ThemeProvider";
import AccessibilityProvider from "@/components/common/AccessibilityProvider";
import Footer from "@/components/layout/Footer";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import HeaderServer from "@/components/layout/HeaderServer";
import Script from "next/script";
import StickyCTA from "@/components/layout/stickyFooter";

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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-B5GWQYKD87"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-B5GWQYKD87');
          `}
        </Script>
        <AccessibilityProvider>
          <ThemeProvider>
            <div className="min-h-screen flex flex-col">
              {/* <SkipToContent /> */}
              <HeaderServer />
              <main
                id="main-content"
                className="flex-1 pt-[64px]"
                tabIndex={-1}
              >
                {children}
              </main>
              <StickyCTA />
              <Footer />
            </div>
          </ThemeProvider>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
