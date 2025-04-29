import React, { useRef, useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import "./header.css";
import { Container } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../cart/CartContext.jsx";
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
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import SubmenuSubcategorias from "../subCategory/SubMenuSubCategory.jsx";

const navLinks = [
  {
    label: "Aparato respiratorio",
    id: "21",
    imgSrc: respiratorio,
    color: "#F68B1E",
  },
  {
    label: "Gastrointestinal",
    imgSrc: gastro,
    color: "#F286A8",
    url: "/reservas",
    id: "",
  },
  {
    label: "Analgesia",
    imgSrc: analgesia,
    color: "#ED1C24",
    url: "/sucursales",
    id: "",
  },
  {
    label: "Suplementos",
    imgSrc: suple,
    color: "#9A2023",
    url: "/ayuda",
    id: "",
  },
  {
    label: "Diagnóstico",
    imgSrc: diagnostico,
    color: "#ED1C24",
    url: "/menu-pack",
    id: "",
  },
  {
    label: "Belleza",
    imgSrc: belleza,
    color: "#000000",
    url: "/reservas",
    id: "",
  },
  { label: "Gota", imgSrc: gota, color: "#19B1E7", url: "/sucursales", id: "" },
  {
    label: "Deportistas",
    imgSrc: depo,
    color: "#454848",
    url: "/ayuda",
    id: "",
  },
  { label: "Sexo", imgSrc: sex, color: "#000000", url: "/menu-pack", id: "" },
  { label: "Peso", imgSrc: peso, color: "#F26522", url: "/reservas", id: "" },
  {
    label: "Bebés",
    imgSrc: bebes,
    color: "#98D4BF",
    url: "/sucursales",
    id: "",
  },
  {
    label: "Medicamentos",
    imgSrc: med,
    color: "#0056A8",
    url: "/ayuda",
    id: "",
  },
  {
    label: "Rehidratantes",
    imgSrc: rehi,
    color: "#2E3192",
    url: "/menu-pack",
    id: "",
  },
  {
    label: "Souvenirs",
    imgSrc: sov,
    color: "#088146",
    url: "/reservas",
    id: "",
  },
];

const Header = () => {
  const { cartItems } = useCart();
  const [modalOpen, setModalOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartUpdated, setCartUpdated] = useState(false);
  const [activeIcon, setActiveIcon] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false); // Estado para manejar la visibilidad del dropdown
  const navigate = useNavigate();
  const menuRef = useRef();

  const [subcategory, setSubcategory] = useState([]);
  const [showSubmenu, setShowSubmenu] = useState(false);

  const menuToggle = () => {
    menuRef.current.classList.toggle("active__menu");
  };

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

  const toggleModal = () => setModalOpen(!modalOpen);

  const handleIconClick = (index, event) => {
    setActiveIcon(activeIcon === index ? null : index);
    setShowDropdown(!showDropdown);

    // Obtén la posición del ícono clicado
    const iconPosition = event.target.getBoundingClientRect();
    const dropdown = document.querySelector(".dropdown-list");

    // Ajustamos la posición del dropdown
    dropdown.style.top = `${iconPosition.bottom + window.scrollY}px`; // Calculamos la posición vertical
    dropdown.style.left = `${iconPosition.left}px`; // Alineamos a la izquierda del ícono
  };

  console.log("id", navLinks[0].id);
  console.log("lavel", navLinks[0].label);

  const handleIconClickSubcategory = async (index) => {
    const categoriaId = navLinks[index].id;
    console.log("ID de la categoría:", categoriaId);

    try {
      const response = await fetch(
        `http://localhost:3000/subcategory/category/${categoriaId}`
      );
      const data = await response.json();
      setSubcategory(data.data);
      setShowSubmenu(true);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const hasSubcategories = Array.isArray(subcategory) && subcategory.length > 0;


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
            <span onClick={toggleModal} style={{ cursor: "pointer" }}>
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
                <i
                  className="ri-shopping-cart-line"
                  style={{ fontSize: "1.5rem", color: "white" }}
                ></i>
                <span className="cart-count">{cartItems.length}</span>
              </Link>
            </div>
            <div className="login__icon">
              <span onClick={handleLoginClick} style={{ cursor: "pointer" }}>
                <i
                  className="ri-user-line"
                  style={{ fontSize: "1.5rem", color: "white" }}
                ></i>
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
              <li className="nav__item" key={index}>
                <div>
                  <Link
                    onClick={() => handleIconClickSubcategory(index)}
                    className="nav-button"
                  >
                    <div className="icon-button">
                      <img
                        src={item.imgSrc}
                        alt={item.label}
                        style={{ width: "40px", height: "40px" }}
                      />
                    </div>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {showSubmenu &&
          (hasSubcategories ? (
            <SubmenuSubcategorias subcategorias={subcategory} />
          ) : (
            <p>No hay subcategorías disponibles.</p>
          ))}
      </Container>

      {/* Lista desplegable debajo del header */}

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
