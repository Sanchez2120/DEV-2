import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { createProduct, getProduct, updateProduct } from '../api/products';
import { getCategories } from '../api/categories';
import type { Category } from '../types';
import { ArrowLeft, Save } from 'lucide-react';

// Form values are all strings (how HTML inputs work)
interface FormValues {
    name: string;
    description: string;
    price: string;
    stock: string;
    imageUrl: string;
    categoryId: string;
}

export const ProductFormPage = () => {
    const { id } = useParams();
    const isEditing = !!id;
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchingProduct, setFetchingProduct] = useState(isEditing);
    const [formError, setFormError] = useState('');

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            name: '',
            description: '',
            price: '0',
            stock: '0',
            imageUrl: '',
            categoryId: '0',
        },
    });

    useEffect(() => {
        getCategories().then(setCategories).catch(() => { });
    }, []);

    useEffect(() => {
        if (isEditing && id) {
            setFetchingProduct(true);
            getProduct(Number(id))
                .then((product) => {
                    reset({
                        name: product.name,
                        description: product.description,
                        price: String(product.price),
                        stock: String(product.stock),
                        imageUrl: product.imageUrl || '',
                        categoryId: String(product.categoryId),
                    });
                })
                .catch(() => navigate('/products'))
                .finally(() => setFetchingProduct(false));
        }
    }, [id, isEditing, navigate, reset]);

    const onSubmit = async (data: FormValues) => {
        setFormError('');
        // Client-side validation
        if (!data.name.trim()) { setFormError('El nombre es requerido'); return; }
        if (!data.description.trim()) { setFormError('La descripción es requerida'); return; }
        if (Number(data.categoryId) < 1) { setFormError('Selecciona una categoría'); return; }
        const price = parseFloat(data.price);
        const stock = parseInt(data.stock, 10);
        if (isNaN(price) || price < 0) { setFormError('El precio debe ser un número positivo'); return; }
        if (isNaN(stock) || stock < 0) { setFormError('El stock debe ser un número entero positivo'); return; }

        const payload = {
            name: data.name.trim(),
            description: data.description.trim(),
            price,
            stock,
            imageUrl: data.imageUrl.trim() || undefined,
            categoryId: Number(data.categoryId),
        };

        setLoading(true);
        try {
            if (isEditing && id) {
                await updateProduct(Number(id), payload);
            } else {
                await createProduct(payload);
            }
            navigate('/products');
        } catch (err) {
            console.error(err);
            setFormError('Error al guardar el producto. Inténtalo nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    if (fetchingProduct) {
        return (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                Cargando producto...
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '760px', margin: '0 auto' }}>
            <button
                className="btn btn-secondary"
                onClick={() => navigate(-1)}
                style={{ marginBottom: '1.5rem' }}
            >
                <ArrowLeft size={15} />
                Volver
            </button>

            <h1 style={{ margin: '0 0 0.3rem', fontSize: '1.4rem' }}>
                {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
            </h1>
            <p style={{ margin: '0 0 1.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                {isEditing ? `Editando el producto #${id}` : 'Completa los datos del nuevo producto'}
            </p>

            <div className="card">
                <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label className="label">Nombre</label>
                            <input
                                {...register('name', { required: 'El nombre es requerido' })}
                                className="input"
                                placeholder="Ej. Servidor Dell PowerEdge R740"
                            />
                            {errors.name && <p className="error-msg">{errors.name.message}</p>}
                        </div>

                        <div style={{ gridColumn: '1 / -1' }}>
                            <label className="label">Descripción</label>
                            <textarea
                                {...register('description', { required: 'La descripción es requerida' })}
                                className="input"
                                placeholder="Describe el producto..."
                                rows={3}
                                style={{ resize: 'vertical' }}
                            />
                            {errors.description && <p className="error-msg">{errors.description.message}</p>}
                        </div>

                        <div>
                            <label className="label">Precio (USD)</label>
                            <input
                                {...register('price', { required: true })}
                                className="input"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label className="label">Stock</label>
                            <input
                                {...register('stock', { required: true })}
                                className="input"
                                type="number"
                                min="0"
                                placeholder="0"
                            />
                        </div>

                        <div style={{ gridColumn: '1 / -1' }}>
                            <label className="label">Categoría</label>
                            <select
                                {...register('categoryId', { required: 'Selecciona una categoría' })}
                                className="select"
                            >
                                <option value="0" disabled>Selecciona una categoría</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                            {errors.categoryId && <p className="error-msg">{errors.categoryId.message}</p>}
                        </div>

                        <div style={{ gridColumn: '1 / -1' }}>
                            <label className="label">URL de Imagen (opcional)</label>
                            <input
                                {...register('imageUrl')}
                                className="input"
                                type="url"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    {formError && (
                        <div style={{
                            padding: '0.75rem 1rem',
                            background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.3)',
                            borderRadius: '0.5rem',
                            color: 'var(--color-danger)',
                            fontSize: '0.875rem',
                        }}>
                            {formError}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem' }}>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                            style={{ flex: 1, padding: '0.75rem' }}
                        >
                            <Save size={16} />
                            {loading ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear producto'}
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate('/products')}
                            style={{ padding: '0.75rem 1.25rem' }}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
