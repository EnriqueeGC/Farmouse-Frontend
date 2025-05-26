// src/pages/admin/AdminProductos.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import './admin-panel.css'; // ✅ Importa estilos

function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    id_subcategoria: "",
    url_imagen: null,
  });
  const [imagenFile, setImagenFile] = useState(null);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchProductos();
    fetchSubcategorias();
  }, []);

  const fetchProductos = async () => {
    try {
      const res = await axios.get("https://farmouse.onrender.com/product/");
      setProductos(res.data?.data || []);
    } catch (err) {
      console.error("❌ Error al cargar productos:", err);
    }
  };

  const fetchSubcategorias = async () => {
    try {
      const res = await axios.get("https://farmouse.onrender.com/subcategory");
      setSubcategorias(res.data?.data || []);
    } catch (err) {
      console.error("❌ Error al cargar subcategorías:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "url_imagen") {
      setImagenFile(files[0]);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    data.append("nombre", form.nombre);
    data.append("descripcion", form.descripcion);
    data.append("precio", parseFloat(form.precio));
    data.append("stock", parseInt(form.stock, 10));
    data.append("id_subcategoria", parseInt(form.id_subcategoria, 10));
    if (imagenFile) data.append("url_imagen", imagenFile);

    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      if (editId) {
        await axios.put(`https://farmouse.onrender.com/product/${editId}`, data, config);
      } else {
        await axios.post("https://farmouse.onrender.com/product/", data, config);
      }

      setForm({
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
        id_subcategoria: "",
        url_imagen: null,
      });
      setImagenFile(null);
      setEditId(null);
      fetchProductos();
    } catch (err) {
      console.error("❌ Error al guardar producto:", err);
      alert("Error al guardar producto: " + (err.response?.data?.message || "desconocido"));
    }
  };

  const handleEdit = (producto) => {
    setForm({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
      id_subcategoria: producto.id_subcategoria,
      url_imagen: null,
    });
    setImagenFile(null);
    setEditId(producto.id_producto);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;
    try {
      await axios.delete(`https://farmouse.onrender.com/product/${id}`);
      fetchProductos();
    } catch (err) {
      console.error("❌ Error al eliminar producto:", err);
    }
  };

  return (
    <div className="admin-page">
        <div className="admin-container">
        <h2 className="admin-title">Administrar Productos</h2>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="admin-form-card">
          <h4>{editId ? "Editar Producto" : "Crear Nuevo Producto"}</h4>
          <div className="row g-4">
            <div className="col-md-6 col-lg-4">
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Nombre"
                className="form-control"
                required
              />
            </div>
            <div className="col-md-6 col-lg-4">
              <input
                type="text"
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Descripción"
                className="form-control"
                required
              />
            </div>
            <div className="col-md-6 col-lg-2">
              <input
                type="number"
                name="precio"
                value={form.precio}
                onChange={handleChange}
                placeholder="Precio"
                className="form-control"
                required
              />
            </div>
            <div className="col-md-6 col-lg-2">
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="Stock"
                className="form-control"
                required
              />
            </div>
            <div className="col-md-6 col-lg-4">
              <select
                name="id_subcategoria"
                value={form.id_subcategoria}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Selecciona una subcategoría</option>
                {subcategorias.map((sub, index) => (
                  <option key={sub.id_subcategoria || index} value={sub.id_subcategoria}>
                    {sub.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6 col-lg-4">
              <input
                type="file"
                name="url_imagen"
                onChange={handleChange}
                accept="image/*"
                className="form-control"
              />
            </div>
            <div className="col-md-12 col-lg-4 d-grid">
              <button type="submit" className={`btn ${editId ? "btn-warning" : "btn-success"}`}>
                {editId ? "Actualizar" : "Crear"}
              </button>
            </div>
          </div>
        </form>

        {/* Tabla */}
        <div className="table-responsive">
          <table className="table table-hover table-striped align-middle border">
            <thead className="table-primary text-center">
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>ID Subcategoría</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id_producto}>
                  <td className="text-center">
                    {p.url_imagen && (
                      <img
                        src={p.url_imagen}
                        alt={p.nombre}
                        className="img-thumbnail"
                        style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px" }}
                      />
                    )}
                  </td>
                  <td>{p.nombre}</td>
                  <td>{p.descripcion}</td>
                  <td>Q{p.precio}</td>
                  <td>{p.stock}</td>
                  <td>{p.id_subcategoria}</td>
                  <td>
                    <div className="d-flex gap-2 justify-content-center">
                      <button onClick={() => handleEdit(p)} className="btn btn-sm btn-outline-primary">
                        Editar
                      </button>
                      <button onClick={() => handleDelete(p.id_producto)} className="btn btn-sm btn-outline-danger">
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {productos.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">
                    No hay productos registrados.
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

export default AdminProductos;
