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

// Create Razorpay order for an existing order
export function createRazorpayOrder(orderId) {
  return request(`/orders/${orderId}/razorpay/create`, {
    method: "POST",
  });
}

// Verify Razorpay payment
export function verifyRazorpayPayment(orderId, payload) {
  return request(`/orders/${orderId}/razorpay/verify`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getTracking(orderId) {
  return request(`/order/get-tracking/${orderId}`);
}

export function cancelOrder(orderId) {
  return request(`/orders/${orderId}/cancel`, {
    method: "POST",
  });
}

