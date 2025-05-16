import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CrearClienteForm from './CrearClienteForm.jsx';
import './LoginStyles.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [error, setError] = useState('');
    const [showRegister, setShowRegister] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('https://farmouse.onrender.com/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    nombre_usuario: username, 
                    contrasenia: password 
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setToken(data.token);
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', username);

                try {
                    const responseId = await fetch(`https://farmouse.onrender.com/user/getByName/${username}`, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (!responseId.ok) {
                        throw new Error(`Error en la solicitud: ${responseId.status}`);
                    }

                    const apiId = await responseId.json();
                    localStorage.setItem('idLogeado', apiId.id_usuario); 
                    console.log("ID del cliente:", localStorage.getItem('idLogeado'));
                } catch (error) {
                    console.error('Error al obtener el Id del cliente:', error);
                }

                navigate('/user-profile');
            } else {
                setError(data.error || 'Error al iniciar sesión');
            }
        } catch (error) {
            setError('Ocurrió un problema al conectar con el servidor.');
        }
    };

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('username');
    };

    const handleBackToHomeClick = () => navigate('/');
    const handleProfileRedirect = () => token && navigate('/user-profile');
    const toggleRegisterForm = () => setShowRegister(!showRegister);

    return (
        <div className="login-container">
            <div className="back-button">
                <button onClick={handleBackToHomeClick}>Volver a Inicio</button>
            </div>
            <div className="form-wrapper">
                <h2>Farmacias Dr Goku</h2>

                {!token ? (
                    <div className="form-container">
                        <form onSubmit={handleLogin}>
                            <div className="form-group">
                                <label>Nombre de Usuario</label>
                                <input
                                    type="text"
                                    placeholder="Ingresa tu nombre de usuario"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Contraseña</label>
                                <input
                                    type="password"
                                    placeholder="Ingresa tu contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            {error && <div className="error-message">{error}</div>}
                            <button type="submit" className="login-button">Iniciar sesión</button>
                        </form>
                        <button onClick={toggleRegisterForm} className="register-button">
                            {showRegister ? 'Cancelar Registro' : 'Crear Cuenta'}
                        </button>
                        {showRegister && <CrearClienteForm />}
                    </div>
                ) : (
                    <div className="session-info">
                        <h2>Sesión iniciada</h2>
                        <button onClick={handleProfileRedirect} className="profile-button">
                            Perfil
                        </button>
                        <button onClick={handleLogout} className="logout-button">
                            Cerrar sesión
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
