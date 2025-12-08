import { request } from "./client";

export function getSubcategories(categoryId) {
  const query = categoryId ? `?category=${categoryId}` : "";
  return request(`/public/subcategories${query}`);
}

export function getProductsBySubcategory(subcategoryId) {
  return request(`/public/subcategories/${subcategoryId}/products`);
}


