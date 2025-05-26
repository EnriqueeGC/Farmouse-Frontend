import { useEffect, useState } from "react";
import axios from "axios";
import "./admin-panel.css";

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    direccion: "",
    telefono: "",
    nombre_usuario: "",
    contrasenia: "",
    url_imagen: null,
    rol: "",
  });
  const [editId, setEditId] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const obtenerUsuarios = async () => {
    try {
      const res = await axios.get("https://farmouse.onrender.com/user");
      setUsuarios(res.data.data || []);
    } catch (err) {
      console.error("❌ Error al obtener usuarios:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "url_imagen" && files.length > 0) {
      setForm({ ...form, url_imagen: files[0] });
      setImagenPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData();

  // 🧠 Garantizar que el rol sea enviado correctamente
  data.append("rol", form.rol);
  console.log("Rol seleccionado:", form.rol);

  for (let key in form) {
    if (form[key] !== null && key !== "rol") {
      data.append(key, form[key]);
    }
  }

  try {
    if (editId) {
      await axios.put(`https://farmouse.onrender.com/user/${editId}`, data);
    } else {
      await axios.post("https://farmouse.onrender.com/user", data);
    }
    obtenerUsuarios();
    resetForm();
  } catch (err) {
    console.error("❌ Error al guardar usuario:", err);
    alert("Error al guardar usuario: " + (err.response?.data?.message || "desconocido"));
  }
};


  const handleEdit = (usuario) => {
    setForm({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      direccion: usuario.direccion,
      telefono: usuario.telefono,
      nombre_usuario: usuario.nombre_usuario,
      contrasenia: "",
      url_imagen: null,
      rol: usuario.rol,
    });
    setImagenPreview(usuario.url_imagen || null);
    setEditId(usuario.id_usuario);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      await axios.delete(`https://farmouse.onrender.com/user/${id}`);
      obtenerUsuarios();
    } catch (err) {
      console.error("❌ Error al eliminar usuario:", err);
    }
  };

  const resetForm = () => {
    setForm({
      nombre: "",
      apellido: "",
      correo: "",
      direccion: "",
      telefono: "",
      nombre_usuario: "",
      contrasenia: "",
      url_imagen: null,
      rol: "",
    });
    setImagenPreview(null);
    setEditId(null);
  };

  const usuariosFiltrados = usuarios.filter((u) =>
    u.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    u.correo.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h2 className="admin-title">Administrar Usuarios</h2>

        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nombre o correo"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="admin-form-card">
          <h4>{editId ? "Editar Usuario" : "Crear Nuevo Usuario"}</h4>
          <div className="row g-4">
            <div className="col-md-6 col-lg-4">
              <input type="text" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" className="form-control" required />
            </div>
            <div className="col-md-6 col-lg-4">
              <input type="text" name="apellido" value={form.apellido} onChange={handleChange} placeholder="Apellido" className="form-control" required />
            </div>
            <div className="col-md-6 col-lg-4">
              <input type="email" name="correo" value={form.correo} onChange={handleChange} placeholder="Correo" className="form-control" required />
            </div>
            <div className="col-md-6 col-lg-4">
              <input type="text" name="direccion" value={form.direccion} onChange={handleChange} placeholder="Dirección" className="form-control" required />
            </div>
            <div className="col-md-6 col-lg-4">
              <input type="text" name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" className="form-control" required />
            </div>
            <div className="col-md-6 col-lg-4">
              <input type="text" name="nombre_usuario" value={form.nombre_usuario} onChange={handleChange} placeholder="Usuario" className="form-control" required />
            </div>
            <div className="col-md-6 col-lg-4">
              <input type="password" name="contrasenia" value={form.contrasenia} onChange={handleChange} placeholder="Contraseña" className="form-control" required={!editId} />
            </div>
            <div className="col-md-6 col-lg-4">
              <select name="rol" value={form.rol} onChange={handleChange} className="form-select" required>
                <option value="">Selecciona un rol</option>
                <option value="cliente">Cliente</option>
                <option value="admin">Administrador</option>
                <option value="farmaceutico">Farmacéutico</option>
              </select>
            </div>
            <div className="col-md-6 col-lg-4">
              <input type="file" name="url_imagen" onChange={handleChange} className="form-control" accept="image/*" />
            </div>
            {imagenPreview && (
              <div className="col-md-6 col-lg-4">
                <img src={imagenPreview} alt="Preview" className="img-thumbnail" style={{ height: "80px", objectFit: "cover", borderRadius: "8px" }} />
              </div>
            )}
            <div className="col-12 d-flex gap-2">
              <button type="submit" className={`btn ${editId ? "btn-warning" : "btn-success"}`}>
                {editId ? "Actualizar" : "Crear"}
              </button>
              {editId && (
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancelar edición
                </button>
              )}
            </div>
          </div>
        </form>

        <div className="table-responsive">
          <table className="table table-hover table-striped align-middle border">
            <thead className="table-primary text-center">
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Teléfono</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map((u) => (
                <tr key={u.id_usuario}>
                  <td className="text-center">
                    {u.url_imagen && <img src={u.url_imagen} alt={u.nombre} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "50%" }} />}
                  </td>
                  <td>{u.nombre} {u.apellido}</td>
                  <td>{u.correo}</td>
                  <td>{u.nombre_usuario}</td>
                  <td>
                    <span className={`badge bg-${u.rol === 'admin' ? 'danger' : u.rol === 'farmaceutico' ? 'info' : 'success'}`}>
                      {u.rol}
                    </span>
                  </td>
                  <td>{u.telefono}</td>
                  <td>
                    <div className="d-flex gap-2 justify-content-center">
                      <button onClick={() => handleEdit(u)} className="btn btn-sm btn-outline-primary">Editar</button>
                      <button onClick={() => handleDelete(u.id_usuario)} className="btn btn-sm btn-outline-danger">Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
              {usuariosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">
                    No hay usuarios que coincidan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminUsuarios;
