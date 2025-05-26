import { Link, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { FaHome } from 'react-icons/fa';
import './AdminLayout.css';

function AdminLayout() {
  const location = useLocation();

  useEffect(() => {
    const links = document.querySelectorAll(".admin-sidebar a");
    const highlight = document.createElement("div");
    highlight.className = "highlight-bar";
    document.querySelector(".admin-sidebar ul").appendChild(highlight);

    function moveHighlight(link) {
      highlight.style.width = `${link.offsetWidth}px`;
      highlight.style.left = `${link.offsetLeft}px`;
    }

    links.forEach((link) => {
      if (link.pathname === location.pathname) {
        link.classList.add("active");
        moveHighlight(link);
      }

      link.addEventListener("click", (e) => {
        links.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");
        moveHighlight(link);
      });
    });

    // Inicializa en ruta activa
    const active = Array.from(links).find(link => link.pathname === location.pathname);
    if (active) moveHighlight(active);
  }, [location]);

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>Panel Admin</h2>
        <nav>
          <ul className="admin-nav-list">
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
        {/* Botón burbuja para volver al home */}
        <Link to="/" className="bubble-return-button" title="Volver al inicio">
          <FaHome size={20} />
        </Link>
      </main>
    </div>
  );
}

export default AdminLayout;
