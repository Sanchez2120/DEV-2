import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../api/auth';
import { Package, LogIn } from 'lucide-react';

const schema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'La contraseña es requerida'),
});

type FormData = z.infer<typeof schema>;

export const LoginPage = () => {
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: 'admin@asisya.com',
            password: 'Admin123!',
        }
    });

    const onSubmit = async (data: FormData) => {
        setServerError('');
        setLoading(true);
        try {
            const response = await login(data);
            signIn(response);
            navigate('/products');
        } catch {
            setServerError('Credenciales incorrectas. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--color-bg)',
            padding: '1rem',
        }}>
            {/* Background gradient orbs */}
            <div style={{
                position: 'fixed', top: '10%', left: '15%',
                width: '400px', height: '400px',
                background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
                borderRadius: '50%', pointerEvents: 'none',
            }} />
            <div style={{
                position: 'fixed', bottom: '15%', right: '10%',
                width: '350px', height: '350px',
                background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
                borderRadius: '50%', pointerEvents: 'none',
            }} />

            <div style={{ width: '100%', maxWidth: '400px', position: 'relative' }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        borderRadius: '1rem',
                        width: '64px', height: '64px',
                        marginBottom: '1rem',
                        boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
                    }}>
                        <Package size={30} color="white" />
                    </div>
                    <h1 style={{ fontSize: '1.75rem', margin: '0 0 0.25rem', lineHeight: 1.2 }}>Asisya</h1>
                    <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: '0.9rem' }}>
                        Panel de Administración
                    </p>
                </div>

                <div className="card" style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.4)' }}>
                    <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>
                        Iniciar sesión
                    </h2>
                    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label className="label">Email</label>
                            <input
                                {...register('email')}
                                className="input"
                                type="email"
                                placeholder="admin@asisya.com"
                                autoComplete="email"
                            />
                            {errors.email && <p className="error-msg">{errors.email.message}</p>}
                        </div>
                        <div>
                            <label className="label">Contraseña</label>
                            <input
                                {...register('password')}
                                className="input"
                                type="password"
                                placeholder="••••••••"
                                autoComplete="current-password"
                            />
                            {errors.password && <p className="error-msg">{errors.password.message}</p>}
                        </div>

                        {serverError && (
                            <div style={{
                                padding: '0.75rem 1rem',
                                background: 'rgba(239,68,68,0.1)',
                                border: '1px solid rgba(239,68,68,0.3)',
                                borderRadius: '0.5rem',
                                color: 'var(--color-danger)',
                                fontSize: '0.875rem',
                            }}>
                                {serverError}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                            style={{ marginTop: '0.5rem', padding: '0.75rem' }}
                        >
                            {loading ? (
                                <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⟳</span>
                            ) : (
                                <LogIn size={16} />
                            )}
                            {loading ? 'Ingresando...' : 'Iniciar sesión'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
