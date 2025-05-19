import { Link } from "react-router-dom";
import "./SubmenuSubcategorias.css";

const SubmenuSubcategorias = ({ subcategorias }) => {
  if (!Array.isArray(subcategorias) || subcategorias.length === 0) {
    return (
      <div className="submenu-container submenu-empty">
        <h3>No hay subcategorías disponibles</h3>
      </div>
    );
  }

  return (
    <div className="submenu-container submenu-filled">
      <div className="submenu-title">
        <h3>{subcategorias[0].categoryName}</h3>
      </div>
      <ul className="submenu-list">
        {subcategorias.map((subcat) => (
          <li key={subcat.id_subcategoria}>
            <Link to={`/productos/subcategoria/${subcat.id_subcategoria}`}>
              {subcat.nombre}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubmenuSubcategorias;
