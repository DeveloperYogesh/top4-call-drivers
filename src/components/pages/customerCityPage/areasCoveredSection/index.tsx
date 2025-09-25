import { CityData } from "@/types";
import { LocationOn } from "@mui/icons-material";

interface AreasCoveredSectionProps {
  cityData: CityData;
}

export default function AreasCoveredSection({ cityData }: AreasCoveredSectionProps) {

  return (
    <section>
       <div className="bg-[#354B9C]">
        <div className="custom-container">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">
              Areas We Cover in {cityData.name}
            </h2>
            <p className="text-lg text-white max-w-2xl mx-auto">
              Our professional drivers are available across all major areas in{" "}
              {cityData.name}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {cityData.areas.map((area, index) => (
              <div
                key={index}
                className="p-4 text-center text-white rounded-lg cursor-pointer my-border hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center gap-1">
                  <LocationOn className="text-lg" />
                  <p className="font-medium">{area}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
