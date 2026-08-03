import LiteYouTubeEmbed from "@/components/ui/LiteYouTubeEmbed";

export default function VideoSection() {
  return (
    <section className="bg-white" aria-label="About TOP4 Call Drivers">
      <div className="custom-container">
        <div className="text-center">
          <span className="mb-4 inline-flex rounded-full border border-gray-200 px-4 py-1 text-sm font-semibold text-gray-600">
            Best Acting Drivers
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Why Choose TOP4 Call Drivers?
          </h2>
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto text-sm md:text-base">
            Verified, professional, and available 24/7 — our drivers ensure a safe, comfortable,
            and hassle-free ride every time you book with us.
          </p>
          <div className="mt-5 md:mt-10">
            <LiteYouTubeEmbed
              videoId="MSrrfZiCqQU"
              title="TOP4 Call Drivers — Professional Driver Service in Tamil Nadu"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
