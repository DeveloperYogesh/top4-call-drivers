import LiteYouTubeEmbed from "@/components/ui/LiteYouTubeEmbed";

export default function VideoSection() {
  return (
    <section className="bg-white">
      <div className="custom-container">
        <div className="text-center">
          <span className="mb-4 inline-flex rounded-full border border-gray-200 px-4 py-1 text-sm font-semibold text-gray-600">
            Best Acting Drivers
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Join Our Team of Professional Drivers
          </h2>
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto text-sm md:text-base">
            We’re looking for skilled, responsible, and experienced drivers. Enjoy flexible working hours,
            steady income, and a trusted platform that values your service.
          </p>
          <div className="mt-5 md:mt-10">
            <LiteYouTubeEmbed
              videoId="MSrrfZiCqQU"
              title="FastTrack Call Taxi - YouTube video"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
