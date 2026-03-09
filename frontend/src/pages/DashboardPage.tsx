import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../api/products';
import { getCategories } from '../api/categories';
import { Package, Tag, TrendingDown, Plus } from 'lucide-react';

export const DashboardPage = () => {
    const [totalProducts, setTotalProducts] = useState<number | null>(null);
    const [totalCategories, setTotalCategories] = useState<number | null>(null);
    const [lowStock, setLowStock] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            getProducts({ page: 1, pageSize: 1 }),
            getCategories(),
            getProducts({ page: 1, pageSize: 1000 }),
        ]).then(([paged, cats, allProducts]) => {
            setTotalProducts(paged.totalCount);
            setTotalCategories(cats.length);
            setLowStock(allProducts.items.filter((p) => p.stock <= 5).length);
        }).finally(() => setLoading(false));
    }, []);

    const stats = [
        {
            label: 'Total Productos',
            value: totalProducts ?? '—',
            icon: <Package size={22} />,
            cls: 'stat-icon-purple',
        },
        {
            label: 'Categorías',
            value: totalCategories ?? '—',
            icon: <Tag size={22} />,
            cls: 'stat-icon-blue',
        },
        {
            label: 'Stock Bajo (≤ 5)',
            value: lowStock ?? '—',
            icon: <TrendingDown size={22} />,
            cls: lowStock && lowStock > 0 ? 'stat-icon-orange' : 'stat-icon-green',
        },
    ];

    return (
        <div className="fade-in">
            {/* Welcome */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="page-title">Panel de Control</h1>
                <p className="page-subtitle">Resumen general del sistema de inventario</p>
            </div>

            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {stats.map((s) => (
                    <div className="stat-card" key={s.label}>
                        <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
                        <div>
                            <div className="stat-value">
                                {loading ? <span style={{ fontSize: '1rem', opacity: 0.4 }}>...</span> : s.value}
                            </div>
                            <div className="stat-label">{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick actions */}
            <div className="card">
                <h2 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                    Acciones rápidas
                </h2>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <Link to="/products/new" className="btn btn-primary">
                        <Plus size={15} /> Crear producto
                    </Link>
                    <Link to="/products" className="btn btn-secondary">
                        <Package size={15} /> Ver productos
                    </Link>
                </div>

                <div className="divider" />

                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.8 }}>
                    <p>📌 Usa el menú lateral para navegar entre secciones.</p>
                    <p>🔐 El token JWT se guarda en <code style={{ background: 'var(--color-surface-3)', padding: '0 0.3rem', borderRadius: '3px' }}>localStorage</code> y se envía automáticamente.</p>
                    <p>📦 El endpoint <code style={{ background: 'var(--color-surface-3)', padding: '0 0.3rem', borderRadius: '3px' }}>POST /api/product/bulk</code> soporta carga masiva de hasta 100,000 productos.</p>
                </div>
            </div>
        </div>
    );
};
