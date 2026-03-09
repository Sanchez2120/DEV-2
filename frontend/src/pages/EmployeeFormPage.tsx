import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { employeeApi } from '../api/employees';
import type { CreateEmployeeDto, Employee } from '../api/employees';
import { ArrowLeft, Save } from 'lucide-react';

interface FormValues {
    lastName: string;
    firstName: string;
    title: string;
    city: string;
    country: string;
    reportsToId: string;
}

export const EmployeeFormPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState('');
    const [managers, setManagers] = useState<Employee[]>([]);

    useEffect(() => {
        employeeApi.getAll().then(setManagers).catch(console.error);
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            lastName: '',
            firstName: '',
            title: '',
            city: '',
            country: '',
            reportsToId: '0',
        },
    });

    const onSubmit = async (data: FormValues) => {
        setFormError('');
        if (!data.firstName.trim() || !data.lastName.trim()) {
            setFormError('Nombre y apellido son requeridos.');
            return;
        }

        const reportsToIdNum = parseInt(data.reportsToId, 10);

        const payload: CreateEmployeeDto = {
            firstName: data.firstName.trim(),
            lastName: data.lastName.trim(),
            title: data.title.trim() || undefined,
            city: data.city.trim() || undefined,
            country: data.country.trim() || undefined,
            reportsToId: reportsToIdNum > 0 ? reportsToIdNum : undefined,
        };

        setLoading(true);
        try {
            await employeeApi.create(payload);
            navigate('/employees');
        } catch (err) {
            console.error(err);
            setFormError('Error al guardar el empleado. Inténtalo nuevamente.');
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
                Nuevo Empleado
            </h1>
            <p style={{ margin: '0 0 1.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                Completa los datos del nuevo empleado
            </p>

            <div className="card">
                <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                        <div>
                            <label className="label">Nombre</label>
                            <input
                                {...register('firstName', { required: 'El nombre es requerido' })}
                                className="input"
                                placeholder="Ej. Nancy"
                            />
                            {errors.firstName && <p className="error-msg">{errors.firstName.message}</p>}
                        </div>

                        <div>
                            <label className="label">Apellido</label>
                            <input
                                {...register('lastName', { required: 'El apellido es requerido' })}
                                className="input"
                                placeholder="Ej. Davolio"
                            />
                            {errors.lastName && <p className="error-msg">{errors.lastName.message}</p>}
                        </div>

                        <div>
                            <label className="label">Cargo</label>
                            <input
                                {...register('title')}
                                className="input"
                                placeholder="Ej. Sales Representative"
                            />
                        </div>

                        <div>
                            <label className="label">Manager (Reporta a)</label>
                            <select
                                {...register('reportsToId')}
                                className="select"
                            >
                                <option value="0">Ninguno</option>
                                {managers.map((m) => (
                                    <option key={m.id} value={m.id}>{m.firstName} {m.lastName}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="label">Ciudad</label>
                            <input
                                {...register('city')}
                                className="input"
                                placeholder="Ej. Seattle"
                            />
                        </div>

                        <div>
                            <label className="label">País</label>
                            <input
                                {...register('country')}
                                className="input"
                                placeholder="Ej. USA"
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
                            {loading ? 'Guardando...' : 'Crear Empleado'}
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate('/employees')}
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
