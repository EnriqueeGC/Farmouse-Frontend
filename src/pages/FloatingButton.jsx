import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const FloatingButton = () => {
  const location = useLocation();
  const excludedPaths = ['/cart', '/login', '/seleccionar-ubicacion'];

  const [modalOpen, setModalOpen] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  if (excludedPaths.includes(location.pathname)) {
    return null;
  }

  // Alterna mostrar/ocultar modal
  const toggleModal = () => {
    setModalOpen(prev => !prev);
  };

  // Cierra modal y reinicia iframe (para que chatbot reinicie la conversación)
  const closeModal = () => {
    setModalOpen(false);
    setResetKey(prev => prev + 1); // Cambia la key para reiniciar iframe
  };

  return (
    <>
      {/* Botón flotante: siempre visible */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#25D366',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 2px 5px rgba(0,0,0,0.4)',
          color: 'white',
          fontSize: '32px',
          zIndex: 11000,
          cursor: 'pointer',
        }}
        aria-label="Floating Button"
        onClick={toggleModal}
      >
        <i className="ri-copilot-line"></i>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10000,
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '500px',
              height: '700px',
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '12px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Botón X: cierra y reinicia */}
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'transparent',
                border: 'none',
                fontSize: '32px',
                cursor: 'pointer',
                fontWeight: 'bold',
                color: 'black',
                zIndex: 11001,
                transition: 'color 0.2s',
              }}
              aria-label="Cerrar modal"
              onMouseEnter={e => (e.currentTarget.style.color = '#25D366')}
              onMouseLeave={e => (e.currentTarget.style.color = 'black')}
            >
              &times;
            </button>

            {/* iframe para chatbot con key para reset */}
            <iframe
              key={resetKey}
              src="https://frontend-chatbot-kyfd.onrender.com/"
              title="Chatbot"
              style={{
                flexGrow: 1,
                border: 'none',
                borderRadius: '12px',
                marginTop: '40px',
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingButton;
