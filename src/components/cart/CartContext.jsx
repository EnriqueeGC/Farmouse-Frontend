import React, { createContext, useState, useContext } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const storedCart = sessionStorage.getItem('cartItems');
        return storedCart ? JSON.parse(storedCart) : [];
    });

    const updateCart = (items) => {
        try {
            if (!Array.isArray(items)) {
                throw new Error("El carrito debe ser un array.");
            }
            setCartItems(items);
            sessionStorage.setItem('cartItems', JSON.stringify(items));
        } catch (error) {
            console.error("Error actualizando el carrito:", error);
        }
    };

    const addToCart = (item) => {
        console.log("Intentando agregar al carrito:", item); // Agregado para debug
        try {
            setCartItems((prevCartItems) => {
                const isReservation = item.codigoMesaReserva !== undefined;
                let updatedItems;
    
                if (isReservation) {
                    updatedItems = [...prevCartItems, item];
                } else {
                    const existingItemIndex = prevCartItems.findIndex(cartItem => cartItem.idAlimento === item.idAlimento);
                    if (existingItemIndex !== -1) {
                        const updatedItem = {
                            ...prevCartItems[existingItemIndex],
                            quantity: prevCartItems[existingItemIndex].quantity + item.quantity
                        };
                        updatedItems = [
                            ...prevCartItems.slice(0, existingItemIndex),
                            updatedItem,
                            ...prevCartItems.slice(existingItemIndex + 1)
                        ];
                    } else {
                        const newItem = { ...item, quantity: item.quantity };
                        updatedItems = [...prevCartItems, newItem];
                    }
                }
    
                updateCart(updatedItems);
                console.log("Carrito actualizado:", updatedItems); // Agregado para debug
                return updatedItems;
            });
        } catch (error) {
            console.error("Error agregando al carrito:", error);
        }
    };
    
    const removeFromCart = (itemId, quantityToRemove) => {
        console.log("Intentando eliminar del carrito:", itemId); // Agregado para debug
        try {
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
    
                updateCart(updatedItems);
                console.log("Carrito actualizado después de eliminar:", updatedItems); // Agregado para debug
                return updatedItems;
            });
        } catch (error) {
            console.error("Error eliminando del carrito:", error);
        }
    };
    

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(CartContext);
};
