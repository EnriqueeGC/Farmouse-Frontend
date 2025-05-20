// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import MenuPack from './pages/MenuPack';
import LoadingScreen from './pages/LoadingScreen';
import UserProfile from './pages/UserProfile';
import Cart from './components/cart/Cart';
import SeleccionarUbicacion from './pages/SeleccionarUbicacion';
import { CartProvider } from '../src/components/cart/CartContext';
import ErrorBoundary from './pages/ErrorBoundary';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Checkout from './components/cart/Checkout';
import ProductBySubcategory from './components/Product/ProductBySubcategory';


function App() {
    const [isLoading, setIsLoading] = useState(true);
    const stripePromise = loadStripe("pk_test_51RLENcP996W6PblW39XAXAAWzXIGCaeL9zeXjxJcyfqQTzHZRZ7xzgCw0EPW5F5Jzvec2Y6kQEmrNOzUN8ptuewY00kqUh5MgN");
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <ErrorBoundary>
            <CartProvider>
                <Elements stripe={stripePromise}>

                <Router>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/menu-pack" element={<MenuPack />} />
                        <Route path="/user-profile" element={<UserProfile />} />
                        <Route path="/seleccionar-ubicacion" element={<SeleccionarUbicacion />} /> 
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/productos/subcategoria/:id_subcategoria" element={<ProductBySubcategory />} />
                        <Route path="/productos/:nombre" element={<ProductBySubcategory />} />
                    </Routes>
                </Router>
                </Elements>
            </CartProvider>
        </ErrorBoundary>
    );
}

export default App;
