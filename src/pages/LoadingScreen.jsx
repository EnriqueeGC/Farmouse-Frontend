import React from 'react';
import './LoadingScreen.css';
import logo from '../assets/images/Logo.png';

const LoadingScreen = () => {
  // Generar 15 chispas con posiciones aleatorias
  const chispas = Array.from({ length: 15 }).map((_, i) => {
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const delay = Math.random() * 2;

    return (
      <div
        key={i}
        className="spark"
        style={{
          left: `${left}%`,
          top: `${top}%`,
          animationDelay: `${delay}s`,
        }}
      />
    );
  });

  return (
    <div className="loading-container">
      <img src={logo} alt="Logo" className="loading-logo" />
      {chispas}
    </div>
  );
};

export default LoadingScreen;
