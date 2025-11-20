import { request } from "./client";

export function getCategories() {
  return request("/public/categories");
}

