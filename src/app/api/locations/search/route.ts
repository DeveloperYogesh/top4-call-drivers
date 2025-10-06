// app/api/locations/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { searchPlaces } from "@/lib/google-places";
import { Location } from "@/types";

function normalizeLocations(list: Location[]) {
  return list.map((loc) => ({
    id: loc.id,
    name: loc.name,
    city: loc.city ?? "",
    state: loc.state ?? "",
    // keep coordinates undefined if not available
  }));
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    // accept both 'query' and 'q' (some clients use q)
    const rawQuery = searchParams.get("query") ?? searchParams.get("q") ?? "";

    // If no query provided, return an empty list (200) instead of 400
    if (!rawQuery || rawQuery.trim().length === 0) {
      return NextResponse.json({ status: "success", data: [] });
    }

    const query = String(rawQuery);

    try {
      const predictions = await searchPlaces(query);

      const locations: Location[] = predictions.map((prediction: any, index: number) => ({
        id: prediction.place_id || prediction.id || `place_${index}`,
        name: prediction.description || prediction.structured_formatting?.main_text || prediction.name || "",
        city: (prediction.structured_formatting?.secondary_text || "").split(",")[0]?.trim() || "",
        state: (prediction.structured_formatting?.secondary_text || "").split(",")[1]?.trim() || "",
        coordinates: undefined,
      }));

      return NextResponse.json({ status: "success", data: normalizeLocations(locations) });
    } catch (err) {
      console.error("Location search (google) error:", err);
      return NextResponse.json({ status: "error", message: "Failed to search for locations" }, { status: 500 });
    }
  } catch (err) {
    console.error("locations/search route unexpected error:", err);
    return NextResponse.json({ status: "error", message: "Internal server error" }, { status: 500 });
  }
}
