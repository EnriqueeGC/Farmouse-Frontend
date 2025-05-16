import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col } from 'reactstrap';
import Header from '../components/header/Header'; // Importa el Header
import Footer from '../components/footer/Footer'; // Importa el Footer


const MenuPack = () => {
    const [products, setProducts] = useState([]); // Productos desde la API
    const [loading, setLoading] = useState(true); // Estado de carga
    const [error, setError] = useState(null); // Estado de error

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Usamos la misma URL de la API del segundo código
                const response = await axios.get('https://farmouse.onrender.com/product'); // URL del backend
                setProducts(response.data.data); // Guardamos los productos
                setLoading(false); // Cambiamos el estado de carga
            } catch (error) {
                setError('Error al cargar los productos');
                setLoading(false); // En caso de error, cambiamos el estado de carga
            }
        };

        fetchProducts();
    }, []); // Solo se ejecuta una vez al montar el componente

    if (loading) return <LoadingScreen />;
    if (error) return <div>{error}</div>;

    return (
        <>
            <Header />
            <section>
                <Container>
                    <Row>
                        <Col lg="12" className="text-center mb-4">
                            <h3 className="menu__title">Nuestras Cartas</h3>
                        </Col>

                        {/* Mapeamos todos los productos sin filtrado */}
                        {products.map((item) => (
                            <Col lg="3" md="4" sm="6" xs="6" key={item.id_producto} className="mb-4">
                                <div className="product-card">
                                    <img src={item.url_imagen} alt={item.nombre} className="product-image" />
                                    <div className="product-info">
                                        <h3>{item.nombre}</h3>
                                        <p>${parseFloat(item.precio).toFixed(2)}</p>
                                        <span className="offer">3x2</span> {/* Si deseas añadir un texto como "3x2" */}
                                        <button className="buy-now-btn">Comprar ahora</button>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>
            <Footer />
        </>
    );
};

export default MenuPack;
