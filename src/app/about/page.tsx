import React from "react";

export default function AboutPage() {
  const title = "About Us";
  const description =
    "Learn about our company, mission, and the team behind the service.";
  return (
    <>
      <section>
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p>
          To connect professional drivers with trustworthy customers, making
          travel and deliveries reliable and safe.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Why Choose Us</h2>
        <ul className="list-disc ml-5">
          <li>Verified drivers</li>
          <li>Competitive pricing</li>
          <li>24/7 customer support</li>
        </ul>
      </section>
    </>
  );
}
