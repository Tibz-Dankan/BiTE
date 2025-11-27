import type { TPagination } from "./pagination";

export type TQuizCategory = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type TQuizCategoryResponse = {
  data: TQuizCategory[];
  pagination: TPagination;
  status: string;
};

export type TPostQuizCategory = {
  name: string;
};

export type TUpdateQuizCategory = {
  id: string;
  name: string;
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
