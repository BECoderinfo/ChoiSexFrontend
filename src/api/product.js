import { request } from "./client";

export function getProducts(categoryId = null) {
  const url = categoryId 
    ? `/public/products?category=${categoryId}`
    : "/public/products";
  return request(url);
}

export function getProduct(id) {
  return request(`/public/products/${id}`);
}

export function getProductsByCategory(categoryId) {
  return request(`/public/categories/${categoryId}/products`);
}

export function getProductsByCategoryQuery(categoryId) {
  return request(`/public/products?category=${categoryId}`);
}

