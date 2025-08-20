'use client';

import React from 'react';
import { Button } from '@mui/material';

export default function SkipToContent() {
  const skipToMain = () => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView();
    }
  };

  return (
    <Button
      onClick={skipToMain}
      sx={{
        position: 'absolute',
        top: -40,
        left: 8,
        zIndex: 9999,
        backgroundColor: 'primary.main',
        color: 'white',
        px: 2,
        py: 1,
        fontSize: '0.875rem',
        fontWeight: 600,
        borderRadius: 1,
        '&:focus': {
          top: 8,
        },
        '&:hover': {
          backgroundColor: 'primary.dark',
        },
      }}
      onFocus={(e) => {
        e.currentTarget.style.top = '8px';
      }}
      onBlur={(e) => {
        e.currentTarget.style.top = '-40px';
      }}
    >
      Skip to main content
    </Button>
  );
}

