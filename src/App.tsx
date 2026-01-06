import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { PackagesPage } from './pages/PackagesPage';
import { ContactPage } from './pages/ContactPage';
import { AboutPage } from './pages/AboutPage';
import { ClientTracking } from './pages/ClientTracking';
import { AdminDashboard } from './pages/AdminDashboard';
import { OrderDetail } from './pages/OrderDetail';
import { NewOrder } from './pages/NewOrder';
import { PackageSettings } from './pages/PackageSettings';
import { SupplierDashboard } from './pages/SupplierDashboard';
import { SupplierOrderDetail } from './pages/SupplierOrderDetail';
import { SupplierSettings } from './pages/SupplierSettings';
import { AdminSuppliers } from './pages/AdminSuppliers';
import { Login } from './pages/Login';
import { AuthGuard } from './components/AuthGuard';
import { useStore } from './store';
import './index.css';



const App = () => {
    const initializeStore = useStore((state) => state.initialize);

    useEffect(() => {
        initializeStore();
    }, [initializeStore]);
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/packages" element={<PackagesPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/about" element={<AboutPage />} />

                <Route path="/track" element={<ClientTracking />} />
                <Route path="/login" element={<Login />} />

                {/* Admin Routes */}
                <Route path="/admin" element={
                    <AuthGuard allowedRoles={['OWNER', 'STAFF']}>
                        <AdminDashboard />
                    </AuthGuard>
                } />
                <Route path="/admin/suppliers" element={
                    <AuthGuard allowedRoles={['OWNER', 'STAFF']}>
                        <AdminSuppliers />
                    </AuthGuard>
                } />
                <Route path="/admin/orders/new" element={
                    <AuthGuard allowedRoles={['OWNER', 'STAFF']}>
                        <NewOrder />
                    </AuthGuard>
                } />
                <Route path="/admin/packages" element={
                    <AuthGuard allowedRoles={['OWNER', 'STAFF']}>
                        <PackageSettings />
                    </AuthGuard>
                } />
                <Route path="/admin/orders/:id" element={
                    <AuthGuard allowedRoles={['OWNER', 'STAFF']}>
                        <OrderDetail />
                    </AuthGuard>
                } />
                <Route path="/admin/orders/:id/edit" element={
                    <AuthGuard allowedRoles={['OWNER', 'STAFF']}>
                        <NewOrder />
                    </AuthGuard>
                } />

                {/* Supplier Routes */}
                <Route path="/supplier" element={
                    <AuthGuard allowedRoles={['SUPPLIER']}>
                        <SupplierDashboard />
                    </AuthGuard>
                } />
                <Route path="/supplier/orders/:id" element={
                    <AuthGuard allowedRoles={['SUPPLIER']}>
                        <SupplierOrderDetail />
                    </AuthGuard>
                } />
                <Route path="/supplier/settings" element={
                    <AuthGuard allowedRoles={['SUPPLIER']}>
                        <SupplierSettings />
                    </AuthGuard>
                } />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
