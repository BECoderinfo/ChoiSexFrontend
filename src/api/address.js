import { request } from "./client";

export function getAddresses() {
  return request("/addresses", { method: "GET" });
}

export function createAddress(payload) {
  return request("/addresses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateAddress(id, payload) {
  return request(`/addresses/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteAddress(id) {
  return request(`/addresses/${id}`, {
    method: "DELETE",
  });
}


