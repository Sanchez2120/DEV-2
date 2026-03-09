import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute, PublicRoute } from './components/AuthGuard';
import { Sidebar } from './components/Sidebar';
import { LoginPage } from './pages/LoginPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductFormPage } from './pages/ProductFormPage';
import { DashboardPage } from './pages/DashboardPage';
import { SuppliersPage } from './pages/SuppliersPage';
import { CustomersPage } from './pages/CustomersPage';
import { ShippersPage } from './pages/ShippersPage';
import { EmployeesPage } from './pages/EmployeesPage';
import { OrdersPage } from './pages/OrdersPage';
import { SupplierFormPage } from './pages/SupplierFormPage';
import { CustomerFormPage } from './pages/CustomerFormPage';
import { ShipperFormPage } from './pages/ShipperFormPage';
import { EmployeeFormPage } from './pages/EmployeeFormPage';
import { OrderFormPage } from './pages/OrderFormPage';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/products': 'Productos',
  '/products/new': 'Nuevo Producto',
  '/suppliers': 'Proveedores',
  '/customers': 'Clientes',
  '/shippers': 'Transportistas',
  '/shippers/new': 'Nuevo Transportista',
  '/employees': 'Empleados',
  '/employees/new': 'Nuevo Empleado',
  '/orders': 'Órdenes',
  '/orders/new': 'Nueva Órden',
};

const Topbar = () => {
  const location = useLocation();
  const isEdit = location.pathname.includes('/edit');
  const title = isEdit ? 'Editar Producto' : (pageTitles[location.pathname] ?? 'Asisya');
  return (
    <header className="topbar">
      <span className="topbar-breadcrumb">Asisya /</span>
      <span className="topbar-title">{title}</span>
    </header>
  );
};

const Layout = () => (
  <div className="app-shell">
    <Sidebar />
    <div className="main-area">
      <Topbar />
      <main className="page-content fade-in">
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/new" element={<ProductFormPage />} />
          <Route path="/products/:id/edit" element={<ProductFormPage />} />
          <Route path="/suppliers" element={<SuppliersPage />} />
          <Route path="/suppliers/new" element={<SupplierFormPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/customers/new" element={<CustomerFormPage />} />
          <Route path="/shippers" element={<ShippersPage />} />
          <Route path="/shippers/new" element={<ShipperFormPage />} />
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/employees/new" element={<EmployeeFormPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/new" element={<OrderFormPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="/*" element={<Layout />} />
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
