import React from 'react';
import { Phone, Email, LocationOn, Facebook, Twitter, Instagram } from '@mui/icons-material';

export default function ContactSection() {
  return (
    <footer className="bg-blue-600 text-white py-8">
      <div className="custom-container text-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Online Booking</h3>
            <ul className="text-sm">
              <li><Phone /> +91-XXXX-XXXXXX</li>
              <li><Email /> info@top4drivers.com</li>
              <li><LocationOn /> Chennai, Tamilnadu, India</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Our Services</h3>
            <ul className="text-sm">
              <li>Airports/Railway Stations</li>
              <li>Local / Outstations</li>
              <li>Home / Office</li>
              <li>Personal Appointment</li>
              <li>Valet / Tours / Anywhere</li>
            </ul>
          </div>
        </div>
        <div className="mt-6 flex justify-center gap-4">
          <Facebook />
          <Twitter />
          <Instagram />
        </div>
        <p className="text-sm mt-4">Copyright © 2022 Powered by FCPL. All Rights Reserved.</p>
      </div>
    </footer>
  );
}