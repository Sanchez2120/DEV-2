import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { shipperApi } from '../api/shippers';
import type { CreateShipperDto } from '../api/shippers';
import { ArrowLeft, Save } from 'lucide-react';

interface FormValues {
    companyName: string;
    phone: string;
}

export const ShipperFormPage = () => {
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
            phone: '',
        },
    });

    const onSubmit = async (data: FormValues) => {
        setFormError('');
        if (!data.companyName.trim()) { setFormError('El nombre de la empresa es requerido'); return; }

        const payload: CreateShipperDto = {
            companyName: data.companyName.trim(),
            phone: data.phone.trim() || undefined,
        };

        setLoading(true);
        try {
            await shipperApi.create(payload);
            navigate('/shippers');
        } catch (err) {
            console.error(err);
            setFormError('Error al guardar el transportista. Inténtalo nuevamente.');
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
                Nuevo Transportista
            </h1>
            <p style={{ margin: '0 0 1.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                Completa los datos del nuevo transportista
            </p>

            <div className="card">
                <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
                        <div>
                            <label className="label">Nombre de la Empresa</label>
                            <input
                                {...register('companyName', { required: 'El nombre de la empresa es requerido' })}
                                className="input"
                                placeholder="Ej. Speedy Express"
                            />
                            {errors.companyName && <p className="error-msg">{errors.companyName.message}</p>}
                        </div>

                        <div>
                            <label className="label">Teléfono</label>
                            <input
                                {...register('phone')}
                                className="input"
                                placeholder="Ej. (503) 555-9831"
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
                            {loading ? 'Guardando...' : 'Crear Transportista'}
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate('/shippers')}
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
