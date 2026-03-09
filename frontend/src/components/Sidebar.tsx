import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard, Package, Plus, LogOut, Server,
    Briefcase, Users, Truck, UserCheck, ShoppingCart
} from 'lucide-react';

export const Sidebar = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const initials = user?.name
        ? user.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
        : 'A';

    const handleLogout = () => {
        signOut();
        navigate('/login');
    };

    return (
        <aside className="sidebar">
            {/* Logo */}
            <NavLink to="/dashboard" className="sidebar-logo">
                <span className="sidebar-logo-icon">
                    <Server size={17} color="white" />
                </span>
                Asisya
            </NavLink>

            {/* Navigation */}
            <div className="sidebar-section" style={{ flex: 1 }}>
                <div className="sidebar-section-title">Menú</div>

                <NavLink
                    to="/dashboard"
                    className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
                >
                    <LayoutDashboard size={16} className="link-icon" />
                    Dashboard
                </NavLink>

                <NavLink
                    to="/products"
                    className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
                >
                    <Package size={16} className="link-icon" />
                    Productos
                </NavLink>

                <NavLink
                    to="/suppliers"
                    className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
                >
                    <Briefcase size={16} className="link-icon" />
                    Proveedores
                </NavLink>

                <NavLink
                    to="/customers"
                    className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
                >
                    <Users size={16} className="link-icon" />
                    Clientes
                </NavLink>

                <NavLink
                    to="/shippers"
                    className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
                >
                    <Truck size={16} className="link-icon" />
                    Transportistas
                </NavLink>

                <NavLink
                    to="/employees"
                    className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
                >
                    <UserCheck size={16} className="link-icon" />
                    Empleados
                </NavLink>

                <NavLink
                    to="/orders"
                    className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
                >
                    <ShoppingCart size={16} className="link-icon" />
                    Órdenes
                </NavLink>

                <NavLink
                    to="/products/new"
                    className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
                    style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}
                >
                    <Plus size={16} className="link-icon" />
                    Nuevo Producto
                </NavLink>
            </div>

            {/* Footer user chip */}
            <div className="sidebar-footer">
                <div className="user-chip" style={{ marginBottom: '0.5rem' }}>
                    <div className="user-avatar">{initials}</div>
                    <span className="user-name">{user?.name ?? 'Usuario'}</span>
                </div>
                <button className="sidebar-link btn-ghost" onClick={handleLogout} style={{ width: '100%' }}>
                    <LogOut size={15} className="link-icon" />
                    Cerrar sesión
                </button>
            </div>
        </aside>
    );
};
