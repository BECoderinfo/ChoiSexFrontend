import { request } from "./client";

// Get user's cart
export function getCart() {
  return request("/cart", {
    method: "GET",
  });
}

// Add product to cart
export function addToCart(productId, quantity) {
  return request("/cart/add", {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });
}

// Update cart item quantity
export function updateCartItem(productId, quantity) {
  return request("/cart/update", {
    method: "PUT",
    body: JSON.stringify({ productId, quantity }),
  });
}

// Remove product from cart
export function removeFromCart(productId) {
  return request(`/cart/remove/${productId}`, {
    method: "DELETE",
  });
}

// Clear entire cart
export function clearCart() {
  return request("/cart/clear", {
    method: "DELETE",
  });
}

