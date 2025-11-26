import { request } from "./client";

// Create new order
export function createOrder(orderData) {
  return request("/orders/create", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
}

// Get user's orders
export function getOrders() {
  return request("/orders", {
    method: "GET",
  });
}

// Get single order by ID
export function getOrder(orderId) {
  return request(`/orders/${orderId}`, {
    method: "GET",
  });
}

// Update order status (confirm payment, etc.)
export function updateOrderStatus(orderId, statusData) {
  return request(`/orders/${orderId}/status`, {
    method: "PUT",
    body: JSON.stringify(statusData),
  });
}

