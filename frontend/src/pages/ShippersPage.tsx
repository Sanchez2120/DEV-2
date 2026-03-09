import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { shipperApi } from '../api/shippers';
import type { Shipper } from '../api/shippers';
import { Plus, Search, Trash2, Edit, RefreshCw, Truck } from 'lucide-react';

export const ShippersPage = () => {
    const [data, setData] = useState<Shipper[]>([]);
    const [filteredData, setFilteredData] = useState<Shipper[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [deleting, setDeleting] = useState<number | null>(null);

    const fetchShippers = useCallback(async () => {
        setLoading(true);
        try {
            const result = await shipperApi.getAll();
            setData(result);
            setFilteredData(result);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchShippers();
    }, [fetchShippers]);

    const handleDelete = async (id: number) => {
        if (!confirm('¿Seguro que deseas eliminar este transportista?')) return;
        setDeleting(id);
        try {
            await shipperApi.delete(id);
            fetchShippers();
        } finally {
            setDeleting(null);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const lower = search.toLowerCase();
        setFilteredData(data.filter(s =>
            s.companyName.toLowerCase().includes(lower)
        ));
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '1.4rem' }}>Transportistas</h1>
                    <p style={{ margin: '0.3rem 0 0', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                        {data.length} transportistas registrados
                    </p>
                </div>
                <Link to="/shippers/new" className="btn btn-primary">
                    <Plus size={16} />
                    Nuevo Transportista
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
                                placeholder="Nombre de la empresa..."
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
                        <Truck size={40} style={{ color: 'var(--color-text-muted)', marginBottom: '0.75rem' }} />
                        <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>No se encontraron transportistas</p>
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Empresa</th>
                                <th>Teléfono</th>
                                <th style={{ textAlign: 'right' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((s) => (
                                <tr key={s.id}>
                                    <td style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>#{s.id}</td>
                                    <td style={{ fontWeight: 600 }}>{s.companyName}</td>
                                    <td>{s.phone || 'N/A'}</td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <button className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem' }} onClick={() => alert('Edición en desarrollo')}>
                                                <Edit size={14} />
                                            </button>
                                            <button className="btn btn-danger" style={{ padding: '0.35rem 0.65rem' }} onClick={() => handleDelete(s.id)} disabled={deleting === s.id}>
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
