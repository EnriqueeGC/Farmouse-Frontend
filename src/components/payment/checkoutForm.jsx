import React, { useState, useEffect } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import "./checkoutForm.css";

const stripePromise = loadStripe(
  "pk_test_51RSQ1KB0xmcWTCFEHLs6VTcsoEN3pXJmUZ6S3ebZP150W4pWKkb41gAahDUvhkzWFOV5A97wPxsxVvOORcYPSxP800e2AWX78S"
);

const CheckoutFormInner = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    direccion: "",
    correo: "",
    notas: "",
  });

  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [clientSecret, setClientSecret] = useState("");
  const [idPedido, setIdPedido] = useState(null);
  const [facturaURL, setFacturaURL] = useState("");
  const [pagoExitoso, setPagoExitoso] = useState(false);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(storedCart);
    const total = storedCart.reduce(
      (acc, item) => acc + item.precio * item.quantity,
      0
    );
    setTotalAmount(total);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://farmouse.onrender.com/api/payment/register-payment",
        {
          ...formData,
          carrito: cartItems,
          total: totalAmount,
        }
      );

      const { id_pedido, total } = response.data;
      setIdPedido(id_pedido);

      const stripeResponse = await axios.post(
        "https://farmouse.onrender.com/api/payment/create-payment-intent",
        {
          id_pedido,
          amount: total,
        }
      );

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
      if (result.paymentIntent.status === "succeeded") {
        try {
          const confirmResponse = await axios.post(
            "https://farmouse.onrender.com/api/payment/confirm-payment",
            {
              paymentIntentId: result.paymentIntent.id,
            }
          );

          alert("Pago exitoso");

          // Guardar URL de factura para mostrar botón
          setFacturaURL(confirmResponse.data.factura_url);
          setPagoExitoso(true);

          // Limpiar formulario
          setFormData({
            nombre: "",
            apellido: "",
            telefono: "",
            direccion: "",
            correo: "",
            notas: "",
          });

          cardElement.clear();

          localStorage.removeItem("cartItems");
          setCartItems([]);
          setClientSecret("");
          setIdPedido(null);
          setTotalAmount(0);

        } catch (err) {
          console.error("Error al confirmar el pago:", err);
        }
      }
    }
  };

  const handleDownloadFactura = () => {
    if (facturaURL) {
      window.open(facturaURL, "_blank");
    }
  };

  const handleGoHome = () => {
    window.location.href = "/"; // Cambia si usas otro path
  };

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Datos del pedido</h2>
      <form onSubmit={handleSubmit} className="checkout-form-user-info">
        <div className="checkout-row">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            className="checkout-input checkout-nombre"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="apellido"
            placeholder="Apellido"
            className="checkout-input checkout-apellido"
            onChange={handleChange}
            required
          />
        </div>

        <div className="checkout-row">
          <input
            type="email"
            name="correo"
            placeholder="Correo electrónico"
            className="checkout-input checkout-correo"
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="telefono"
            placeholder="Teléfono"
            className="checkout-input checkout-telefono"
            onChange={handleChange}
            required
          />
        </div>

        <input
          type="text"
          name="direccion"
          placeholder="Dirección de envío"
          className="checkout-input checkout-direccion"
          onChange={handleChange}
          required
        />

        <textarea
          name="notas"
          placeholder="Notas adicionales (opcional)"
          className="checkout-textarea checkout-notas"
          onChange={handleChange}
        />

        <p className="checkout-total">
          Total a pagar: <strong>${totalAmount.toFixed(2)}</strong>
        </p>

        <button type="submit" className="checkout-btn generate-order-btn">
          Generar pedido
        </button>
      </form>

      {clientSecret && !pagoExitoso && (
        <form onSubmit={handlePayment} className="checkout-form-payment">
          <h3 className="checkout-title">Datos de la tarjeta</h3>
          <div className="checkout-card-element">
            <CardElement />
          </div>
          <button
            type="submit"
            className="checkout-btn pay-btn"
            disabled={!stripe}
          >
            Pagar
          </button>
        </form>
      )}

      {pagoExitoso && (
        <div className="checkout-post-payment">
          <h3>¡Gracias por tu compra!</h3>
          <button
            onClick={handleDownloadFactura}
            className="checkout-btn download-btn"
          >
            Descargar factura
          </button>
          <button onClick={handleGoHome} className="checkout-btn home-btn">
            Ir al inicio
          </button>
        </div>
      )}
    </div>
  );
};

const CheckoutForm = () => (
  <Elements stripe={stripePromise}>
    <CheckoutFormInner />
  </Elements>
);

export default CheckoutForm;
