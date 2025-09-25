import Faq from "@/components/common/faq";
import React from "react";

export default function TariffPageCotainer() {
  return (
    <section className="parah-content">
      <div className="custom-container max-w-[1200px]!">
        <h1 className="text-center">
          TOP4 Call Drivers Tariff List
        </h1>
        <p>
          Looking for reliable call driver rates with flexible driver charges per
          day? TOP4 is your go-to solution, offering a wide range of options
          tailored to your travel needs, whether it's local city commutes,
          outstation trips, or valet parking. With transparent pricing and no
          hidden charges, TOP4 Call Drivers tariff ensures you get excellent value
          for your money.
        </p>

        {/* In-City Tariff */}
        <h2>
          In-City Call Driver Rates for Normal and Luxury Cars
        </h2>
        <p style={{ marginBottom: "16px" }}>
          Enjoy exceptional service at an affordable rate for your everyday in-city travel with our normal car services. For a more premium experience, opt for our luxury car services, which include enhanced comfort and amenities.
        </p>

        <h3 style={{ fontSize: "20px", fontWeight: "600", marginTop: "16px" }}>
          INCITY TARIFF (Normal Cars)
        </h3>
        <div style={{ marginBottom: "24px", overflowX: "auto" }}>
          <table className="tariff-table">
            <thead>
              <tr>
                <th colSpan={2}>Schedule</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="header-cell">Minimum 3 Hours</td>
                <td>₹350</td>
              </tr>
              <tr>
                <td className="header-cell">Extra Per Hour</td>
                <td>₹70</td>
              </tr>
              <tr>
                <td className="header-cell">Night Charges (10:15 PM – 5:30 AM)</td>
                <td>₹100 / Extra</td>
              </tr>
              <tr>
                <td className="header-cell">Drop Charge Minimum (5KM)</td>
                <td>₹50/100</td>
              </tr>
              <tr>
                <td className="header-cell">Out of City Charge (More than 40 kms)</td>
                <td>₹100</td>
              </tr>
              <tr>
                <td className="header-cell">Cancel Charge (before 30min inform)</td>
                <td>₹100</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 style={{ fontSize: "20px", fontWeight: "600", marginTop: "16px" }}>
          INCITY TARIFF (Luxury Cars)
        </h3>
        <div style={{ marginBottom: "24px", overflowX: "auto" }}>
          <table className="tariff-table">
            <thead>
              <tr>
                <th colSpan={2}>Schedule</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="header-cell">Minimum 3 Hours</td>
                <td>₹400</td>
              </tr>
              <tr>
                <td className="header-cell">Extra Per Hour</td>
                <td>₹70</td>
              </tr>
              <tr>
                <td className="header-cell">Night Charges (10:15 PM – 5:30 AM)</td>
                <td>₹100 / Extra</td>
              </tr>
              <tr>
                <td className="header-cell">Drop Charge Minimum (5KM)</td>
                <td>₹50/100</td>
              </tr>
              <tr>
                <td className="header-cell">Out of City Charge (More than 40 kms)</td>
                <td>₹100</td>
              </tr>
              <tr>
                <td className="header-cell">Cancel Charge</td>
                <td>₹100</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Outstation Tariff */}
        <h2>
          Driver Charges Per Day for Outstation Trips
        </h2>
        <p style={{ marginBottom: "16px" }}>
          Whether you're traveling for business or leisure, our competitive driver charges per day cover both one-way and return trips, making your long-distance travel hassle-free.
        </p>

        <h3 style={{ fontSize: "20px", fontWeight: "600", marginTop: "16px" }}>
          OUTSTATION Return Trip
        </h3>
        <div style={{ marginBottom: "24px", overflowX: "auto" }}>
          <table className="tariff-table">
            <thead>
              <tr>
                <th colSpan={2}>Schedule</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="header-cell">Per Day (12hrs)</td>
                <td>₹1100 + Accommodation</td>
              </tr>
              <tr>
                <td className="header-cell">Extra Per Hour</td>
                <td>₹60</td>
              </tr>
              <tr>
                <td className="header-cell">Cancel Charge</td>
                <td>₹100</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 style={{ fontSize: "20px", fontWeight: "600", marginTop: "16px" }}>
          OUTSTATION One - Way Trip
        </h3>
        <div style={{ marginBottom: "24px", overflowX: "auto" }}>
          <table className="tariff-table">
            <thead>
              <tr>
                <th colSpan={2}>Schedule</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="header-cell">Minimum 250 Km</td>
                <td>₹1600 (Including Bus Fare)</td>
              </tr>
              <tr>
                <td className="header-cell">Cancel Charge</td>
                <td>₹100</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Valet Parking Charges */}
        <h2>
          Valet Parking Charges
        </h2>
        <p style={{ marginBottom: "16px" }}>
          For events or special occasions, we provide trained call drivers to manage valet parking with efficiency and care.
        </p>
        <div style={{ marginBottom: "24px", overflowX: "auto" }}>
          <table className="tariff-table">
            <thead>
              <tr>
                <th colSpan={2}>Schedule</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="header-cell">Per Driver</td>
                <td>₹500</td>
              </tr>
              <tr>
                <td className="header-cell">Minimum Hours</td>
                <td>5</td>
              </tr>
              <tr>
                <td className="header-cell">Extra Per Hour</td>
                <td>₹100</td>
              </tr>
              <tr>
                <td className="header-cell">For every Ten Drivers - One Supervisor is Must</td>
                <td>₹700</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Monthly Tariff Plans */}
        <h2>
          Monthly Call Driver Tariff Plans
        </h2>
        <p style={{ marginBottom: "16px" }}>
          Need a regular driver? Our convenient monthly plans are tailored to meet your long-term requirements, ensuring consistent and reliable service.
        </p>
        <div style={{ marginBottom: "24px", overflowX: "auto" }}>
          <table className="tariff-table">
            <thead>
              <tr>
                <th colSpan={2}>Schedule</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="header-cell">Normal - ₹18000 / (10 Hrs)</td>
                <td>Extra Hrs - ₹50</td>
              </tr>
              <tr>
                <td className="header-cell">Normal - ₹20000 / (12 Hrs)</td>
                <td>Extra Hrs - ₹50</td>
              </tr>
              <tr>
                <td className="header-cell">Luxury - ₹22000 / (10 Hrs)</td>
                <td>Extra Hrs - ₹60</td>
              </tr>
              <tr>
                <td className="header-cell">Luxury - ₹24000 / (12 Hrs)</td>
                <td>Extra Hrs - ₹60</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Benefits */}
        <h2>
          Benefits of Hiring Experienced Call Drivers with TOP4
        </h2>
        <ul style={{ listStyleType: "decimal", paddingLeft: "20px", marginBottom: "24px" }}>
          <li>Professional and Reliable Drivers – Skilled, trained, and licensed drivers ensuring safe and smooth journeys.</li>
          <li>Transparent and Flexible Rates – No hidden fees, with multiple plans for every need.</li>
          <li>Easy and Convenient Booking – Book via app or website with real-time updates.</li>
          <li>Customized Travel Options – Standard cars, luxury rides, valet services for events.</li>
          <li>Exceptional Value and Support – Affordable rates and top-notch service.</li>
        </ul>

        {/* FAQs */}
        
      </div>
    </section>
  );
}