import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CrearClienteForm from "./CrearClienteForm.jsx";
import "./LoginStyles.css";
import logoImg from "../assets/images/Logo.png";

const Login = () => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("https://farmouse.onrender.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre_usuario: username.trim().toLowerCase(),
          contrasenia: password.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const usuario = data.data;
        localStorage.setItem("token", usuario.token);
        localStorage.setItem("username", usuario.nombre_usuario);
        localStorage.setItem("idLogeado", usuario.id_usuario);
        localStorage.setItem("rol", usuario.rol);

        // acceder al rol del usuario por el almacenamiento local

        // Redirigir al perfil del admin
        if (usuario.rol === "Admin") {
          navigate("/admin");
          console.log("Rol del usuario:", usuario.rol);
        } else if (usuario.rol === "Cliente") {
          navigate("/user-profile");
        }
      } else {
        setError(data.message || "Error al iniciar sesión");
      }
    } catch (error) {
      setError("Ocurrió un problema al conectar con el servidor.");
    }
  };

  const handleBackToHomeClick = () => {
    navigate("/");
  };

  return (
    <div className="login-page">
      <div
        className={`login-container ${
          isRightPanelActive ? "right-panel-active" : ""
        }`}
      >
        <div className="form-container sign-in-container">
          <form onSubmit={handleLogin}>
            <h2>Iniciar Sesión</h2>
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <span className="error-message">{error}</span>}
            <button type="submit">Iniciar Sesión</button>
          </form>
        </div>

        <div className="form-container sign-up-container">
          <CrearClienteForm />
        </div>

        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <img
                src={logoImg}
                alt="Logo de Farmacia"
                className="overlay-image float-rotate"
              />
              <h1>¡Bienvenido de nuevo! Farmacias Doctor Goku</h1>
              <p>Para mantenerse conectado, por favor inicia sesión</p>
              <button
                className="ghost"
                onClick={() => setIsRightPanelActive(false)}
              >
                Iniciar Sesión
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <img
                src={logoImg}
                alt="Logo de Farmacia"
                className="overlay-image float-rotate"
              />
              <h1>Farmacias Doctor Goku</h1>
              <p>Ingresa tus datos y crea tu cuenta</p>
              <button
                className="ghost"
                onClick={() => setIsRightPanelActive(true)}
              >
                Crear Cuenta
              </button>
            </div>
          </div>
        </div>

        <div className="back-button">
          <button onClick={handleBackToHomeClick}>Volver a Inicio</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
