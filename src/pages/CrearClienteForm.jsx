import React, { useState } from 'react';
import axios from 'axios';
import './NuevoRegistro.css'; // Asegúrate de que este archivo contenga los nuevos estilos actualizados

const CrearClienteForm = () => {
    const [formData, setFormData] = useState({
        correo: '',
        nombre: '',
        apellido: '',
        direccion: '',
        telefono: '',
        nombre_usuario: '',
        contrasenia: '',
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            // Haciendo la solicitud para crear el usuario
            const response = await axios.post('https://farmouse.onrender.com/user/', {
                nombre: formData.nombre,
                correo: formData.correo,
                apellido: formData.apellido,
                direccion: formData.direccion,
                telefono: formData.telefono,
                nombre_usuario: formData.nombre_usuario,
                contrasenia: formData.contrasenia,
                rol: 3, // Rol siempre será 3
            });

            setMessage(response.data.message);
            setFormData({
                correo: '',
                nombre: '',
                apellido: '',
                direccion: '',
                telefono: '',
                nombre_usuario: '',
                contrasenia: '',
            });
        } catch (err) {
            setError('Error al crear Cliente y Usuario');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-wrapper"> {/* Estilos actualizados para coincidir con el login */}
            <h2>Crear Cliente y Usuario</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Correo</label>
                    <input
                        type="email"
                        name="correo"
                        value={formData.correo}
                        onChange={handleChange}
                        placeholder="Correo"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Nombre</label>
                    <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        placeholder="Nombre"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Apellido</label>
                    <input
                        type="text"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                        placeholder="Apellido"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Dirección</label>
                    <input
                        type="text"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleChange}
                        placeholder="Dirección"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Teléfono</label>
                    <input
                        type="text"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        placeholder="Teléfono"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Nombre de Usuario</label>
                    <input
                        type="text"
                        name="nombre_usuario"
                        value={formData.nombre_usuario}
                        onChange={handleChange}
                        placeholder="Nombre de Usuario"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Contraseña</label>
                    <input
                        type="password"
                        name="contrasenia"
                        value={formData.contrasenia}
                        onChange={handleChange}
                        placeholder="Contraseña"
                        required
                    />
                </div>
                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Creando...' : 'Crear Cliente y Usuario'}
                </button>
            </form>

            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default CrearClienteForm;
