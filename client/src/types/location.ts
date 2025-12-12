import type { TUser } from "./auth";

export type TLocation = {
  id: string;
  userID: string;
  info: any;
  createdAt: string;
  updatedAt: string;
  user?: TUser;
};
