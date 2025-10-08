import React from 'react';

interface Reason {
  title: string;
  description: string;
}

const reasons: Reason[] = [
  {
    title: 'Hourly Drivers for Tourists',
    description: 'Your own pace to experience destination at anticipation of discovering hidden gems, immersing in local culture.',
  },
  {
    title: 'Secure Travel',
    description: 'Importance of hiring verified drivers for peace of mind on the road.',
  },
  {
    title: 'Reasons Why Hiring a Driver in Chennai',
    description: 'Combination more beneficial than a self-driven vehicle.',
  },
  {
    title: 'Role of Call Driver Services in Making Chennai Roads Safer',
    description: 'For safer roads and heavy traffic.',
  },
];

export default function WhyTop4Section() {
  return (
    <section className="bg-white py-12">
      <div className="custom-container">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-900">Why TOP4 Call Drivers?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reasons.map((reason, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-gray-900">{reason.title}</h3>
              <p className="text-sm text-gray-600">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}