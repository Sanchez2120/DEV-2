import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { customerApi } from '../api/customers';
import type { CreateCustomerDto } from '../api/customers';
import { ArrowLeft, Save } from 'lucide-react';

interface FormValues {
    id: string;
    companyName: string;
    contactName: string;
    city: string;
    country: string;
    phone: string;
}

export const CustomerFormPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            id: '',
            companyName: '',
            contactName: '',
            city: '',
            country: '',
            phone: '',
        },
    });

    const onSubmit = async (data: FormValues) => {
        setFormError('');
        if (!data.id.trim() || data.id.trim().length > 5) {
            setFormError('El ID del cliente es requerido y debe tener máximo 5 caracteres.');
            return;
        }
        if (!data.companyName.trim()) { setFormError('El nombre de la empresa es requerido'); return; }

        const payload: CreateCustomerDto = {
            id: data.id.trim().toUpperCase(),
            companyName: data.companyName.trim(),
            contactName: data.contactName.trim() || undefined,
            city: data.city.trim() || undefined,
            country: data.country.trim() || undefined,
            phone: data.phone.trim() || undefined,
        };

        setLoading(true);
        try {
            await customerApi.create(payload);
            navigate('/customers');
        } catch (err) {
            console.error(err);
            setFormError('Error al guardar el cliente. Asegúrate de que el código ID no exista ya.');
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
                Nuevo Cliente
            </h1>
            <p style={{ margin: '0 0 1.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                Completa los datos del nuevo cliente
            </p>

            <div className="card">
                <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                        <div>
                            <label className="label">Código ID (Máximo 5 letas)</label>
                            <input
                                {...register('id', { required: 'El ID es requerido', maxLength: 5 })}
                                className="input"
                                placeholder="Ej. ALFKI"
                                style={{ textTransform: 'uppercase' }}
                                maxLength={5}
                            />
                            {errors.id && <p className="error-msg">{errors.id.message}</p>}
                        </div>

                        <div>
                            <label className="label">Nombre de la Empresa</label>
                            <input
                                {...register('companyName', { required: 'El nombre de la empresa es requerido' })}
                                className="input"
                                placeholder="Ej. Alfreds Futterkiste"
                            />
                            {errors.companyName && <p className="error-msg">{errors.companyName.message}</p>}
                        </div>

                        <div style={{ gridColumn: '1 / -1' }}>
                            <label className="label">Nombre del Contacto</label>
                            <input
                                {...register('contactName')}
                                className="input"
                                placeholder="Ej. Maria Anders"
                            />
                        </div>

                        <div>
                            <label className="label">Ciudad</label>
                            <input
                                {...register('city')}
                                className="input"
                                placeholder="Ej. Berlin"
                            />
                        </div>

                        <div>
                            <label className="label">País</label>
                            <input
                                {...register('country')}
                                className="input"
                                placeholder="Ej. Germany"
                            />
                        </div>

                        <div style={{ gridColumn: '1 / -1' }}>
                            <label className="label">Teléfono</label>
                            <input
                                {...register('phone')}
                                className="input"
                                placeholder="Ej. 030-0074321"
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
                            {loading ? 'Guardando...' : 'Crear Cliente'}
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate('/customers')}
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
