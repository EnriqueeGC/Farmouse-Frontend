import { useEffect, useState } from "react";
import axios from "axios";
import "./admin-panel.css";

function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/pedidos/"); // ajusta si usas otro puerto
      setPedidos(res.data?.data || []);
    } catch (err) {
      console.error("❌ Error al cargar pedidos:", err);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h2 className="admin-title">Lista de Pedidos</h2>

        {cargando ? (
          <p className="text-center">Cargando pedidos...</p>
        ) : pedidos.length === 0 ? (
          <p className="text-center text-muted">No hay pedidos registrados.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover table-striped align-middle border">
              <thead className="table-primary text-center">
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Estado</th>
                  <th>Total</th>
                  <th>Fecha</th>
                  <th>Dirección</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((pedido) => (
                  <tr key={pedido.id_pedido}>
                    <td>{pedido.id_pedido}</td>
                    <td>{pedido.id_usuario ?? "No registrado"}</td>
                    <td>{pedido.estado}</td>
                    <td>Q{pedido.total}</td>
                    <td>{new Date(pedido.fecha_pedido).toLocaleDateString()}</td>
                    <td>{pedido.direccion_envio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPedidos;
