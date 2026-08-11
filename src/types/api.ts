import type { FlatBase } from "./models";

export interface FlatListResponse extends FlatBase {}

export interface GeoapifyCoordinatesResponse {
  features: Array<{
    geometry: {
      coordinates: [longitude: number, latitude: number];
    };
  }>;
}

export interface RefreshFlatsErrorResponse {
  success: false;
  message: string;
}

export type RefreshFlatsResult = true | RefreshFlatsErrorResponse;
export type FlatListApiResponse = FlatListResponse[];
