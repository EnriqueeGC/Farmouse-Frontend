// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import MenuPack from './pages/MenuPack';
import LoadingScreen from './pages/LoadingScreen';
import Cart from './components/cart/Cart';
import { CartProvider } from '../src/components/cart/CartContext';
import ErrorBoundary from './pages/ErrorBoundary';

function App() {
    const [isLoading, setIsLoading] = useState(true);

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
                <Router>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/menu-pack" element={<MenuPack />} />
                    </Routes>
                </Router>
            </CartProvider>
        </ErrorBoundary>
    );
}

export default App;
