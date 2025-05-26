// src/pages/admin/AdminCategorias.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import './admin-panel.css';

function AdminCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchCategorias = async () => {
    try {
      const res = await axios.get("https://farmouse.onrender.com/category");
      setCategorias(res.data?.data || []);
    } catch (error) {
      console.error("❌ Error al cargar categorías:", error);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (nombre.trim().length < 3) {
      alert("El nombre debe tener al menos 3 caracteres.");
      return;
    }

    try {
      if (editId) {
        await axios.put(`https://farmouse.onrender.com/category/${editId}`, { nombre });
      } else {
        await axios.post("https://farmouse.onrender.com/category", { nombre });
      }

      setNombre("");
      setEditId(null);
      fetchCategorias();
    } catch (error) {
      console.error("❌ Error al guardar categoría:", error);
    }
  };

  const handleEdit = (cat) => {
    setNombre(cat.nombre);
    setEditId(cat.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta categoría?")) return;

    try {
      await axios.delete(`https://farmouse.onrender.com/category/${id}`);
      fetchCategorias();
    } catch (error) {
      console.error("❌ Error al eliminar categoría:", error);
    }
  };

  return (
    <div className="admin-page">
      <div className="container">
        <h2 className="admin-title">Administrar Categorías</h2>

        {/* Formulario */}
        <div className="admin-form-card">
          <form onSubmit={handleSubmit}>
            <div className="row g-4 align-items-center">
              <div className="col-md-6">
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Nombre de categoría"
                  className="form-control"
                  required
                />
              </div>
              <div className="col-md-3 d-grid">
                <button type="submit" className={`btn ${editId ? "btn-warning" : "btn-success"}`}>
                  {editId ? "Actualizar" : "Crear"}
                </button>
              </div>
              {editId && (
                <div className="col-md-3 d-grid">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setEditId(null);
                      setNombre("");
                    }}
                  >
                    Cancelar edición
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Tabla */}
        <div className="table-responsive">
          <table className="table table-hover table-striped align-middle border">
            <thead className="table-primary text-center">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((cat) => (
                <tr key={cat.id}>
                  <td>{cat.id}</td>
                  <td>{cat.nombre}</td>
                  <td>
                    <div className="d-flex gap-2 justify-content-center">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleEdit(cat)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(cat.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categorias.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center text-muted py-4">
                    No hay categorías registradas.
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

export default AdminCategorias;
