"use client";

import React, { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type"; // Assuming you have installed split-type

gsap.registerPlugin(ScrollTrigger);

const TextReveal = () => {
  useEffect(() => {
    const splitTypes = document.querySelectorAll(
      ".reveal-type"
    ) as NodeListOf<HTMLElement>;

    splitTypes.forEach((char) => {
      // First, split by words and characters
      const text = new SplitType(char, { types: "words,chars" });

      // Ensure the CSS prevents word breaks in the middle
      gsap.fromTo(
        text.chars,
        { opacity: 0.2 }, // Starting opacity
        {
          opacity: 1, // Target opacity
          duration: 0.3,
          stagger: 0.02,
          scrollTrigger: {
            trigger: char,
            start: "top 80%",
            end: "top 10%",
            scrub: true,
            toggleActions: "play play reverse reverse",
          },
        }
      );
    });
  }, []);

  return (
    <section className="">
      <div className="">
        <h2 className="reveal-type text-center my-auto max-w-3xl mx-auto text-5xl md:text-6xl mb-6 leading-tight md:leading-tight lg:leading-tight font-medium">
          Book Verified and Experienced Call Drivers Anytime for a Safe,
          Comfortable, and Hassle-Free Ride 24/7
        </h2>
      </div>
    </section>
  );
};

export default TextReveal;
