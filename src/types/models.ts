export type FlatPrice = string | number;
export type FlatSize = string | number;

export interface FlatBase {
  about: string;
  price: FlatPrice;
  size: FlatSize;
  address: string;
  url: string;
}

export interface Flat extends FlatBase {
  applied: boolean;
  latitude: number | null;
  longitude: number | null;
}

export interface FlatMarker extends FlatBase {
  applied: boolean;
  latitude: number;
  longitude: number;
}
