"use client";

import React from "react";
import Button, { ButtonProps } from "@mui/material/Button";
import Link from "next/link";

interface TrackableButtonProps extends ButtonProps {
  href?: string;
  trackingLabel?: string;
}

export default function TrackableButton({
  href,
  trackingLabel,
  children,
  ...props
}: TrackableButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (trackingLabel) {
      console.log("Tracked click:", trackingLabel);
      // here you could send event to Google Analytics, Mixpanel, etc.
    }

    if (props.onClick) {
      props.onClick(e);
    }
  };

  if (href) {
    return (
      <Button
        component={Link}
        href={href}
        {...props}
        onClick={handleClick}
      >
        {children}
      </Button>
    );
  }

  return (
    <Button {...props} onClick={handleClick}>
      {children}
    </Button>
  );
}
