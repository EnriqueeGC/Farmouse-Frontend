import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './product.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      let isMounted = true; // bandera para comprobar si el componente está montado
      try {
        const response = await axios.get('https://farmouse.onrender.com/product'); // URL del backend
        if (isMounted) { // Solo actualiza el estado si el componente sigue montado
          setProducts(response.data.data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError('Error al obtener los productos');
          setLoading(false);
        }
      }

      return () => {
        isMounted = false; // Limpiamos la bandera cuando el componente se desmonta
      };
    };

    fetchProducts();
  }, []); // Solo se ejecuta una vez al montar el componente

  if (loading) return <div>Cargando productos...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="products-container">
      <h2>Oferta 3x2</h2>
      <div className="products-list">
        {products.map((product) => (
          <div key={product.id_producto} className="product-card">
            <img src={product.url_imagen} alt={product.nombre} className="product-image" />
            <div className="product-info">
              <h3>{product.nombre}</h3>
              <p>${parseFloat(product.precio).toFixed(2)}</p>
              <span className="offer">3x2</span>
              <button className="buy-now-btn">Comprar ahora</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
