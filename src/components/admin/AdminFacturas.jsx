import { useEffect, useState } from "react";
import axios from "axios";
import "./admin-panel.css";

function AdminFacturas() {
  const [facturas, setFacturas] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetchFacturas();
  }, []);

  const fetchFacturas = async () => {
    try {
      const res = await axios.get("https://farmouse.onrender.com/api/factura");
      setFacturas(res.data?.data || []);
    } catch (err) {
      console.error("❌ Error al cargar facturas:", err);
    } finally {
      setCargando(false);
    }
  };

  const descargarFactura = async (id_pago) => {
    try {
      const response = await axios.get(`https://farmouse.onrender.com/api/factura/${id_pago}/download`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `factura-${id_pago}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("❌ Error al descargar factura:", error);
    }
  };

  const facturasFiltradas = facturas.filter((f) =>
    f.numero_factura.toLowerCase().includes(filtro.toLowerCase()) ||
    f.estado.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h2 className="admin-title">Facturas Emitidas</h2>

        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por número o estado"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </div>
        </div>

        {cargando ? (
          <p className="text-center">Cargando facturas...</p>
        ) : facturasFiltradas.length === 0 ? (
          <p className="text-center text-muted">No hay facturas registradas.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover table-striped align-middle border">
              <thead className="table-primary text-center">
                <tr>
                  <th>ID</th>
                  <th>N° Factura</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {facturasFiltradas.map((factura) => (
                  <tr key={factura.id_factura}>
                    <td>{factura.id_factura}</td>
                    <td>{factura.numero_factura}</td>
                    <td>{new Date(factura.fecha_emision).toLocaleDateString()}</td>
                    <td>Q{factura.total}</td>
                    <td>{factura.estado}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => descargarFactura(factura.id_pago)}
                      >
                        Descargar PDF
                      </button>
                    </td>
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

export default AdminFacturas;
