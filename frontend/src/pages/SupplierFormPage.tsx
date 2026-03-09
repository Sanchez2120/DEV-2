import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { supplierApi } from '../api/suppliers';
import type { CreateSupplierDto } from '../api/suppliers';
import { ArrowLeft, Save } from 'lucide-react';

interface FormValues {
    companyName: string;
    contactName: string;
    contactTitle: string;
    city: string;
    country: string;
    phone: string;
}

export const SupplierFormPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            companyName: '',
            contactName: '',
            contactTitle: '',
            city: '',
            country: '',
            phone: '',
        },
    });

    const onSubmit = async (data: FormValues) => {
        setFormError('');
        if (!data.companyName.trim()) { setFormError('El nombre de la empresa es requerido'); return; }

        const payload: CreateSupplierDto = {
            companyName: data.companyName.trim(),
            contactName: data.contactName.trim() || undefined,
            contactTitle: data.contactTitle.trim() || undefined,
            city: data.city.trim() || undefined,
            country: data.country.trim() || undefined,
            phone: data.phone.trim() || undefined,
        };

        setLoading(true);
        try {
            await supplierApi.create(payload);
            navigate('/suppliers');
        } catch (err) {
            console.error(err);
            setFormError('Error al guardar el proveedor. Inténtalo nuevamente.');
        } finally {
            setLoading(false);
        }
    };

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
                Nuevo Proveedor
            </h1>
            <p style={{ margin: '0 0 1.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                Completa los datos del nuevo proveedor
            </p>

            <div className="card">
                <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label className="label">Nombre de la Empresa</label>
                            <input
                                {...register('companyName', { required: 'El nombre de la empresa es requerido' })}
                                className="input"
                                placeholder="Ej. Exotic Liquids"
                            />
                            {errors.companyName && <p className="error-msg">{errors.companyName.message}</p>}
                        </div>

                        <div>
                            <label className="label">Nombre del Contacto</label>
                            <input
                                {...register('contactName')}
                                className="input"
                                placeholder="Ej. Charlotte Cooper"
                            />
                        </div>

                        <div>
                            <label className="label">Cargo del Contacto</label>
                            <input
                                {...register('contactTitle')}
                                className="input"
                                placeholder="Ej. Purchasing Manager"
                            />
                        </div>

                        <div>
                            <label className="label">Ciudad</label>
                            <input
                                {...register('city')}
                                className="input"
                                placeholder="Ej. London"
                            />
                        </div>

                        <div>
                            <label className="label">País</label>
                            <input
                                {...register('country')}
                                className="input"
                                placeholder="Ej. UK"
                            />
                        </div>

                        <div style={{ gridColumn: '1 / -1' }}>
                            <label className="label">Teléfono</label>
                            <input
                                {...register('phone')}
                                className="input"
                                placeholder="Ej. (171) 555-2222"
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
                            {loading ? 'Guardando...' : 'Crear Proveedor'}
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate('/suppliers')}
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
