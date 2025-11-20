import { request } from "./client";

// Signup - Create new user account
export function signup(userData) {
  return request("/user/auth/signup", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

// Login - Authenticate user
export function login(email, password) {
  return request("/user/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// Logout - Clear authentication cookie
export function logout() {
  return request("/user/auth/logout", {
    method: "POST",
  });
}

// Get current user
export function getCurrentUser() {
  return request("/user/auth/me", {
    method: "GET",
  });
}

// Update profile
export function updateProfile(payload) {
  return request("/user/auth/profile", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// Change password
export function changePassword(payload) {
  return request("/user/auth/change-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// Send forgot password OTP
export function sendForgotPasswordOTP(email) {
  return request("/user/auth/forgot-password/send-otp", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

// Verify OTP
export function verifyOTP(email, otp) {
  return request("/user/auth/forgot-password/verify-otp", {
    method: "POST",
    body: JSON.stringify({ email, otp }),
  });
}

// Reset password
export function resetPassword(token, password) {
  return request("/user/auth/forgot-password/reset", {
    method: "POST",
    body: JSON.stringify({ token, password }),
  });
}


