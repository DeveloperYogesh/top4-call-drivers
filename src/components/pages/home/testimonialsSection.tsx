import React from 'react';

interface Testimonial {
  name: string;
  text: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Mona George',
    text: 'My husband always trusts Top4 drivers when I have to drive in a matter of minutes.',
  },
  {
    name: 'Shyam',
    text: 'Had a business meeting at Holiday Inn a few weeks ago around the traffic. Top4 drivers came to my rescue and added time. All thanks to Top4 Drivers.',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="bg-white py-12">
      <div className="custom-container">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-900">Customer Testimonials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">{testimonial.text}</p>
              <p className="text-sm font-semibold text-gray-900">{testimonial.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}