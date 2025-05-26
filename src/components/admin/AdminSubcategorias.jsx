// src/pages/admin/AdminSubcategorias.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import './admin-panel.css'; // ✅ Importa los estilos centralizados

function AdminSubcategorias() {
  const [subcategorias, setSubcategorias] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState({ nombre: "", id_categoria: "" });
  const [editId, setEditId] = useState(null);

  const fetchSubcategorias = async () => {
    try {
      const res = await axios.get("https://farmouse.onrender.com/subcategory");
      setSubcategorias(res.data?.data || []);
    } catch (error) {
      console.error("❌ Error al cargar subcategorías:", error);
    }
  };

  const fetchCategorias = async () => {
    try {
      const res = await axios.get("https://farmouse.onrender.com/category");
      setCategorias(res.data?.data || []);
    } catch (error) {
      console.error("❌ Error al cargar categorías:", error);
    }
  };

  useEffect(() => {
    fetchSubcategorias();
    fetchCategorias();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre || !form.id_categoria) {
      alert("Completa todos los campos.");
      return;
    }

    try {
      if (editId) {
        await axios.put(`https://farmouse.onrender.com/subcategory/${editId}`, form);
      } else {
        await axios.post("https://farmouse.onrender.com/subcategory", form);
      }

      setForm({ nombre: "", id_categoria: "" });
      setEditId(null);
      fetchSubcategorias();
    } catch (error) {
      console.error("❌ Error al guardar subcategoría:", error);
    }
  };

  const handleEdit = (sub) => {
    setForm({ nombre: sub.nombre, id_categoria: sub.id_categoria });
    setEditId(sub.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta subcategoría?")) return;

    try {
      await axios.delete(`https://farmouse.onrender.com/subcategory/${id}`);
      fetchSubcategorias();
    } catch (error) {
      console.error("❌ Error al eliminar subcategoría:", error);
    }
  };

  return (
    <div className="admin-page">
      <div className="container">
        <h2 className="admin-title">Administrar Subcategorías</h2>

        {/* Formulario */}
        <div className="admin-form-card">
          <form onSubmit={handleSubmit}>
            <h4 className="mb-4 fw-bold">
              {editId ? "Editar Subcategoría" : "Crear Nueva Subcategoría"}
            </h4>
            <div className="row g-4 align-items-center">
              <div className="col-md-5">
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Nombre de subcategoría"
                  className="form-control"
                  required
                />
              </div>
              <div className="col-md-4">
                <select
                  name="id_categoria"
                  value={form.id_categoria}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3 d-grid">
                <button
                  type="submit"
                  className={`btn ${editId ? "btn-warning" : "btn-success"}`}
                >
                  {editId ? "Actualizar" : "Crear"}
                </button>
              </div>
              {editId && (
                <div className="col-md-12 mt-3 d-grid">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setForm({ nombre: "", id_categoria: "" });
                      setEditId(null);
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
                <th>ID Categoría</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {subcategorias.map((sub) => (
                <tr key={sub.id}>
                  <td>{sub.id}</td>
                  <td>{sub.nombre}</td>
                  <td>{sub.id_categoria}</td>
                  <td>
                    <div className="d-flex gap-2 justify-content-center">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleEdit(sub)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(sub.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {subcategorias.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center text-muted py-4">
                    No hay subcategorías registradas.
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

export default AdminSubcategorias;
