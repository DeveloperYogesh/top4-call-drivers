import { APP_CONFIG } from "@/utils/constants";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// Function to search for places using Google Places API
export async function searchPlaces(query: string) {
  console.log("searchPlaces called with query:", query);
  // Fallback key found in codebase (api/autocomplete/route.ts)
  const apiKey = GOOGLE_API_KEY || "AIzaSyAM0HnAYNWLBOfjVZWkHeb785e3AQPEhM8";

  if (!apiKey) {
    console.error("Google API key is not configured.");
    return [];
  }

  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=${apiKey}&components=country:in`;

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
  // Fallback key found in codebase (api/autocomplete/route.ts)
  const apiKey = GOOGLE_API_KEY || "AIzaSyAM0HnAYNWLBOfjVZWkHeb785e3AQPEhM8";

  if (!apiKey) {
    console.error("Google API key is not configured.");
    return null;
  }

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Error fetching place details:", error);
    return null;
  }
}


