import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../header/Header";
import Footer from "../footer/Footer";

import "./ProductBySubcategory.css";

const ProductBySubcategory = () => {
  const { id_subcategoria } = useParams();
  const [productos, setProductos] = useState([]);
  const [nombreSubcategoria, setNombreSubcategoria] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const productosResponse = await axios.get(
          `https://farmouse.onrender.com/product/subcategoria/${id_subcategoria}`
        );
        setProductos(productosResponse.data.data);

        // Obtener nombre de la subcategoría
        const subcategoriaResponse = await axios.get(
          `https://farmouse.onrender.com/subcategory/${id_subcategoria}`
        );
        setNombreSubcategoria(subcategoriaResponse.data.data.nombre); // Ajusta esto si el JSON tiene otra estructura
      } catch (error) {
        console.error("Error al obtener datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDatos();
  }, [id_subcategoria]);

  if (loading) return <p>Cargando productos...</p>;

  return (
    <div>
      <Header />

      <div className="productos-container">
        <h2 className="titulo-subcategoria">
          <span className="nombre-sub">{nombreSubcategoria}</span>
        </h2>
        <div className="productos-grid">
          {productos.length === 0 ? (
            <p>No hay productos disponibles.</p>
          ) : (
            productos.map((producto) => (
              <div key={producto.id_producto} className="producto-card">
                <img src={producto.url_imagen} alt={producto.nombre} />
                <h3>{producto.nombre}</h3>
                <p>{producto.descripcion}</p>
                <p className="precio">
                  <strong>${producto.precio}</strong>
                </p>
                <button className="btn-comprar">Comprar ahora</button>
              </div>
            ))
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductBySubcategory;
