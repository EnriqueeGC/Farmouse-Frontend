import React, { useState, useEffect } from 'react';
import LoadingScreen from '../pages/LoadingScreen';
import './UserProfile.css';
import { useNavigate } from 'react-router-dom';
import defaultProfile from "../assets/images/Def.jpg";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

const UserProfile = () => {
  const navigate = useNavigate();
  const [clientData, setClientData] = useState(null);
  const [editData, setEditData] = useState({});
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loadingClientData, setLoadingClientData] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImagePreview, setSelectedImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchClientData = async () => {
      const storedUsername = localStorage.getItem('username');
      const token = localStorage.getItem('token');

      if (!storedUsername || !token) {
        navigate('/login');
        return;
      }

      try {
        const res = await fetch(
          `https://farmouse.onrender.com/user/getByName/${storedUsername}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || 'Error al obtener datos');
        }
        const { data } = await res.json();
        setClientData(data);
        setEditData(data);
        localStorage.setItem('id_usuario', data.id_usuario);
      } catch (e) {
        console.error('Error al obtener perfil:', e.message);
        setError(e.message);
      } finally {
        setLoadingClientData(false);
      }
    };

    fetchClientData();
  }, [navigate]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImagePreview(reader.result);
      setEditData(prev => ({ ...prev, url_imagen: reader.result }));
    };
    reader.readAsDataURL(file);
    setSelectedFile(file);
  };

  const handleSaveChanges = async () => {
    try {
      const clientId = localStorage.getItem('id_usuario');
      const token = localStorage.getItem('token');
      if (!clientId || !token) throw new Error("Datos de sesión incompletos");

      const formData = new FormData();
      ['nombre', 'apellido', 'correo', 'direccion', 'telefono', 'nombre_usuario', 'contrasenia']
        .forEach(key => formData.append(key, editData[key] || ''));

      if (selectedFile) formData.append('url_imagen', selectedFile);

      const response = await fetch(`https://farmouse.onrender.com/user/${clientId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const errMsg = (await response.json()).message || 'Error al actualizar usuario';
        throw new Error(errMsg);
      }

      const { data: updated } = await response.json();
      setClientData(updated);
      setEditData(updated);
      setIsEditing(false);
      setSelectedFile(null);
      setSelectedImagePreview(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const openImageModal = () => {
    setSelectedImagePreview(editData.url_imagen || null);
    setShowImageModal(true);
  };
  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImagePreview(null);
    setSelectedFile(null);
  };

  if (error) return <div>Error: {error}</div>;
  if (loadingClientData) return <LoadingScreen />;

  const ImageModal = () => (
    <div className="image-modal">
      
      <div className="image-modal-content">
        <h3>Editar imagen del perfil</h3>
        <div className="image-preview">
          {selectedImagePreview
            ? <img src={selectedImagePreview} alt="Vista previa" />
            : <div className="no-image">Sin imagen</div>}
        </div>
        <input type="file" accept=".png,.jpg,.jpeg" onChange={handleImageChange} />
        <div className="image-hint">Imagen (máx 5MB, formatos .png/.jpg)</div>
        <button onClick={closeImageModal}>Cancelar</button>
        <button onClick={() => setShowImageModal(false)} disabled={!selectedFile}>Guardar imagen</button>
      </div>
    </div>
  );

  return (
    <>
    <Header />
    <div className="user-profile-wrapper">
      
      <div className="user-profile">
        <button className="btn-back" onClick={() => navigate('/')}>
          Ir a Inicio
        </button>
        <button className="btn-logout" onClick={handleLogout}>
          Cerrar Sesión
        </button>

        <div className="profile-image-container">
          <img
            src={editData.url_imagen || defaultProfile}
            alt="Foto de perfil"
          />
          {isEditing && (
            <button className="edit-photo-button" onClick={openImageModal}>
              <i className="ri-pencil-line" />
            </button>
          )}
        </div>

        {isEditing ? (
          <>
            <input type="text" name="nombre" value={editData.nombre || ''} onChange={handleInputChange} placeholder="Nombre" />
            <input type="text" name="apellido" value={editData.apellido || ''} onChange={handleInputChange} placeholder="Apellido" />
            <input type="email" name="correo" value={editData.correo || ''} onChange={handleInputChange} placeholder="Correo" />
            <input type="text" name="direccion" value={editData.direccion || ''} onChange={handleInputChange} placeholder="Dirección" />
            <input type="text" name="telefono" value={editData.telefono || ''} onChange={handleInputChange} placeholder="Teléfono" />
            <input type="text" name="nombre_usuario" value={editData.nombre_usuario || ''} onChange={handleInputChange} placeholder="Nombre de Usuario" />
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
          </>
        )}

        {showImageModal && <ImageModal />}
      </div>
    </div>
        <Footer/>
    </>
  );
};

export default UserProfile;
