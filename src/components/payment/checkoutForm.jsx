import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    CardElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';

import './checkoutForm.css';

const stripePromise = loadStripe("pk_test_51RSQ1KB0xmcWTCFEHLs6VTcsoEN3pXJmUZ6S3ebZP150W4pWKkb41gAahDUvhkzWFOV5A97wPxsxVvOORcYPSxP800e2AWX78S");

const CheckoutFormInner = () => {
    const stripe = useStripe();
    const elements = useElements();

    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        telefono: '',
        direccion: '',
        correo: '',
        notas: '',
    });

    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [clientSecret, setClientSecret] = useState('');
    const [idPedido, setIdPedido] = useState(null);

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cartItems')) || [];
        setCartItems(storedCart);
        const total = storedCart.reduce((acc, item) => acc + item.precio * item.quantity, 0);
        setTotalAmount(total);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // 1. Registrar pedido
            const response = await axios.post('https://farmouse.onrender.com/api/payment/register-payment', {
                ...formData,
                carrito: cartItems,
                total: totalAmount,
            });

            const { id_pedido, total } = response.data;
            setIdPedido(id_pedido);

            // 2. Crear PaymentIntent
            const stripeResponse = await axios.post('https://farmouse.onrender.com/api/payment/create-payment-intent', {
                id_pedido,
                amount: total,
            });

            setClientSecret(stripeResponse.data.clientSecret);
        } catch (error) {
            console.error("Error al crear el pedido:", error);
        }
    };

    const handlePayment = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        const cardElement = elements.getElement(CardElement);

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    name: `${formData.nombre} ${formData.apellido}`,
                    email: formData.correo,
                },
            },
        });

        if (result.error) {
            console.error("Error en el pago:", result.error.message);
        } else {
            if (result.paymentIntent.status === 'succeeded') {
                // Aquí puedes llamar a tu backend para registrar la venta y actualizar el pedido
                await axios.post('https://farmouse.onrender.com/api/payment/confirm-payment', {
                    id_pedido: idPedido
                });

                alert("Pago exitoso");
                localStorage.removeItem("cartItems");
                // Redirigir o mostrar mensaje final
            }
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="checkout-form">
                <input type="text" name="nombre" placeholder="Nombre" onChange={handleChange} required />
                <input type="text" name="apellido" placeholder="Apellido" onChange={handleChange} required />
                <input type="email" name="correo" placeholder="Correo electrónico" onChange={handleChange} required />
                <input type="tel" name="telefono" placeholder="Teléfono" onChange={handleChange} required />
                <input type="text" name="direccion" placeholder="Dirección de envío" onChange={handleChange} required />
                <textarea name="notas" placeholder="Notas adicionales" onChange={handleChange} />
                <p>Total a pagar: <strong>${totalAmount.toFixed(2)}</strong></p>
                <button type="submit">Generar pedido</button>
            </form>

            {clientSecret && (
                <form onSubmit={handlePayment}>
                    <CardElement />
                    <button type="submit" disabled={!stripe}>Pagar</button>
                </form>
            )}
        </>
    );
};

const CheckoutForm = () => (
    <Elements stripe={stripePromise}>
        <CheckoutFormInner />
    </Elements>
);

export default CheckoutForm;
