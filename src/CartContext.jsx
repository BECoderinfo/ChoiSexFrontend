// src/context/CartContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import * as cartAPI from "./api/cart";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const ensureAuthenticated = () => {
    if (!isAuthenticated) {
      enqueueSnackbar("Please login to manage your cart", { variant: "warning" });
      navigate("/login");
      return false;
    }
    return true;
  };

  // Load cart from backend when authenticated
  useEffect(() => {
    const loadCart = async () => {
      if (isAuthenticated) {
        try {
          setLoading(true);
          const response = await cartAPI.getCart();
          if (response.success && response.data?.items) {
            setCart(response.data.items);
          }
        } catch (error) {
          console.error("Error loading cart:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setCart([]);
        setLoading(false);
      }
    };

    loadCart();
  }, [isAuthenticated]);

  const addToCart = async (product, quantity) => {
    if (!ensureAuthenticated()) return;
    try {
      const response = await cartAPI.addToCart(product.id || product._id, quantity);
      if (response.success && response.data?.items) {
        setCart(response.data.items);
        enqueueSnackbar(`${product.name} added to cart`, { variant: "success" });
      }
    } catch (error) {
      enqueueSnackbar(error.message || "Failed to add to cart", {
        variant: "error",
      });
    }
  };

  // ✅ Increase quantity
  const increaseQuantity = async (id) => {
    if (!ensureAuthenticated()) return;
    try {
      const item = cart.find((item) => item.id === id);
      if (!item) return;

      const newQuantity = item.quantity + 1;
      if (newQuantity > item.Availability) {
        enqueueSnackbar(`Max stock limit reached (${item.Availability})`, {
          variant: "warning",
        });
        return;
      }

      const response = await cartAPI.updateCartItem(id, newQuantity);
      if (response.success && response.data?.items) {
        setCart(response.data.items);
      }
    } catch (error) {
      enqueueSnackbar(error.message || "Failed to update quantity", {
        variant: "error",
      });
    }
  };

  // ✅ Decrease quantity
  const decreaseQuantity = async (id) => {
    if (!ensureAuthenticated()) return;
    try {
      const item = cart.find((item) => item.id === id);
      if (!item || item.quantity <= 1) return;

      const newQuantity = item.quantity - 1;
      const response = await cartAPI.updateCartItem(id, newQuantity);
      if (response.success && response.data?.items) {
        setCart(response.data.items);
      }
    } catch (error) {
      enqueueSnackbar(error.message || "Failed to update quantity", {
        variant: "error",
      });
    }
  };

  // ✅ Remove product
  const removeFromCart = async (id) => {
    if (!ensureAuthenticated()) return;
    const removedItem = cart.find((item) => item.id === id);

    try {
      const response = await cartAPI.removeFromCart(id);
      if (response.success && response.data?.items) {
        setCart(response.data.items);
        if (removedItem) {
          enqueueSnackbar(`${removedItem.name} removed from cart`, {
            variant: "error",
          });
        }
      }
    } catch (error) {
      enqueueSnackbar(error.message || "Failed to remove item", {
        variant: "error",
      });
    }
  };

  // ✅ Clear all
  const clearCart = async () => {
    if (!ensureAuthenticated()) return;
    try {
      const response = await cartAPI.clearCart();
      if (response.success) {
        setCart([]);
      }
    } catch (error) {
      enqueueSnackbar(error.message || "Failed to clear cart", {
        variant: "error",
      });
    }
  };

  const cartCount = cart.length;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        increaseQuantity,
        decreaseQuantity,
        cartCount,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
