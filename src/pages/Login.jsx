import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CrearClienteForm from './CrearClienteForm'; // Asegúrate de tener este componente correctamente
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
            const response = await fetch('https://farmouse.onrender.com/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            try{
                const responseId = await fetch(`https://federico-fazbear.onrender.com/api/cliente/${username}`, {
                    headers: {
                        'Content-Type': 'application/json', // Útil si tu API espera JSON
                        // Añade otras cabeceras aquí si es necesario
                    },
                });

                if (!responseId.ok) {
                    throw new Error(`Error en la solicitud: ${response.status}`);
                }
            
            
            const apiId = await responseId.json(); // Parseo de la respuesta en JSON
            console.log(apiId.idCliente);
            localStorage.setItem('idLogeado',apiId.idCliente);
            console.log(localStorage.getItem('idLogeado')); // Aquí puedes trabajar con `apiId`
            } catch {
                console.error('Error al obtener el Id del cliente:', error);
            }



            if (response.ok) {
                setToken(data.token);
                localStorage.setItem('token', data.token);
                localStorage.setItem('correoCliente', username);
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
        localStorage.removeItem('correoCliente');
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
                                <label>Correo</label>
                                <input
                                    type="text"
                                    placeholder="Ingresa tu correo"
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
