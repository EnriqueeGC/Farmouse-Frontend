import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../cart/CartContext';
import './cart.css';
import axios from 'axios';

const Cart = () => {
    const { cartItems, removeFromCart } = useContext(CartContext);
    const [quantitiesToRemove, setQuantitiesToRemove] = useState({});
    const navigate = useNavigate();

    console.log("Artículos en el carrito:", cartItems); // Debug
    // guardar el carrito en el localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    if (cartItems.length === 0) {
        return <div className="empty-cart">El carrito está vacío</div>;
    }

    const handleRemove = (itemId) => {
        const quantityToRemove = quantitiesToRemove[itemId] || 1;
        removeFromCart(itemId, quantityToRemove);
        setQuantitiesToRemove({ ...quantitiesToRemove, [itemId]: 1 });
    };

    const handleQuantityChange = (itemId, value) => {
        setQuantitiesToRemove({ ...quantitiesToRemove, [itemId]: Math.max(1, value) });
    };

    const formatTime = (dateTime) => {
        const options = { hour: '2-digit', minute: '2-digit', hour12: false };
        return new Date(dateTime).toLocaleTimeString([], options);
    };

    const totalCartAmount = cartItems.reduce((acc, item) => acc + (item.precio * (item.quantity || 1)), 0);

    const handleCheckout = async () => {
        // redireccionar al formulario de pago
        navigate('/checkout-form');
    };

    return (
        <div className="cart-container">
            <h2>Mi carrito</h2>
            <ul className="cart-items">
                {cartItems.map((item, index) => (
                    <li key={index} className="cart-item">
                        {item.idAlimento ? (
                            <>
                                <img 
                                    src={item.imagen || 'ruta_por_defecto'} // Asegúrate de tener una ruta por defecto
                                    alt={item.nombre} 
                                    className="cart-item-image" 
                                />
                                <div className="cart-item-details">
                                    <h5>{item.nombre}</h5>
                                    <p>Precio: Q {item.precio}</p>
                                    <p>Cantidad: {item.quantity}</p>
                                    <p>Total: Q {(item.precio * item.quantity).toFixed(2)}</p>
                                    <input
                                        type="number"
                                        min="1"
                                        value={quantitiesToRemove[item.idAlimento] || 1}
                                        onChange={(e) => handleQuantityChange(item.idAlimento, parseInt(e.target.value))}
                                    />
                                    <button onClick={() => handleRemove(item.idAlimento)}>Eliminar</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <img 
                                    src={item.imagen || 'ruta_por_defecto'} // Asegúrate de tener una ruta por defecto
                                    alt={`Mesa ${item.nombre || item.codigoMesaReserva}`} // Usa item.nombre o el código de la mesa
                                    className="cart-item-image" 
                                />
                                <div className="cart-item-details">
                                    <h5>Reserva - Mesa {item.codigoMesaReserva}</h5>
                                    <p>Capacidad: {item.cantidadPersonas}</p>
                                    <p>Fecha: {item.fechaReserva}</p>
                                    <p>Hora: {formatTime(item.horaInicial)} - {formatTime(item.horaFinal)}</p>
                                    <p>Precio: Q{item.precio}</p>
                                    <button onClick={() => handleRemove(item.codigoMesaReserva)}>Eliminar</button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
            <div className="cart-total">
                <h4>Total: Q{cartItems.reduce((acc, item) => acc + (item.precio * (item.quantity || 1)), 0).toFixed(2)}</h4>
            </div>
            <button onClick={handleCheckout} className="checkout-button">
                Proceder al Pago
            </button>
        </div>
    );
};

const BackToMenuButton = () => (
    <Link to="/" className="back-to-menu">← Volver al Menú</Link>
);

const CartPage = () => (
    <div>
        <BackToMenuButton />
        <Cart />
    </div>
);

export default CartPage;
