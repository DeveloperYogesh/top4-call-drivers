import { CityData } from "@/types";
import { DirectionsCar, Schedule, Security, Star } from "@mui/icons-material";

interface FeaturesSectionProps {
  cityData: CityData;
}

export default function FeaturesSection({ cityData }: FeaturesSectionProps) {

const features = [
  {
    icon: <Security color="primary" />,
    title: "Verified Drivers",
    description: "All drivers are background verified and licensed",
  },
  {
    icon: <Schedule color="primary" />,
    title: "24/7 Availability",
    description: "Book drivers anytime, anywhere in the city",
  },
  {
    icon: <Star color="primary" />,
    title: "Rated Drivers",
    description: "Choose from highly rated professional drivers",
  },
  {
    icon: <DirectionsCar color="primary" />,
    title: "All Vehicle Types",
    description: "Support for manual, automatic, and all car sizes",
  },
];

  return (
    <section>
      <div className="custom-container">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">
            Why Choose TOP4 Call Drivers in {cityData.name}?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the best driver hiring service with our professional and
            reliable drivers
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-4 mb-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 text-center bg-white rounded-lg my-border hover:shadow-md"
            >
              <div className="mb-2">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-1 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
