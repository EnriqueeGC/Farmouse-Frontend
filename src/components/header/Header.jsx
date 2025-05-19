import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import "./header.css";
import { useRef } from "react";
import { Container } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../cart/CartContext";
import logo from "../../assets/images/logo2.png";
import respiratorio from "../../assets/images/aparato-respiratorio.png";
import gastro from "../../assets/images/gastrointestinal.png";
import analgesia from "../../assets/images/analgesia.png";
import suple from "../../assets/images/suplementos.png";
import diagnostico from "../../assets/images/diagnostico.png";
import belleza from "../../assets/images/belleza.png";
import gota from "../../assets/images/gota.png";
import depo from "../../assets/images/deportistas.png";
import sex from "../../assets/images/sexo.png";
import peso from "../../assets/images/peso.png";
import bebes from "../../assets/images/bebes.png";
import med from "../../assets/images/medicamentos.png";
import rehi from "../../assets/images/rehidratantes.png";
import sov from "../../assets/images/souvenirs.png";
import cart from "../../assets/images/carrito.png";
import log from "../../assets/images/user.png";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"; // Cambiado de Map a MapContainer

import SubmenuSubcategorias from "../subCategory/SubMenuSubCategory.jsx";

const navLinks = [
  {
    label: "Aparato respiratorio",
    id: "21",
    imgSrc: respiratorio,
    color: "#F68B1E",
  },
  {
    label: "Funcionamiento Gastrointestinal",
    imgSrc: gastro,
    color: "#F286A8",
    url: "/reservas",
    id: "22",
  },
  {
    label: "Analgesia",
    id: "23",
    imgSrc: analgesia,
    color: "#ED1C24",
    url: "/sucursales",
  },
  {
    label: "Suplementos y Multivitaminicos",
    id: "24",
    imgSrc: suple,
    color: "#9A2023",
    url: "/ayuda",
  },
  {
    label: "Higiene, curacion y diagnostico",
    imgSrc: diagnostico,
    color: "#ED1C24",
    url: "/menu-pack",
    id: "41",
  },
  {
    label: "Belleza",
    imgSrc: belleza,
    color: "#000000",
    url: "/reservas",
    id: "42",
  },
  {
    label: "Diabetes",
    imgSrc: gota,
    color: "#19B1E7",
    url: "/sucursales",
    id: "61",
  },
  {
    label: "Deportistas",
    imgSrc: depo,
    color: "#454848",
    url: "/ayuda",
    id: "43",
  },
  {
    label: "Salud sexual",
    imgSrc: sex,
    color: "#000000",
    url: "/menu-pack",
    id: "44",
  },
  { label: "Peso", imgSrc: peso, color: "#F26522", url: "/reservas", id: "45" },
  {
    label: "Bebés",
    imgSrc: bebes,
    color: "#98D4BF",
    url: "/sucursales",
    id: "46",
  },
  {
    label: "Medicamentos",
    imgSrc: med,
    color: "#0056A8",
    url: "/ayuda",
    id: "47",
  },
  {
    label: "Rehidratantes",
    imgSrc: rehi,
    color: "#2E3192",
    url: "/menu-pack",
    id: "48",
  },
  {
    label: "Souvenirs",
    imgSrc: sov,
    color: "#088146",
    url: "/reservas",
    id: "49",
  },
];

