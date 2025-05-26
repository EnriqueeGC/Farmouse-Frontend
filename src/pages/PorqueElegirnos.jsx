// src/components/home/PorqueElegirnos.jsx

import React from 'react';
import './PorqueElegirnos.css';
import { FaRobot, FaShippingFast, FaHeartbeat, FaUserMd } from 'react-icons/fa';

const PorqueElegirnos = () => {
  return (
    <section className="porque-section">
      <h2 className="porque-title">¿Por qué elegir nuestra farmacia inteligente?</h2>
      <div className="porque-features">
        <div className="feature-card">
          <FaRobot size={40} />
          <h4>Automatización avanzada</h4>
          <p>Sistema inteligente que recomienda productos según tus síntomas y hábitos.</p>
        </div>
        <div className="feature-card">
          <FaShippingFast size={40} />
          <h4>Entrega express</h4>
          <p>Envíos rápidos y seguros con seguimiento en tiempo real.</p>
        </div>
        <div className="feature-card">
          <FaHeartbeat size={40} />
          <h4>Productos certificados</h4>
          <p>Trabajamos con laboratorios autorizados y productos confiables.</p>
        </div>
        <div className="feature-card">
          <FaUserMd size={40} />
          <h4>Asesoramiento profesional</h4>
          <p>Bot inteligente y farmacéuticos disponibles para ayudarte 24/7.</p>
        </div>
      </div>
    </section>
  );
};

export default PorqueElegirnos;
