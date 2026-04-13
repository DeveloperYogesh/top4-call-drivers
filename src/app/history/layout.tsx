import React from "react";
import type { Metadata } from "next";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "My Bookings - Trip History",
  description: "View your booking history and past trips with TOP4 Call Drivers.",
  noIndex: true,
  url: "/history",
});

export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
