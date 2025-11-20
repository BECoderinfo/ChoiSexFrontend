// src/context/CartContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { useSnackbar } from "notistack";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) setCart(JSON.parse(storedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > product.Availability) {
          enqueueSnackbar(`Max stock limit reached (${product.Availability})`, {
            variant: "warning",
          });
          return prevCart;
        }
        enqueueSnackbar(`${product.name} quantity updated`, { variant: "info" });
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: newQty } : item
        );
      } else {
        enqueueSnackbar(`${product.name} added to cart`, { variant: "success" });
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  // ✅ Increase quantity
  const increaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id && item.quantity < item.Availability
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // ✅ Decrease quantity
  const decreaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // ✅ Remove product
  const removeFromCart = (id) => {
    const removedItem = cart.find((item) => item.id === id);
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    if (removedItem) {
      enqueueSnackbar(`${removedItem.name} removed from cart`, {
        variant: "error",
      });
    }
  };

  // ✅ Clear all
  const clearCart = () => {
    setCart([]);
    enqueueSnackbar("Cart cleared successfully", { variant: "info" });
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
