import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './product.css';
import { useCart } from '../cart/CartContext'; // 👈 Asegúrate que esta ruta sea correcta

const Products = () => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart(); // 👈 Hook del carrito

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://farmouse.onrender.com/product');
        if (isMounted) {
          setProducts(response.data.data);
          const initialQuantities = {};
          response.data.data.forEach(product => {
            initialQuantities[product.id_producto] = 1;
          });
          setQuantities(initialQuantities);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError('Error al obtener los productos');
          setLoading(false);
        }
      }

      return () => {
        isMounted = false;
      };
    };

    fetchProducts();
  }, []);

  const handleQuantityChange = (id, value) => {
    const newQuantities = { ...quantities, [id]: Math.max(1, parseInt(value) || 1) };
    setQuantities(newQuantities);
  };

  const handleBuyNow = (product) => {
    const quantity = quantities[product.id_producto] || 1;
    const item = {
      idAlimento: product.id_producto,
      nombre: product.nombre,
      precio: parseFloat(product.precio),
      quantity: quantity,
      imagen: product.url_imagen
    };
    addToCart(item); // 👈 Se agrega al carrito
  };

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
              <p>Q{parseFloat(product.precio).toFixed(2)}</p>
              <span className="offer">3x2</span>

              <div className="quantity-selector">
                <label>Cantidad:</label>
                <input
                  type="number"
                  min="1"
                  value={quantities[product.id_producto] || 1}
                  onChange={(e) => handleQuantityChange(product.id_producto, e.target.value)}
                />
              </div>

              <button className="buy-now-btn" onClick={() => handleBuyNow(product)}>
                Comprar ahora
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
