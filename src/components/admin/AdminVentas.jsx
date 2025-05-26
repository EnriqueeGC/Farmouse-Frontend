import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./admin-panel.css";

function AdminVentas() {
  const [ventas, setVentas] = useState([]);
  const [ventasFiltradas, setVentasFiltradas] = useState([]);
  const [filtroFecha, setFiltroFecha] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetchVentas();
  }, []);

  const fetchVentas = async () => {
    try {
      const res = await axios.get("https://farmouse.onrender.com/api/ventas");
      setVentas(res.data?.data || []);
      setVentasFiltradas(res.data?.data || []);
    } catch (err) {
      console.error("❌ Error al cargar ventas:", err);
    } finally {
      setCargando(false);
    }
  };

  const handleFiltro = () => {
    const filtradas = ventas.filter((venta) => {
      const coincideFecha = filtroFecha
        ? new Date(venta.fecha).toISOString().slice(0, 10) === filtroFecha
        : true;
      const coincideEstado = filtroEstado
        ? venta.pedido?.estado.toLowerCase().includes(filtroEstado.toLowerCase())
        : true;
      return coincideFecha && coincideEstado;
    });

    setVentasFiltradas(filtradas);
  };

  const resetFiltros = () => {
    setFiltroFecha("");
    setFiltroEstado("");
    setVentasFiltradas(ventas);
  };

  const generarPDF = () => {
    const doc = new jsPDF();
    doc.text("Reporte de Ventas", 14, 16);

    const tabla = ventasFiltradas.map((venta) => [
      venta.id_venta,
      venta.id_pedido,
      `Q${venta.total}`,
      new Date(venta.fecha).toLocaleDateString(),
      venta.pedido?.direccion_envio ?? "N/A",
      venta.pedido?.estado ?? "Sin estado"
    ]);

    doc.autoTable({
      startY: 22,
      head: [["ID Venta", "ID Pedido", "Total", "Fecha", "Dirección", "Estado"]],
      body: tabla
    });

    doc.save("reporte_ventas.pdf");
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h2 className="admin-title">Registro de Ventas</h2>

        <div className="row g-3 mb-4 align-items-end">
          <div className="col-md-3">
            <label className="form-label">Filtrar por Fecha:</label>
            <input
              type="date"
              className="form-control"
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Filtrar por Estado:</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ej: entregado, pendiente..."
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            />
          </div>
          <div className="col-md-3 d-grid">
            <button className="btn btn-primary" onClick={handleFiltro}>
              Aplicar Filtros
            </button>
          </div>
          <div className="col-md-3 d-grid">
            <button className="btn btn-secondary" onClick={resetFiltros}>
              Limpiar Filtros
            </button>
          </div>
        </div>

        <div className="d-flex justify-content-end mb-3">
          <button className="btn btn-outline-success" onClick={generarPDF}>
            Descargar PDF
          </button>
        </div>

        {cargando ? (
          <p className="text-center">Cargando ventas...</p>
        ) : ventasFiltradas.length === 0 ? (
          <p className="text-center text-muted">No hay resultados con los filtros seleccionados.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover table-striped align-middle border">
              <thead className="table-primary text-center">
                <tr>
                  <th>ID Venta</th>
                  <th>ID Pedido</th>
                  <th>Total</th>
                  <th>Fecha</th>
                  <th>Dirección</th>
                  <th>Estado Pedido</th>
                </tr>
              </thead>
              <tbody>
                {ventasFiltradas.map((venta) => (
                  <tr key={venta.id_venta}>
                    <td>{venta.id_venta}</td>
                    <td>{venta.id_pedido}</td>
                    <td>Q{venta.total}</td>
                    <td>{new Date(venta.fecha).toLocaleDateString()}</td>
                    <td>{venta.pedido?.direccion_envio ?? "N/A"}</td>
                    <td>{venta.pedido?.estado ?? "Sin estado"}</td>
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

export default AdminVentas;
