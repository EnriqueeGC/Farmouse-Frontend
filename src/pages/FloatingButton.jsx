import React from 'react';
import { useLocation } from 'react-router-dom';

const FloatingButton = () => {
  const location = useLocation();

  const excludedPaths = ['/cart', '/login', '/seleccionar-ubicacion'];

  if (excludedPaths.includes(location.pathname)) {
    return null;
  }

  return (
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
        zIndex: 9999,
        cursor: 'pointer',
      }}
      aria-label="Floating Button"
    >
      <i className="ri-copilot-line"></i>
    </div>
  );
};

export default FloatingButton;
