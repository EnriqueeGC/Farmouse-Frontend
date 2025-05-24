import React, { useState, useEffect } from 'react';
import LoadingScreen from '../pages/LoadingScreen';
import './UserProfile.css';
import { useNavigate } from 'react-router-dom';
import defaultProfile from "../assets/images/Def.jpg";

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
      try {
        const storedUsername = localStorage.getItem('username');
        if (!storedUsername) throw new Error("No se encontró el nombre de usuario.");

        const token = localStorage.getItem('token');
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
        setError(e.message);
      } finally {
        setLoadingClientData(false);
      }
    };
    fetchClientData();
  }, []);

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
      if (!clientId) throw new Error("ID de usuario no encontrado");

      const token = localStorage.getItem('token');
      if (!token) throw new Error("Token no encontrado");

      const formData = new FormData();
      formData.append('nombre', editData.nombre || '');
      formData.append('apellido', editData.apellido || '');
      formData.append('correo', editData.correo || '');
      formData.append('direccion', editData.direccion || '');
      formData.append('telefono', editData.telefono || '');
      formData.append('nombre_usuario', editData.nombre_usuario || '');
      formData.append('contrasenia', editData.contrasenia || '');

      if (selectedFile) {
        formData.append('url_imagen', selectedFile);
      }

      const response = await fetch(`https://farmouse.onrender.com/user/${clientId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          // No especificar Content-Type, fetch lo gestiona solo para FormData
        },
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
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/Login');
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
    <div style={{
      position:'fixed', top:0, left:0, width:'100vw', height:'100vh',
      backgroundColor:'rgba(0,0,0,0.3)', display:'flex',
      justifyContent:'center', alignItems:'center', zIndex:9999
    }}>
      <div style={{
        background:'white', padding:20, borderRadius:8, minWidth:300,
        boxShadow:'0 2px 10px rgba(0,0,0,0.25)', textAlign:'center'
      }}>
        <h3>Editar imagen del perfil</h3>
        <div style={{
          width:100, height:100, borderRadius:8, margin:'auto 0 10px',
          border:'1px solid #ccc', overflow:'hidden',
          display:'flex', justifyContent:'center', alignItems:'center',
          backgroundColor:'#f0f4ff'
        }}>
          {selectedImagePreview
            ? <img src={selectedImagePreview} alt="Vista previa" style={{maxWidth:'100%', maxHeight:'100%'}}/>
            : <div style={{color:'#ccc'}}>Sin imagen</div>
          }
        </div>
        <input
          type="file"
          accept=".png,.jpg,.jpeg"
          onChange={handleImageChange}
          style={{marginBottom:10}}
        />
        <div style={{fontSize:12, color:'#666', marginBottom:20}}>
          Imagen (máx 5MB, formatos .png/.jpg)
        </div>
        <button onClick={closeImageModal} style={{marginRight:10}}>
          Cancelar
        </button>
        <button
          onClick={() => {
            // Cerramos modal porque la imagen ya se guardará junto con los datos
            setShowImageModal(false);
          }}
          disabled={!selectedFile}
        >
          Guardar imagen
        </button>
      </div>
    </div>
  );

  return (
    <div className="user-profile">
      <button
        className="btn-back"
        onClick={() => navigate('/')}
        style={{position:'absolute', top:10, left:10}}
      >
        Ir a Inicio
      </button>

      <div style={{
        position:'relative', display:'inline-block',
        marginBottom:20, textAlign:'center'
      }}>
        <img
          src={editData.url_imagen || defaultProfile}
          alt="Foto de perfil"
          style={{
            width:120, height:120, borderRadius:'50%',
            objectFit:'cover', border:'3px solid #007bff',
            display:'block', margin:'0 auto'
          }}
        />
        {isEditing && (
          <button
            onClick={openImageModal}
            style={{
              position:'absolute', bottom:5, right:5,
              backgroundColor:'#007bff', border:'none',
              borderRadius:'50%', width:32, height:32,
              color:'white', cursor:'pointer',
              boxShadow:'0 2px 6px rgba(0,0,0,0.3)',
              display:'flex', justifyContent:'center',
              alignItems:'center', padding:0
            }}
            title="Editar foto de perfil"
            aria-label="Editar foto de perfil"
          >
            <i className="ri-pencil-line" style={{fontSize:18}}/>
          </button>
        )}
      </div>

      {isEditing ? (
        <>
          <input
            type="text" name="nombre"
            value={editData.nombre||''}
            onChange={handleInputChange}
            placeholder="Nombre"
          />
          <input
            type="text" name="apellido"
            value={editData.apellido||''}
            onChange={handleInputChange}
            placeholder="Apellido"
          />
          <input
            type="email" name="correo"
            value={editData.correo||''}
            onChange={handleInputChange}
            placeholder="Correo"
          />
          <input
            type="text" name="direccion"
            value={editData.direccion||''}
            onChange={handleInputChange}
            placeholder="Dirección"
          />
          <input
            type="text" name="telefono"
            value={editData.telefono||''}
            onChange={handleInputChange}
            placeholder="Teléfono"
          />
          <input
            type="text" name="nombre_usuario"
            value={editData.nombre_usuario||''}
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
            style={{position:'absolute', top:10, right:10}}
          >
            Cerrar Sesión
          </button>
        </>
      )}

      {showImageModal && <ImageModal />}
    </div>
  );
};

export default UserProfile;
