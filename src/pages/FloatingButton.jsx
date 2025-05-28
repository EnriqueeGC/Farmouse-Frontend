import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './FloatingButton.css';
import logo from '../assets/images/Logo.png'; // 👈 Importa la imagen

const FloatingButton = () => {
  const location = useLocation();
  const excludedPaths = ['/cart', '/login', '/seleccionar-ubicacion'];

  const [modalOpen, setModalOpen] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  if (excludedPaths.includes(location.pathname)) {
    return null;
  }

  const toggleModal = () => setModalOpen(prev => !prev);
  const closeModal = () => {
    setModalOpen(false);
    setResetKey(prev => prev + 1);
  };

  return (
    <>
      {/* Botón flotante burbuja con imagen */}
      <div className="chatbot-bubble" onClick={toggleModal} aria-label="Abrir chatbot">
        <img src={logo} alt="Logo" className="chatbot-bubble-logo" />
      </div>

      {/* Modal del chatbot */}
      {modalOpen && (
        <div className="chatbot-modal-overlay">
          <div className="chatbot-modal">
            <button className="chatbot-close-button" onClick={closeModal} aria-label="Cerrar chatbot">
              &times;
            </button>
            <iframe
              key={resetKey}
              src="https://frontend-chatbot-kyfd.onrender.com/"
              title="Chatbot"
              className="chatbot-iframe"
              allow="microphone; clipboard-write"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingButton;