const Header = () => {
  const { cartItems } = useCart();
  const [modalOpen, setModalOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartUpdated, setCartUpdated] = useState(false);
  const [activeIcon, setActiveIcon] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef();

  const [showSubmenu, setShowSubmenu] = useState(false);
  const [subcategory, setSubcategory] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    if (cartItems.length > 0) {
      setCartUpdated(true);
      const timer = setTimeout(() => {
        setCartUpdated(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [cartItems]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setLoading(false);
        },
        (error) => {
          alert("No se pudo obtener tu ubicación");
          setLoading(false);
        }
      );
    } else {
      alert("La geolocalización no está disponible en tu navegador");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (modalOpen) {
      getUserLocation();
    }
  }, [modalOpen]);

  const handleLoginClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/user-profile");
    } else {
      navigate("/login");
    }
  };

  const handleLocationClick = () => {
    navigate("/seleccionar-ubicacion");
  };

  const toggleModal = () => setModalOpen(!modalOpen);

  const handleMouseEnterSubcategory = async (index, event) => {
    const categoriaId = navLinks[index].id;
    if (!categoriaId) return;
  
    try {
      const response = await fetch(
        `https://farmouse.onrender.com/subcategory/category/${categoriaId}`
      );
      const data = await response.json();
      setSubcategory(data.data);
      setActiveIndex(index); // <- importante
      setShowSubmenu(true);
  
      const iconRect = event.currentTarget.getBoundingClientRect();
      setSubmenuPosition({
        top: iconRect.top + iconRect.height + window.scrollY,
        left: iconRect.left + window.scrollX,
      });
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };
  

  const handleMouseLeave = () => {
    setTimeout(() => {
      setShowSubmenu(false);
      setActiveIndex(null);
    }, 200); // puedes ajustar el tiempo (ms)
  };

  return (
    <header className="header">
      <Container>
        <div className="logo-container">
          <div
            className="logo"
            style={{ display: "flex", alignItems: "center" }}
          >
            <Link to="/">
              <img
                src={logo}
                alt="Federico Fazbear Logo"
                style={{ width: "150px", height: "auto", marginRight: "10px" }}
              />
            </Link>
          </div>
        </div>

        <div className="search-bar">
          <div className="location">
            <i
              className="ri-map-pin-line"
              style={{ fontSize: "1.5rem", color: "white", marginRight: "5px" }}
            ></i>
            {/* Al hacer clic, se redirige a la página de "Seleccionar Ubicación" */}
            <span onClick={handleLocationClick} style={{ cursor: "pointer" }}>
              Seleccionar ubicación
            </span>
          </div>
          <input
            type="text"
            placeholder="¿Qué estás buscando?"
            className="search-input"
          />
          <div className="right-icons">
            <div
              className={`cart__icon ${cartUpdated ? "cart-icon-updated" : ""}`}
            >
              <Link to="/cart">
                <img
                  src={cart}
                  alt="Carrito"
                  style={{ width: "25px", height: "25px" }}
                />
                <span className="cart-count">{cartItems.length}</span>
              </Link>
            </div>
            <div className="login__icon">
              <span onClick={handleLoginClick} style={{ cursor: "pointer" }}>
                <img
                  src={log}
                  alt="Login"
                  style={{ width: "25px", height: "25px" }}
                />
              </span>
            </div>
          </div>
        </div>

        <div className="nav__menu">
          <ul
            className="nav__list"
            style={{ display: "flex", listStyleType: "none" }}
          >
            {navLinks.map((item, index) => (
              <li key={index} className="nav__item">
                <div
                  className="submenu-wrapper"
                  onMouseEnter={(e) => handleMouseEnterSubcategory(index, e)}
                  onMouseLeave={handleMouseLeave}
                  style={{ position: "relative" }}
                >
                  <Link className="nav-button">
                    <div className="icon-button">
                      <img
                        src={item.imgSrc}
                        alt={item.label}
                        style={{ width: "40px", height: "40px" }}
                      />
                    </div>
                  </Link>

                  {showSubmenu && activeIndex === index && (
                    <div
                      className="submenu-popover"
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 1000,
                      }}
                    >
                      {Array.isArray(subcategory) && subcategory.length > 0 ? (
                        <SubmenuSubcategorias subcategorias={subcategory} />
                      ) : (
                        <div
                          className="submenu-container"
                          style={{
                            backgroundColor: "#f5f5f5",
                            color: "#333",
                            padding: "1rem",
                            borderRadius: "8px",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                          }}
                        >
                          <h3>No hay subcategorías disponibles</h3>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      {showDropdown && (
        <div className="dropdown-list">
          {navLinks[activeIcon] && (
            <ul>
              <li>
                <Link to={navLinks[activeIcon].url} style={{ color: "white" }}>
                  Ver más sobre {navLinks[activeIcon].label}
                </Link>
              </li>
            </ul>
          )}
        </div>
      )}

      {/* Modal para seleccionar ubicación */}
      <Modal isOpen={modalOpen} toggle={toggleModal} size="lg">
        <ModalHeader
          toggle={toggleModal}
          style={{ backgroundColor: "#00a9e0", color: "white" }}
        >
          Selecciona un método de entrega
        </ModalHeader>
        <ModalBody>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button color="warning" style={{ flex: 1, marginRight: "10px" }}>
              Entrega a domicilio
            </Button>
            <Button color="secondary" style={{ flex: 1 }}>
              Recoge en tienda
            </Button>
          </div>

          <h5 style={{ marginTop: "20px" }}>
            Selecciona tu ubicación con servicio a domicilio
          </h5>

          <Button
            color="success"
            block
            onClick={getUserLocation}
            style={{ marginTop: "10px" }}
          >
            Utiliza tu ubicación actual
          </Button>

          {loading ? (
            <div>Cargando ubicación...</div>
          ) : userLocation ? (
            <MapContainer
              center={userLocation}
              zoom={15}
              style={{ width: "100%", height: "400px" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={userLocation}>
                <Popup>Tu ubicación actual.</Popup>
              </Marker>
            </MapContainer>
          ) : (
            <div>No se pudo determinar tu ubicación.</div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>
    </header>
  );
};

export default Header;
