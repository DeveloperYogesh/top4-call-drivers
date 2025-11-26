import React from "react";
import Image from "next/image";
import callTaxiImage from "../../../public/images/top4-call-drivers-hero-img.webp"

interface BlogCallToActionProps {
  title?: any;
  description?: any;
  buttonText?: any;
  imgUrl?: any;
  customCss?: any;
}

const BlogCallToAction = (props: BlogCallToActionProps) => {
  const { title, description, buttonText, imgUrl, customCss } = props;

  return (
    <div
      className={` lg:sticky lg:top-16 w-full my-5 border lg:max-w-md lg:mt-56 p-2  text-center rounded-2xl bg-ownPrimary text-white h-fit ${customCss}`}
    >
      <Image
        src={callTaxiImage}
        alt="FastTrack Call Taxi"
        width={800}
        height={300}
        className="w-full h-full object-cover rounded-xl"
      />
      <div className="p-2 2xl:p-4">
        <h5 className=" font-medium uppercase mb-3">
          {title || `Reliable & Affordable Cab Booking Services`}
        </h5>
        <p className="text-zinc-200 text-xs">
          {description ||
            `Book FastTrack call taxi for safe, affordable ride. 24/7 service for city, airport & outstation trips. From auto booking to luxury vehicle booking we got it all`}
        </p>
        <div className="md-button bg-white mx-auto w-fit inline-block mt-5 text-black px-3">
          <a
            href="/chennai"
            target="_blank"
            title="FastTrack Call Taxi - Book a taxi now"
          >
            {buttonText || `Book a trip`}
          </a>
        </div>
      </div>
    </div>
  );
};

export default BlogCallToAction;
