import React, { useState } from 'react';
import axios from 'axios';
import './NuevoRegistro.css';

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
            const response = await axios.post('https://farmouse.onrender.com/user/', {
                nombre: formData.nombre.trim(),
                correo: formData.correo.trim().toLowerCase(),
                apellido: formData.apellido.trim(),
                direccion: formData.direccion.trim(),
                telefono: formData.telefono.trim(),
                nombre_usuario: formData.nombre_usuario.trim().toLowerCase(),
                contrasenia: formData.contrasenia.trim(),
                rol: 3,
            });

            setMessage(response.data.message || 'Cliente creado exitosamente');
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
        <div className="form-wrapper">
            <h2>Crear Usuario</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Correo</label>
                    <input type="email" name="correo" value={formData.correo} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Nombre</label>
                    <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Apellido</label>
                    <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Dirección</label>
                    <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Teléfono</label>
                    <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Nombre de Usuario</label>
                    <input type="text" name="nombre_usuario" value={formData.nombre_usuario} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Contraseña</label>
                    <input type="password" name="contrasenia" value={formData.contrasenia} onChange={handleChange} required />
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
