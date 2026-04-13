import React from "react";
import type { Metadata } from "next";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "My Profile",
  description: "Manage your TOP4 Call Drivers profile, vehicle preferences, and account settings.",
  noIndex: true,
  url: "/profile",
});

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
