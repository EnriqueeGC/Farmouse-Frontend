import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '../cart/CartContext';

const Checkout = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { cartItems } = useCart();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (error) {
      console.error(error);
      alert("Error al procesar el pago");
      return;
    }

    // Simulación: Enviar a backend
    console.log('Método de pago creado:', paymentMethod);
    console.log('Productos:', cartItems);
    alert("Pago simulado exitosamente. Método de pago creado en consola.");
  };

  return (
    <div>
      <h2>Pagar</h2>
      <form onSubmit={handleSubmit}>
        <CardElement />
        <button type="submit" disabled={!stripe}>
          Pagar
        </button>
      </form>
    </div>
  );
};

export default Checkout;
