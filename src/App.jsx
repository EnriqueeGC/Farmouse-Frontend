// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MenuPack from "./pages/MenuPack";
import LoadingScreen from "./pages/LoadingScreen";
import UserProfile from "./pages/UserProfile";
import Cart from "./components/cart/Cart";
import SeleccionarUbicacion from "./pages/SeleccionarUbicacion";
import { CartProvider } from "../src/components/cart/CartContext";
import ErrorBoundary from "./pages/ErrorBoundary";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Checkout from "./components/cart/Checkout";
import ProductBySubcategory from "./components/Product/ProductBySubcategory";
import FloatingButton from "./pages/FloatingButton";
import CheckoutForm from "./components/payment/checkoutForm";

// admin
import AdminLayout from './components/admin/AdminLayout';
import AdminCategorias from './components/admin/AdminCategorias';
import AdminSubcategorias from './components/admin/AdminSubcategorias';
import AdminProductos from './components/admin/AdminProductos';
import AdminPedidos from './components/admin/AdminPedidos'; // según ubicación
import AdminVentas from './components/admin/AdminVentas'; //
import AdminFacturas from './components/admin/AdminFacturas';
import AdminUsuarios from './components/admin/AdminUsuarios';


function App() {
  const [isLoading, setIsLoading] = useState(true);
  const stripePromise = loadStripe(
    "pk_test_51RLENcP996W6PblW39XAXAAWzXIGCaeL9zeXjxJcyfqQTzHZRZ7xzgCw0EPW5F5Jzvec2Y6kQEmrNOzUN8ptuewY00kqUh5MgN"
  );

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
              {/* Rutas públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/menu-pack" element={<MenuPack />} />
              <Route path="/user-profile" element={<UserProfile />} />
              <Route path="/seleccionar-ubicacion" element={<SeleccionarUbicacion />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/productos/subcategoria/:id_subcategoria" element={<ProductBySubcategory />} />
              <Route path="/floating-button" element={<FloatingButton />} />
              <Route path="/checkout-form" element={<CheckoutForm />} />


              {/* Rutas de administrador con sidebar */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="categorias" element={<AdminCategorias />} />
                <Route path="subcategorias" element={<AdminSubcategorias />} />
                <Route path="productos" element={<AdminProductos />} />
                <Route path="/admin/pedidos" element={<AdminPedidos />} />
                <Route path="/admin/ventas" element={<AdminVentas />} />
                <Route path="/admin/facturas" element={<AdminFacturas />} />
                <Route path="/admin/usuarios" element={<AdminUsuarios />} />
              </Route>
            </Routes>
          </Router>
        </Elements>
      </CartProvider>
    </ErrorBoundary>
  );
}

export default App;
