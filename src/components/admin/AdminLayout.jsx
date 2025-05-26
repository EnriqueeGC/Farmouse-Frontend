import { Link, Outlet } from 'react-router-dom';
import './AdminLayout.css';
import { FaHome } from 'react-icons/fa'; // 👈 Importa el ícono

function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>Panel Admin</h2>
        <nav>
          <ul>
            <li><Link to="/admin/categorias">Categorías</Link></li>
            <li><Link to="/admin/subcategorias">Subcategorías</Link></li>
            <li><Link to="/admin/productos">Productos</Link></li>
            <li><Link to="/admin/pedidos">Pedidos</Link></li>
            <li><Link to="/admin/ventas">Ventas</Link></li>
            <li><Link to="/admin/facturas">Facturas</Link></li>
            <li><Link to="/admin/usuarios">Usuarios</Link></li>
          </ul>
        </nav>
      </aside>

      <main className="admin-content">
        <Outlet />
        {/* Botón burbuja para regresar al home */}
        <Link to="/" className="bubble-return-button" title="Volver al inicio">
          <FaHome size={20} />
        </Link>
      </main>
    </div>
  );
}

export default AdminLayout;
