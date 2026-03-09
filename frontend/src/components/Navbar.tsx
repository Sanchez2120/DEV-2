import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Package, LayoutGrid, Plus } from 'lucide-react';

export const Navbar = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        signOut();
        navigate('/login');
    };

    return (
        <nav style={{
            background: 'var(--color-surface)',
            borderBottom: '1px solid var(--color-border)',
            padding: '0 1.5rem',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 50,
            backdropFilter: 'blur(10px)',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <Link to="/products" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    textDecoration: 'none',
                    color: 'var(--color-text)',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                }}>
                    <span style={{
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        borderRadius: '0.4rem',
                        padding: '0.3rem',
                        display: 'flex',
                    }}>
                        <Package size={18} color="white" />
                    </span>
                    Asisya
                </Link>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <NavLink to="/products" icon={<LayoutGrid size={15} />} label="Productos" />
                    <NavLink to="/products/new" icon={<Plus size={15} />} label="Nuevo Producto" />
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    {user?.name}
                </span>
                <button className="btn btn-secondary" onClick={handleLogout} style={{ padding: '0.4rem 0.8rem' }}>
                    <LogOut size={14} />
                    Salir
                </button>
            </div>
        </nav>
    );
};

const NavLink = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => {
    const isActive = window.location.pathname === to;
    return (
        <Link to={to} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.4rem 0.75rem',
            borderRadius: '0.4rem',
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
            background: isActive ? 'rgba(99,102,241,0.1)' : 'transparent',
            transition: 'all 0.15s',
        }}>
            {icon}
            {label}
        </Link>
    );
};
