import { APP_CONFIG } from "@/utils/constants";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// Function to search for places using Google Places API
export async function searchPlaces(query: string) {
  console.log("searchPlaces called with query:", query);
  if (!GOOGLE_API_KEY) {
    console.error("Google API key is not configured.");
    // Return mock data for development
    const mockData = [
      {
        place_id: "mock_1",
        description: `${query} Airport, Chennai, Tamil Nadu, India`,
        structured_formatting: {
          main_text: `${query} Airport`,
          secondary_text: "Chennai, Tamil Nadu, India"
        }
      },
      {
        place_id: "mock_2", 
        description: `${query} Railway Station, Chennai, Tamil Nadu, India`,
        structured_formatting: {
          main_text: `${query} Railway Station`,
          secondary_text: "Chennai, Tamil Nadu, India"
        }
      },
      {
        place_id: "mock_3",
        description: `${query} Bus Stand, Chennai, Tamil Nadu, India`,
        structured_formatting: {
          main_text: `${query} Bus Stand`,
          secondary_text: "Chennai, Tamil Nadu, India"
        }
      }
    ];
    console.log("Returning mock data:", mockData);
    return mockData;
  }

  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=${GOOGLE_API_KEY}&components=country:in`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.predictions;
  } catch (error) {
    console.error("Error fetching places:", error);
    return [];
  }
}

// Function to get place details
export async function getPlaceDetails(placeId: string) {
  if (!GOOGLE_API_KEY) {
    console.error("Google API key is not configured.");
    return null;
  }

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Error fetching place details:", error);
    return null;
  }
}


