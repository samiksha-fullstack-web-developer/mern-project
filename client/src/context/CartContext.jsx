// src/context/CartContext.jsx
// Context for managing cart operations (add, remove, update, order, etc.)

import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from './UserContext'; // Adjust the path if needed

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { fetchUser } = useUser() || {}; // Handles case when context is not ready

  // Fetch cart data from backend
  const fetchCart = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/cart", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setCart(data.cart);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  };

  // Fetch cart on initial mount
  useEffect(() => {
    fetchCart(); // 🚀 Load cart from server
  }, []);

  // Add a product to the cart
  const addToCart = async (product, quantity = 1) => {
    try {
      // Send only essential fields
      const { _id, name, price } = product;
      const productToSend = { _id, name, price };

      const res = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ product: productToSend, quantity }),
      });

      const data = await res.json();
      if (data.success) {
        setCart(data.cart); // ✅ Update cart state
      }
    } catch (error) {
      console.error("Add to cart failed:", error);
    }
  };

  // Update the quantity of a cart item
  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) return; // ⛔ Invalid quantity

    try {
      const res = await fetch("http://localhost:5000/api/cart/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await res.json();
      if (data.success) {
        setCart(data.cart);
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  // Remove a product from the cart
  const removeFromCart = async (productId) => {
    try {
      const res = await fetch("http://localhost:5000/api/cart/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();
      if (data.success) {
        setCart(data.cart);
      } else {
        console.error("Remove failed:", data.message);
      }
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  // Clear the entire cart
  const clearCart = async () => {
    try {
      await fetch("http://localhost:5000/api/cart/clear", {
        method: "DELETE",
        credentials: "include",
      });
      setCart([]); // 🔄 Clear local state
    } catch (err) {
      console.error("Failed to clear cart:", err);
    }
  };

  // Place an order with the current cart and shipping info
  const placeOrder = async (shippingDetails) => {
    const items = cart.map((item) => ({
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }));

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          items,
          total,
          paymentMethod: shippingDetails.paymentMethod,
          shipping: shippingDetails,
        }),
      });

      const data = await res.json();

      if (data.success) {
        await clearCart(); // 🛒 Cart cleared after successful order
      }

      return data;
    } catch (err) {
      console.error("Order placement failed:", err);
    }
  };

  // Shared context value for global access
  const contextValue = {
    cart,
    fetchUser,
    addToCart,
    placeOrder,
    clearCart,
    updateQuantity,
    removeFromCart,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => useContext(CartContext);
