import { Link } from 'react-router-dom';

const SubmenuSubcategorias = ({ subcategorias }) => {
    return (
        <div className="submenu-container" style={{ position: 'absolute', top: '100px', left: '50px', backgroundColor: 'black', padding: '1rem', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <h3>Subcategorías</h3>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {subcategorias.map((subcat) => (
                    <li key={subcat.id}>
                     {subcat.nombre}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SubmenuSubcategorias;
