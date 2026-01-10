import type { TUser } from "./auth";

export type TLocationInfo = {
  as: string;
  isp: string;
  lat: number;
  lon: number;
  org: string;
  zip: string;
  city: string;
  query: string;
  region: string;
  status: string;
  country: string;
  timezone: string;
  regionName: string;
  countryCode: string;
};

export type TLocation = {
  id: string;
  userID: string;
  info: string; // Base64 encoded string
  createdAt: string;
  updatedAt: string;
  user?: TUser;
};
