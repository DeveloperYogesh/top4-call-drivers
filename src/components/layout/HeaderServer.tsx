// src/components/layout/HeaderServer.tsx
import React from "react";
import HeaderClient from "./HeaderClient";

export default function HeaderServer() {
  // Only pass serializable props (serverUser must be serializable)
  return <HeaderClient  />;
}
