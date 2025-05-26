import React from 'react';

import marca1 from "../assets/images/marca1.jpg";
import marca2 from "../assets/images/marca2.jpg";
import marca3 from "../assets/images/marca3.jpg";
import marca4 from "../assets/images/marca4.jpg";

const marcas = [
  { id: 1, src: marca1, alt: 'Marca 1' },
  { id: 2, src: marca2, alt: 'Marca 2' },
  { id: 3, src: marca3, alt: 'Marca 3' },
  { id: 4, src: marca4, alt: 'Marca 4' },
];

const NuestrasMarcas = () => {
    return (
      <div style={{ padding: '20px', backgroundColor: '#fafafa' }}>
        <h2 style={{ marginBottom: '15px', textAlign: 'center' }}>Nuestras marcas</h2>
        <div
          style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center', // <-- centrado horizontal
            flexWrap: 'wrap' // opcional si quieres que baje a otra fila en pantallas pequeñas
          }}
        >
          {marcas.map(marca => (
            <img
              key={marca.id}
              src={marca.src}
              alt={marca.alt}
              style={{
                width: '220px',
                height: '100px',
                objectFit: 'cover',
                borderRadius: '6px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              }}
            />
          ))}
        </div>
      </div>
    );
  };
  
  export default NuestrasMarcas;
