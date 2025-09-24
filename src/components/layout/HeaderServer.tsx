// src/components/layout/HeaderServer.tsx
import React from "react";
import { getCurrentUser, type AuthUser } from "@/lib/auth";
import HeaderClient from "./HeaderClient";

export default async function HeaderServer() {
  const user: AuthUser | null = await getCurrentUser();

  // Only pass serializable props (serverUser must be serializable)
  return <HeaderClient serverUser={user} />;
}
