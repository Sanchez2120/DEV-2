import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { orderApi } from '../api/orders';
import type { CreateOrderDto } from '../api/orders';
import { customerApi } from '../api/customers';
import type { Customer } from '../api/customers';
import { employeeApi } from '../api/employees';
import type { Employee } from '../api/employees';
import { shipperApi } from '../api/shippers';
import type { Shipper } from '../api/shippers';
import { getProducts } from '../api/products';
import type { Product } from '../types';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';

interface OrderDetailForm {
    productId: string;
    quantity: string;
    unitPrice: string;
    discount: string;
}

interface FormValues {
    customerId: string;
    employeeId: string;
    shipperId: string;
    freight: string;
}

export const OrderFormPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState('');

    // Remote Data
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [shippers, setShippers] = useState<Shipper[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

    // Details logic
    const [details, setDetails] = useState<OrderDetailForm[]>([
        { productId: '0', quantity: '1', unitPrice: '0', discount: '0' }
    ]);

    useEffect(() => {
        Promise.all([
            customerApi.getAll(),
            employeeApi.getAll(),
            shipperApi.getAll(),
            getProducts({ page: 1, pageSize: 1000 })
        ]).then(([cust, emp, ship, prod]) => {
            setCustomers(cust);
            setEmployees(emp);
            setShippers(ship);
            setProducts(prod.items);
        }).catch(console.error);
    }, []);

    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
        defaultValues: {
            customerId: '',
            employeeId: '0',
            shipperId: '0',
            freight: '0'
        },
    });

    const addDetail = () => {
        setDetails([...details, { productId: '0', quantity: '1', unitPrice: '0', discount: '0' }]);
    };

    const removeDetail = (index: number) => {
        setDetails(details.filter((_, i) => i !== index));
    };

    const updateDetail = (index: number, field: keyof OrderDetailForm, value: string) => {
        const newDetails = [...details];
        newDetails[index][field] = value;
        // Auto-fill price if product changes
        if (field === 'productId') {
            const product = products.find(p => p.id === parseInt(value));
            if (product) {
                newDetails[index].unitPrice = product.price.toString();
            }
        }
        setDetails(newDetails);
    };

    const onSubmit = async (data: FormValues) => {
        setFormError('');
        if (!data.customerId) { setFormError('El cliente es requerido'); return; }
        if (details.length === 0) { setFormError('Debes agregar al menos un producto a la orden.'); return; }
        if (details.some(d => d.productId === '0' || parseInt(d.quantity) < 1)) {
            setFormError('Todos los detalles deben tener un producto válido y cantidad mayor a 0.');
            return;
        }

        const payload: CreateOrderDto = {
            customerId: data.customerId,
            employeeId: parseInt(data.employeeId) || 1, // Fallback si falla
            shipperId: parseInt(data.shipperId) || 1,
            freight: parseFloat(data.freight) || 0,
            details: details.map(d => ({
                productId: parseInt(d.productId),
                unitPrice: parseFloat(d.unitPrice),
                quantity: parseInt(d.quantity),
                discount: parseFloat(d.discount) || 0
            }))
        };

        setLoading(true);
        try {
            await orderApi.create(payload);
            navigate('/orders');
        } catch (err) {
            console.error(err);
            setFormError('Error al guardar la orden. Revisa los datos (ej. ID no exista, o DB constraints).');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '860px', margin: '0 auto' }}>
            <button className="btn btn-secondary" onClick={() => navigate(-1)} style={{ marginBottom: '1.5rem' }}>
                <ArrowLeft size={15} /> Volver
            </button>

            <h1 style={{ margin: '0 0 0.3rem', fontSize: '1.4rem' }}>Nueva Órden</h1>
            <p style={{ margin: '0 0 1.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                Registra una nueva órden con sus productos
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
                    <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem' }}>Información General</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                        <div>
                            <label className="label">Cliente</label>
                            <select {...register('customerId', { required: 'Selecciona un cliente' })} className="select">
                                <option value="">Selecciona un cliente...</option>
                                {customers.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
                            </select>
                            {errors.customerId && <p className="error-msg">{errors.customerId.message}</p>}
                        </div>

                        <div>
                            <label className="label">Empleado</label>
                            <select {...register('employeeId')} className="select">
                                <option value="0">Selecciona (Opcional)</option>
                                {employees.map(e => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="label">Transportista</label>
                            <select {...register('shipperId')} className="select">
                                <option value="0">Selecciona (Opcional)</option>
                                {shippers.map(s => <option key={s.id} value={s.id}>{s.companyName}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="label">Flete (Costo Envío)</label>
                            <input {...register('freight')} className="input" type="number" step="0.01" min="0" defaultValue="0" />
                        </div>
                    </div>
                </div>

                <div className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Detalles de Órden (Productos)</h3>
                        <button type="button" className="btn btn-secondary" onClick={addDetail} style={{ padding: '0.4rem 0.75rem' }}>
                            <Plus size={14} /> Añadir Producto
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {details.map((detail, index) => (
                            <div key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.5rem', border: '1px solid var(--color-border)' }}>
                                <div style={{ flex: 2 }}>
                                    <label className="label" style={{ fontSize: '0.75rem' }}>Producto</label>
                                    <select className="select" value={detail.productId} onChange={(e) => updateDetail(index, 'productId', e.target.value)}>
                                        <option value="0">Seleccionar...</option>
                                        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label className="label" style={{ fontSize: '0.75rem' }}>Cantidad</label>
                                    <input className="input" type="number" min="1" value={detail.quantity} onChange={(e) => updateDetail(index, 'quantity', e.target.value)} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label className="label" style={{ fontSize: '0.75rem' }}>Precio Und.</label>
                                    <input className="input" type="number" step="0.01" value={detail.unitPrice} onChange={(e) => updateDetail(index, 'unitPrice', e.target.value)} />
                                </div>
                                <div>
                                    <label className="label" style={{ fontSize: '0.75rem' }}>&nbsp;</label>
                                    <button type="button" className="btn btn-danger" onClick={() => removeDetail(index)} disabled={details.length === 1} style={{ padding: '0.5rem 0.75rem' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {formError && (
                    <div style={{ padding: '0.75rem 1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.5rem', color: 'var(--color-danger)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                        {formError}
                    </div>
                )}

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1, padding: '0.75rem' }}>
                        <Save size={16} /> {loading ? 'Enviando...' : 'Crear Órden'}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/orders')} style={{ padding: '0.75rem 1.25rem' }}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};
