import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts, deleteProduct } from '../api/products';
import { getCategories } from '../api/categories';
import type { Product, Category, PaginatedResult } from '../types';
import { Plus, Search, Trash2, Edit, ChevronLeft, ChevronRight, RefreshCw, Package } from 'lucide-react';

const PAGE_SIZE = 10;

export const ProductsPage = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<PaginatedResult<Product> | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [page, setPage] = useState(1);
    const [deleting, setDeleting] = useState<number | null>(null);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const result = await getProducts({
                page,
                pageSize: PAGE_SIZE,
                search: search || undefined,
                categoryId: categoryId ? Number(categoryId) : undefined,
            });
            setData(result);
        } finally {
            setLoading(false);
        }
    }, [page, search, categoryId]);

    useEffect(() => {
        getCategories().then(setCategories).catch(() => { });
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleDelete = async (id: number) => {
        if (!confirm('¿Seguro que deseas eliminar este producto?')) return;
        setDeleting(id);
        try {
            await deleteProduct(id);
            fetchProducts();
        } finally {
            setDeleting(null);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchProducts();
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '1.4rem' }}>Productos</h1>
                    <p style={{ margin: '0.3rem 0 0', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                        {data?.totalCount ?? '...'} productos en total
                    </p>
                </div>
                <Link to="/products/new" className="btn btn-primary">
                    <Plus size={16} />
                    Nuevo Producto
                </Link>
            </div>

            {/* Filters */}
            <div className="card" style={{ marginBottom: '1.25rem', padding: '1rem' }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <div style={{ flex: '1 1 260px' }}>
                        <label className="label">Buscar</label>
                        <div style={{ position: 'relative' }}>
                            <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                            <input
                                className="input"
                                style={{ paddingLeft: '2.25rem' }}
                                placeholder="Nombre del producto..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    <div style={{ flex: '1 1 180px' }}>
                        <label className="label">Categoría</label>
                        <select
                            className="select"
                            value={categoryId}
                            onChange={(e) => { setCategoryId(e.target.value); setPage(1); }}
                        >
                            <option value="">Todas las categorías</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-end' }}>
                        <Search size={15} /> Buscar
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ alignSelf: 'flex-end' }}
                        onClick={() => { setSearch(''); setCategoryId(''); setPage(1); }}
                    >
                        <RefreshCw size={15} /> Limpiar
                    </button>
                </form>
            </div>

            {/* Table */}
            <div className="table-container">
                {loading ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                        <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }} />
                    </div>
                ) : !data?.items.length ? (
                    <div style={{ padding: '3rem', textAlign: 'center' }}>
                        <Package size={40} style={{ color: 'var(--color-text-muted)', marginBottom: '0.75rem' }} />
                        <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>No hay productos encontrados</p>
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Categoría</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th style={{ textAlign: 'right' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.items.map((p) => (
                                <tr key={p.id}>
                                    <td style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>#{p.id}</td>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>{p.name}</div>
                                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.1rem' }}>
                                            {p.description?.slice(0, 50)}{p.description?.length > 50 ? '...' : ''}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge badge-primary">{p.categoryName || `Cat. ${p.categoryId}`}</span>
                                    </td>
                                    <td style={{ fontWeight: 600 }}>
                                        ${p.price.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td>
                                        <span style={{
                                            color: p.stock > 10 ? 'var(--color-success)' : p.stock > 0 ? 'var(--color-warning)' : 'var(--color-danger)',
                                            fontWeight: 600,
                                        }}>
                                            {p.stock}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <button
                                                className="btn btn-secondary"
                                                style={{ padding: '0.35rem 0.65rem' }}
                                                onClick={() => navigate(`/products/${p.id}/edit`)}
                                            >
                                                <Edit size={14} />
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                style={{ padding: '0.35rem 0.65rem' }}
                                                onClick={() => handleDelete(p.id)}
                                                disabled={deleting === p.id}
                                            >
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

            {/* Pagination */}
            {data && data.totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginTop: '1.25rem' }}>
                    <button
                        className="btn btn-secondary"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                        Página <strong style={{ color: 'var(--color-text)' }}>{page}</strong> de <strong>{data.totalPages}</strong>
                    </span>
                    <button
                        className="btn btn-secondary"
                        onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                        disabled={page === data.totalPages}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};
