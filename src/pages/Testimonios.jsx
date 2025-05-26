import React from 'react';
import './Testimonios.css';
import { FaQuoteLeft } from 'react-icons/fa';

const testimonios = [
  {
    nombre: 'María González',
    comentario: 'Increíble servicio. Me recomendaron justo lo que necesitaba y me llegó rapidísimo.',
    rol: 'Cliente frecuente',
  },
  {
    nombre: 'Carlos Méndez',
    comentario: 'El sistema inteligente realmente ayuda. Me encantó la atención y rapidez.',
    rol: 'Padre de familia',
  },
  {
    nombre: 'Lucía Ramos',
    comentario: 'Confío en esta farmacia porque todo es claro, seguro y automatizado. ¡Felicidades!',
    rol: 'Paciente crónica',
  },
];

const Testimonios = () => {
  return (
    <section className="testimonios-section">
      <h2 className="testimonios-title">Lo que nuestros clientes dicen</h2>
      <div className="testimonios-grid">
        {testimonios.map((t, index) => (
          <div className="testimonio-card" key={index}>
            <FaQuoteLeft size={24} className="icon" />
            <p className="comentario">"{t.comentario}"</p>
            <div className="cliente">
              <h4>{t.nombre}</h4>
              <span>{t.rol}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonios;
