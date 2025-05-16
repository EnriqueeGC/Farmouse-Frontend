import React from "react";
import './footer.css';

import { Container, Row, Col, ListGroup, ListGroupItem } from "reactstrap";
import logo from "../../assets/images/Logo.png";

const footerQuickLinks = [
  {
    display: "Terms & Conditions",
    url: "#",
  },
  {
    display: "Privacy Policy",
    url: "#",
  },
  {
    display: "Return to Terms & Conditions",
    url: "#",
  },
  {
    display: "Payment Method",
    url: "#",
  },
];

const footerLinks = [
  {
    display: "MENÚ",
    url: "/menu-pack",
  },
  {
    display: "RESERVAS",
    url: "/reservas",
  },
  {
    display: "SUCURSALES",
    url: "/sucursales",
  },
  {
    display: "AYUDA",
    url: "/Ayuda",
  },
];

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__top">
        <Container>
          <Row>
            <Col lg="4" md="4" sm="6">
              <div
                className="logo"
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <img src={logo} alt="Federico Fazbear Logo" />
                <h2 className=" d-flex align-items-center gap-1 mb-4">
                  Farmacias Dr Goku
                </h2>
              </div>
              <p>
                Nada paso en nuestros locales entre 1983 y 1987, dejen de
                preguntar por favor.
              </p>
            </Col>

            <Col lg="2" md="4" sm="6">
              <h5 className="footer__link-title">Info Links</h5>
              <ListGroup>
                {footerQuickLinks.map((item, index) => (
                  <ListGroupItem key={index} className="link__item">
                    <a href={item.url}>{item.display}</a>
                  </ListGroupItem>
                ))}
              </ListGroup>
            </Col>

            <Col lg="2" md="4" sm="6">
              <h5 className="footer__link-title">Quick Links</h5>
              <ListGroup>
                {footerLinks.map((item, index) => (
                  <ListGroupItem key={index} className="link__item">
                    <a href={item.url}>{item.display}</a>
                  </ListGroupItem>
                ))}
              </ListGroup>
            </Col>

            <Col lg="2" md="4" sm="6">
              <h5 className="footer__link-title">Contact</h5>
              <ListGroup>
                <ListGroupItem className="link__item d-flex align-items-center gap-3">
                  <i className="ri-map-pin-line"></i> Sylhet, Bangladesh{" "}
                </ListGroupItem>

                <ListGroupItem className="link__item d-flex align-items-center gap-3">
                  <i className="ri-mail-line"></i> example@gmail.com{" "}
                </ListGroupItem>

                <ListGroupItem className="link__item d-flex align-items-center gap-3">
                  <i className="ri-phone-line"></i> +502 4485 1818
                </ListGroupItem>
              </ListGroup>
            </Col>
          </Row>
        </Container>
      </div>
      <div className="footer__bottom">
        <Container>
          <Row>
            <Col lg="12">
              <p>
                copyright 2025, developed by Farmacias Dr Goku. All rights
                reserved
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
