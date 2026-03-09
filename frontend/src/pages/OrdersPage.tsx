import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '../api/orders';
import type { Order } from '../api/orders';
import { Plus, Search, Trash2, Edit, RefreshCw, ShoppingCart } from 'lucide-react';

export const OrdersPage = () => {
    const [data, setData] = useState<Order[]>([]);
    const [filteredData, setFilteredData] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [deleting, setDeleting] = useState<number | null>(null);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const result = await orderApi.getAll();
            setData(result);
            setFilteredData(result);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleDelete = async (id: number) => {
        if (!confirm('¿Seguro que deseas eliminar esta orden?')) return;
        setDeleting(id);
        try {
            await orderApi.delete(id);
            fetchOrders();
        } finally {
            setDeleting(null);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const lower = search.toLowerCase();
        setFilteredData(data.filter(o =>
            o.customerName?.toLowerCase().includes(lower) ||
            o.employeeName?.toLowerCase().includes(lower) ||
            o.id.toString().includes(lower)
        ));
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '1.4rem' }}>Órdenes</h1>
                    <p style={{ margin: '0.3rem 0 0', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                        {data.length} órdenes registradas
                    </p>
                </div>
                <Link to="/orders/new" className="btn btn-primary">
                    <Plus size={16} />
                    Nueva Órden
                </Link>
            </div>

            <div className="card" style={{ marginBottom: '1.25rem', padding: '1rem' }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <div style={{ flex: '1 1 260px' }}>
                        <label className="label">Buscar</label>
                        <div style={{ position: 'relative' }}>
                            <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                            <input
                                className="input"
                                style={{ paddingLeft: '2.25rem' }}
                                placeholder="ID, Cliente o Empleado..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-end' }}>
                        <Search size={15} /> Buscar
                    </button>
                    <button type="button" className="btn btn-secondary" style={{ alignSelf: 'flex-end' }} onClick={() => { setSearch(''); setFilteredData(data); }}>
                        <RefreshCw size={15} /> Limpiar
                    </button>
                </form>
            </div>

            <div className="table-container">
                {loading ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                        <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }} />
                    </div>
                ) : !filteredData.length ? (
                    <div style={{ padding: '3rem', textAlign: 'center' }}>
                        <ShoppingCart size={40} style={{ color: 'var(--color-text-muted)', marginBottom: '0.75rem' }} />
                        <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>No se encontraron órdenes</p>
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Cliente</th>
                                <th>Empleado</th>
                                <th>Fecha</th>
                                <th>Transportista</th>
                                <th>Flete</th>
                                <th style={{ textAlign: 'right' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((o) => (
                                <tr key={o.id}>
                                    <td style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>#{o.id}</td>
                                    <td style={{ fontWeight: 600 }}>{o.customerName || o.customerId}</td>
                                    <td>{o.employeeName || 'N/A'}</td>
                                    <td>{new Date(o.orderDate).toLocaleDateString()}</td>
                                    <td>
                                        <span className="badge badge-primary">{o.shipperName || 'N/A'}</span>
                                    </td>
                                    <td style={{ fontWeight: 600 }}>
                                        ${o.freight.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <button className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem' }} onClick={() => alert('Edición en desarrollo')}>
                                                <Edit size={14} />
                                            </button>
                                            <button className="btn btn-danger" style={{ padding: '0.35rem 0.65rem' }} onClick={() => handleDelete(o.id)} disabled={deleting === o.id}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};
