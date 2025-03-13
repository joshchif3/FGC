import React, { createContext, useState, useContext, useEffect } from "react";
import { fetchCart, addToCart as addToCartApi, removeFromCart as removeFromCartApi, updateQuantity as updateQuantityApi, fetchProductById } from "./api";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});
  const [productDetails, setProductDetails] = useState({});

  // Fetch the user's cart
  const fetchUserCart = async (userId) => {
    try {
      const cart = await fetchCart(userId);
      setCartItems(cart.items);

      // Fetch product details for each item in the cart
      const productIds = Object.keys(cart.items);
      const productDetailsPromises = productIds.map(id => fetchProductById(id));
      const productDetailsResults = await Promise.all(productDetailsPromises);
      const productDetailsMap = productDetailsResults.reduce((acc, product) => {
        acc[product.id] = product;
        return acc;
      }, {});
      setProductDetails(productDetailsMap);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  };

  // Add an item to the cart
  const addToCart = async (userId, productId, quantity) => {
    try {
      const updatedCart = await addToCartApi(userId, productId, quantity);
      setCartItems(updatedCart.items);

      // Fetch product details if not already in state
      if (!productDetails[productId]) {
        const product = await fetchProductById(productId);
        setProductDetails(prevDetails => ({
          ...prevDetails,
          [productId]: product,
        }));
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
      throw error;
    }
  };

  // Remove an item from the cart
  const removeFromCart = async (userId, productId) => {
    try {
      const updatedCart = await removeFromCartApi(userId, productId);
      setCartItems(updatedCart.items);
    } catch (error) {
      console.error("Failed to remove from cart:", error);
    }
  };

  // Update the quantity of an item in the cart
  const updateQuantity = async (userId, productId, quantity) => {
    try {
      const updatedCart = await updateQuantityApi(userId, productId, quantity);
      setCartItems(updatedCart.items);
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, productDetails, addToCart, removeFromCart, updateQuantity, fetchUserCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);