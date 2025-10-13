"use client";

import React from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/common/ThemeProvider";
import AccessibilityProvider from "@/components/common/AccessibilityProvider";
import Footer from "@/components/layout/Footer";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import HeaderServer from "@/components/layout/HeaderServer";
import Script from "next/script";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

// ✅ Combine your SEO metadata and add Google verification
export const metadata: Metadata = {
  ...generateSEOMetadata(),
  verification: {
    google: "9W1_ISWbLi5d_DxXc6Y0quUMCoXYRHgxqp2NlrhHQk4",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        {/* ✅ Google Analytics */}
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
              <HeaderServer />
              <main
                id="main-content"
                className="flex-1 pt-[64px]"
                tabIndex={-1}
              >
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
