import React, { createContext, useState, useContext, useEffect } from 'react';
import './cart.css';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart = sessionStorage.getItem('cartItems');
      return storedCart ? JSON.parse(storedCart) : [];
    } catch {
      return [];
    }
  });

  // Sincroniza cartItems con sessionStorage cuando cambie
  useEffect(() => {
    try {
      sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error guardando el carrito en sessionStorage:', error);
    }
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems((prevCartItems) => {
      const isReservation = item.codigoMesaReserva !== undefined;
      let updatedItems;

      if (isReservation) {
        updatedItems = [...prevCartItems, item];
      } else {
        const existingIndex = prevCartItems.findIndex(
          (cartItem) => cartItem.idAlimento === item.idAlimento
        );

        if (existingIndex !== -1) {
          const updatedItem = {
            ...prevCartItems[existingIndex],
            quantity: prevCartItems[existingIndex].quantity + item.quantity,
          };
          updatedItems = [
            ...prevCartItems.slice(0, existingIndex),
            updatedItem,
            ...prevCartItems.slice(existingIndex + 1),
          ];
        } else {
          updatedItems = [...prevCartItems, item];
        }
      }

      return updatedItems;
    });
  };

  const removeFromCart = (itemId, quantityToRemove) => {
    setCartItems((prevCartItems) => {
      const updatedItems = prevCartItems.reduce((acc, item) => {
        if (item.idAlimento === itemId) {
          const newQuantity = item.quantity - quantityToRemove;
          if (newQuantity > 0) {
            acc.push({ ...item, quantity: newQuantity });
          }
        } else if (item.codigoMesaReserva !== itemId) {
          acc.push(item);
        }
        return acc;
      }, []);

      return updatedItems;
    });
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
