import type { TAttachment } from "./attachment";
import type { TPagination } from "./pagination";

export type TQuizCategory = {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  attachments: TAttachment[];
};

export type TQuizCategoryResponse = {
  data: TQuizCategory[];
  pagination: TPagination;
  status: string;
};

export type TPostQuizCategory = {
  name: string;
  color: string;
  file: any;
};

export type TUpdateQuizCategory = {
  id: string;
  name: string;
  color: string;
};

export type TGetQuizCategory = {
  id: string;
};

export type TGetAllQuizCategories = {
  limit: number;
  cursor: string;
};

export type TGetAllQuizCategoriesResponse = {
  data: TQuizCategory[];
  pagination: TPagination;
  status: string;
};
