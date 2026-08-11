import type { Flat, FlatBase, FlatListApiResponse, GeoapifyCoordinatesResponse, RefreshFlatsResult } from "../types";

const URL = "https://flat-service-w52m.onrender.com"; // process.env.BE_URL;
const GEOAPIFY_API_KEY = process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY;

function hasCoordinates(
  response: GeoapifyCoordinatesResponse,
): response is { features: [{ geometry: { coordinates: [number, number] } }] } {
  return Boolean(response.features[0]?.geometry?.coordinates);
}

export async function getFlats(): Promise<Flat[]> {
  try {
    const response = await fetch(URL + "/flats");
    const data: FlatListApiResponse = await response.json();
    const flats = await Promise.all(
      data.map(async (flat: FlatBase) => {
        const coordinates = await getCoordinates(flat.address);
        const longitude = coordinates?.[0] ?? null;
        const latitude = coordinates?.[1] ?? null;

        return {
          ...flat,
          applied: false,
          longitude,
          latitude,
        } satisfies Flat;
      }),
    );
    return flats;
  } catch (error) {
    console.log("this is an catched error", error);
    return [];
  }
}

export async function refreshFlats(): Promise<RefreshFlatsResult | undefined> {
  try {
    const response = await fetch(URL + "/refresh_flats");
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    const data = await response.text();
    if (data === "Refreshed") {
      return true;
    }
  } catch (error) {
    console.error("Error refreshing flats:", error);
    return { success: false, message: "Error refreshing flats" };
  }
}

export async function getCoordinates(
  adr: string,
): Promise<[number, number] | undefined> {
  try {
    if (!GEOAPIFY_API_KEY) {
      throw new Error("Missing EXPO_PUBLIC_GEOAPIFY_API_KEY");
    }
    const geoURL = "https://api.geoapify.com/v1/geocode/search?text=";
    const apiAdr = `apiKey=${GEOAPIFY_API_KEY}`;
    const response = await fetch(`${geoURL}${adr}&${apiAdr}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data: GeoapifyCoordinatesResponse = await response.json();
    if (hasCoordinates(data)) {
      return data.features[0].geometry.coordinates;
    }
  } catch (error) {
    console.log(error);
  }
}