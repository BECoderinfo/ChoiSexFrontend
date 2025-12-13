import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  signup as signupAPI,
  login as loginAPI,
  logout as logoutAPI,
  getCurrentUser,
} from "../api/userAuth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await getCurrentUser();
      if (response.success) {
        setUser(response.data);
      } else {
        // Clear tokens if auth check fails
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setUser(null);
      }
    } catch (error) {
      // Clear tokens on error
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      const response = await signupAPI(userData);
      if (response.success) {
        // Store tokens if provided
        if (response.accessToken) {
          localStorage.setItem("accessToken", response.accessToken);
        }
        if (response.refreshToken) {
          localStorage.setItem("refreshToken", response.refreshToken);
        }
        setUser(response.data);
        return { success: true, data: response.data };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await loginAPI(email, password);
      if (response.success) {
        // Store tokens if provided
        if (response.accessToken) {
          localStorage.setItem("accessToken", response.accessToken);
        }
        if (response.refreshToken) {
          localStorage.setItem("refreshToken", response.refreshToken);
        }
        setUser(response.data);
        return { success: true, data: response.data };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    try {
      await logoutAPI();
      // Clear tokens from localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      navigate("/login");
      return { success: true };
    } catch (error) {
      // Clear tokens even if API call fails
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      navigate("/login");
      return { success: false, message: error.message };
    }
  };

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    isAuthenticated: !!user,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};


