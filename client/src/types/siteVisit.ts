import type { TUser } from "./auth";
import type { TLocation } from "./location";

export type TSiteVisit = {
  id: string;
  userID: string;
  device: string;
  page: string;
  path: string;
  locationID: string;
  capturedAt: string;
  createdAt: string;
  updatedAt: string;
  user?: TUser;
  location?: TLocation;
};

export type TPostSiteVisit = {
  page: string;
  path: string;
  capturedAt: string;
};

export type TSiteVisitResponse = {
  data: TSiteVisit[];
  pagination: {
    count: number;
    hasNextItems: boolean;
    limit: number;
    nextCursor: string;
  };
  status: string;
};
