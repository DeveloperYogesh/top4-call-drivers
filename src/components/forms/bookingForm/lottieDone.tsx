// File: components/booking/LottieDone.tsx
"use client";
import React from "react";
import dynamic from "next/dynamic";
import doneAnimation from "../../../../public/animations/Done.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function LottieDone() {
  return (
    <div style={{ width: 200, height: 200, marginTop: -4 }}>
      <Lottie animationData={doneAnimation} loop={false} />
    </div>
  );
}
