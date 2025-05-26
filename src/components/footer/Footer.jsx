import React, { useState } from "react";
import './footer.css';

import { Container } from "reactstrap";
import { FaFileAlt, FaCreditCard, FaShieldAlt, FaComments, FaFileInvoice } from "react-icons/fa";

import bolaImage from '../../assets/images/bola.png';
import cameoVideo from '../../assets/images/cameo.mp4';

const footerItems = [
  {
    icon: <FaFileAlt className="footer__icon" />,
    title: "Cambios y devoluciones",
    text: <>Revisa <a href="#">Términos y condiciones</a> y <a href="#">Política de privacidad</a>.</>,
  },
  {
    icon: <FaCreditCard className="footer__icon" />,
    title: "Formas de Pago",
    text: <>Distintas opciones de pago con total seguridad.</>,
  },
  {
    icon: <FaShieldAlt className="footer__icon" />,
    title: "Compra 100% segura",
    text: <>Tus compras están totalmente protegidas.</>,
    addImage: true,
  },
  {
    icon: <FaComments className="footer__icon" />,
    title: "Centros de ayuda",
    text: <>Contáctanos vía whatsapp <br /> <a href="tel:+5525951595">55 2595 1595</a>.</>,
  },
  {
    icon: <FaFileInvoice className="footer__icon" />,
    title: "Facturación Electrónica",
    text: <>Obtén tu <a href="#">factura electrónica</a> de manera rápida y confiable.</>,
  },
];

const Footer = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <>
      <footer className="footer">
        <div className="footer__top">
          <Container style={{ padding: 0, maxWidth: '1200px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
              {footerItems.map((item, i) => (
                <div key={i} className="footer__item">
                  {item.icon}
                  <h5 className="footer__title">{item.title}</h5>
                  <p className="footer__text">{item.text}</p>
                  {item.addImage && (
                    <img
                    src={bolaImage}
                    alt="bola"
                    style={{
                      width: '40px',
                      marginTop: '8px',
                      display: 'block',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      cursor: 'pointer',
                    }}
                    onDoubleClick={openModal}  // Cambiado aquí a doble click
                  />
                  
                  )}
                </div>
              ))}
            </div>
          </Container>
        </div>
      </footer>

      {modalOpen && (
        <div
          className="modal-overlay"
          onClick={closeModal}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              background: '#fff',
              padding: '10px',
              borderRadius: '8px',
              maxWidth: '90vw',
              maxHeight: '80vh',
            }}
          >
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                background: 'transparent',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
              }}
              aria-label="Cerrar modal"
            >
              &times;
            </button>
            <video
              src={cameoVideo}
              controls
              autoPlay
              style={{ maxWidth: '100%', maxHeight: '70vh', borderRadius: '6px' }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
