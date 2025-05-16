import React, { useState, useEffect } from 'react';
import LoadingScreen from '../pages/LoadingScreen';
import './UserProfile.css';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const navigate = useNavigate();
    const [clientData, setClientData] = useState(null);
    const [editData, setEditData] = useState({});
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [loadingClientData, setLoadingClientData] = useState(true); // Estado de carga para los datos del cliente

    useEffect(() => {
        const fetchClientData = async () => {
            try {
                const storedUsername = localStorage.getItem('username');
                if (!storedUsername) {
                    throw new Error("No se encontró el nombre de usuario.");
                }
    
                const token = localStorage.getItem('token');
                const response = await fetch(`https://farmouse.onrender.com/user/getByName/${storedUsername}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
    
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Error al obtener los datos del cliente');
                }
    
                const data = await response.json();
                console.log("Datos del cliente:", data); // Verifica los datos que estás recibiendo de la API
    
                // Asignamos los datos contenidos en `data` al estado
                setClientData(data.data);  // Ahora se asigna la propiedad `data` de la respuesta
                setEditData(data.data);
                localStorage.setItem('idClienteid', data.data.id_usuario);  // Usamos 'id_usuario' para almacenar el id
    
            } catch (error) {
                setError(error.message);
                console.error("Error en fetchClientData:", error);
            } finally {
                setLoadingClientData(false);  // Cambia el estado de carga a falso al finalizar
            }
        };
    
        fetchClientData();
    }, []);
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSaveChanges = async () => {
        try {
            if (!clientData) {
                throw new Error("No se encontró la información del cliente");
            }

            const clientId = clientData.id_usuario;
            const token = localStorage.getItem('token');

            const response = await fetch(`https://farmouse.onrender.com/user/${clientId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nombre: editData.nombre,
                    apellido: editData.apellido,
                    direccion: editData.direccion,
                    telefono: parseInt(editData.telefono),
                    nombre_usuario: editData.nombre_usuario,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al actualizar los datos del cliente');
            }

            const updatedData = await response.json();
            setClientData(updatedData);
            setIsEditing(false);  // Salimos del modo de edición
        } catch (error) {
            console.error("Error en la actualización:", error);
            setError(error.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/Login');
    };

    if (error) return <div>Error: {error}</div>;

    if (loadingClientData) return <LoadingScreen />;

    return clientData ? (
        <div className="user-profile">
            <button
                className="btn-back"
                onClick={() => navigate('/')}
                style={{ position: 'absolute', top: '10px', left: '10px' }}>
                Ir a Inicio
            </button>
    
            <h2>Perfil del Cliente</h2>
    
            {isEditing ? (
                <>
                    <input
                        type="text"
                        name="nombre"
                        value={editData.nombre || ''}
                        onChange={handleInputChange}
                        placeholder="Nombre"
                    />
                    <input
                        type="text"
                        name="apellido"
                        value={editData.apellido || ''}
                        onChange={handleInputChange}
                        placeholder="Apellido"
                    />
                    <input
                        type="email"
                        name="correo"
                        value={editData.correo || ''}
                        onChange={handleInputChange}
                        placeholder="Correo"
                    />
                    <input
                        type="text"
                        name="direccion"
                        value={editData.direccion || ''}
                        onChange={handleInputChange}
                        placeholder="Dirección"
                    />
                    <input
                        type="text"
                        name="telefono"
                        value={editData.telefono || ''}
                        onChange={handleInputChange}
                        placeholder="Teléfono"
                    />
                    <input
                        type="text"
                        name="nombre_usuario"
                        value={editData.nombre_usuario || ''}
                        onChange={handleInputChange}
                        placeholder="Nombre de Usuario"
                    />
    
                    <button onClick={handleSaveChanges}>Guardar cambios</button>
                    <button onClick={() => setIsEditing(false)}>Cancelar</button>
                </>
            ) : (
                <>
                    <p>Nombre: {clientData.nombre}</p>
                    <p>Apellido: {clientData.apellido}</p>
                    <p>Correo: {clientData.correo}</p>
                    <p>Dirección: {clientData.direccion}</p>
                    <p>Teléfono: {clientData.telefono}</p>
                    <p>Nombre de Usuario: {clientData.nombre_usuario}</p>
    
                    <button onClick={() => setIsEditing(true)}>Editar perfil</button>
                    <button
                        className="btn-logout"
                        onClick={handleLogout}
                        style={{ position: 'absolute', top: '10px', right: '10px' }}>
                        Cerrar Sesión
                    </button>
                </>
            )}
        </div>
    ) : (
        <LoadingScreen /> // Pantalla de carga cuando los datos aún no están disponibles
    );
    
};

export default UserProfile;
