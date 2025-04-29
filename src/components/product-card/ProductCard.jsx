import React, { useState, useContext } from 'react';
import { CartContext } from '../cart/CartContext';
import './product-card.css';

const ProductCard = (props) => {
    const { nombre, imagen, precio, descripcion } = props.item;
    const { addToCart } = useContext(CartContext);
    const [quantity, setQuantity] = useState(1); // Estado para manejar la cantidad

    const handleAddToCart = () => {
        addToCart({ ...props.item, quantity }); // Añadir al carrito con la cantidad seleccionada
    };

    return (
        <div className="single__product">
            <div className="product__img">
                <img src={imagen} alt={nombre} className="w-100" />
            </div>
            <div className="product__content">
                <div className="rating text-center">
                    <span><i className="ri-star-s-line"></i></span>
                    <span><i className="ri-star-s-line"></i></span>
                    <span><i className="ri-star-s-line"></i></span>
                    <span><i className="ri-star-s-line"></i></span>
                    <span><i className="ri-star-s-line"></i></span>
                </div>
                <h6>{nombre}</h6>
                <div className="d-flex align-items-center justify-content-between">
                    <span className="price d-flex align-items-center">Precio: $ <span>{precio}</span></span>
                    <span className="shopping__icon">
                        <i className="ri-shopping-cart-2-line" onClick={handleAddToCart}></i>
                    </span>
                </div>
                <p>{descripcion}</p>
                
                {/* Selector de cantidad */}
                <div className="quantity-selector d-flex align-items-center mt-2">
                    <label htmlFor={`quantity-${nombre}`} className="me-2">Cantidad:</label>
                    <input
                        type="number"
                        id={`quantity-${nombre}`}
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10)))}
                        className="form-control w-25"
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
