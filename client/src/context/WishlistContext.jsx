// src/context/WishlistContext.js

import { createContext, useContext, useState } from 'react';

// Create the Wishlist context
const WishlistContext = createContext();

// Provider component to wrap around parts of the app that need access to wishlist
export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  // Add a product to the wishlist
  const addToWishlist = (product) => {
    setWishlist(prev => [...prev, product]);
  };

  // Remove a product from the wishlist by its ID
  const removeFromWishlist = (productId) => {
    setWishlist(prev => prev.filter(item => item._id !== productId));
  };

  // Toggle product in wishlist: add if not present, remove if already there
  const toggleWishlist = (product) => {
    const exists = wishlist.some(item => item._id === product._id);
    exists ? removeFromWishlist(product._id) : addToWishlist(product);
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

// Custom hook to use the wishlist context
export const useWishlist = () => useContext(WishlistContext);
