'use client';

import React from 'react';
import PhoneIcon from '@mui/icons-material/Phone';
import GetAppIcon from '@mui/icons-material/GetApp';
import { APP_CONFIG, ROUTES } from '@/utils/constants';

const StickyCTA: React.FC = () => {
  // Function to track call button clicks in GA4
  const handleCallClick = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'call_now_click', {
        event_category: 'engagement',
        event_label: 'Sticky Footer Call Button',
        phone_number: APP_CONFIG.primaryPhone,
      });
    }
  };

  // Function to track app download clicks in GA4
  const handleDownloadClick = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'download_app_click', {
        event_category: 'engagement',
        event_label: 'Sticky Footer Download Button',
        destination: 'Play Store',
      });
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="shadow-lg">
        <div className="flex text-center w-full h-full">
          <a
            href={`tel:${APP_CONFIG.primaryPhone}`}
            title={`Call ${APP_CONFIG.name} Now`}
            className="flex items-center py-4 px-4 text-white bg-[#354B9C] text-sm font-semibold w-full transition-colors"
            onClick={handleCallClick}
          >
            <span className="flex items-center gap-2 w-fit mx-auto my-auto">
              <PhoneIcon fontSize="small" />
              <span>Call Now</span>
            </span>
          </a>
          <a
            href={ROUTES.DOWNLOAD}
            target="_blank"
            rel="noopener noreferrer"
            title="Download TOP4 Call Drivers App"
            className="flex items-center py-4 gap-2 px-4 text-white bg-[#354B9C] text-sm font-semibold border-l border-white w-full transition-colors"
            onClick={handleDownloadClick}
          >
            <span className="flex items-center gap-2 w-fit mx-auto my-auto">
              <GetAppIcon fontSize="small" />
              <span>Download App</span>
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default StickyCTA;