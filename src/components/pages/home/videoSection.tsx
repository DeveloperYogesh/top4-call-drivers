import { Chip } from "@mui/material";
import React from "react";

export default function VideoSection() {
  return (
    <section className="bg-white">
      <div className="custom-container">
        <div className="text-center">
          <Chip
            label="Best Acting Drivers"
            variant="outlined"
            className="mb-4"
          />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Join Our Team of Professional Drivers
          </h2>
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto text-sm md:text-base">
            We’re looking for skilled, responsible, and experienced drivers. Enjoy flexible working hours,
            steady income, and a trusted platform that values your service.
          </p>
          <div className="mt-5 md:mt-10">
            <iframe
              width="1260"
              height="615"
              className="rounded-xl w-full h-[615px] lg:h-[615px] max-w-5xl mx-auto"
              src="https://www.youtube.com/embed/MSrrfZiCqQU?si=xdjUALvTqS-kbLSW"
              title="FastTrack Call Taxi - YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              frameBorder="0"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
