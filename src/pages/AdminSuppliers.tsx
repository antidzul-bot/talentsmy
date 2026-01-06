import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Card, CardHeader, CardTitle, CardBody } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Supplier } from '../types';
import { Toast } from '../components/Toast';
import styles from './AdminSuppliers.module.css';

export const AdminSuppliers: React.FC = () => {
    const navigate = useNavigate();
    const suppliers = useStore((state) => state.suppliers);
    const addSupplier = useStore((state) => state.addSupplier);
    const updateSupplier = useStore((state) => state.updateSupplier);
    const deleteSupplier = useStore((state) => state.deleteSupplier);

    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const initialFormState = {
        name: '',
        email: '',
        phone: '',
        active: true,
    };

    const [formData, setFormData] = useState(initialFormState);

    const handleEdit = (supplier: Supplier) => {
        setEditingSupplier(supplier);
        setFormData({
            name: supplier.name,
            email: supplier.email,
            phone: supplier.phone,
            active: supplier.active,
        });
        setIsAdding(true);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingSupplier) {
            updateSupplier(editingSupplier.id, formData);
            setToast({ message: 'Supplier updated successfully', type: 'success' });
        } else {
            addSupplier(formData);
            setToast({ message: 'Supplier added successfully', type: 'success' });
        }

        setIsAdding(false);
        setEditingSupplier(null);
        setFormData(initialFormState);
    };

    return (
        <div className={styles['suppliers-page']}>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div className={styles['page-header']}>
                <div className="container">
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <Button variant="secondary" onClick={() => navigate('/admin')}>← Dashboard</Button>
                        <div>
                            <h1 className={styles['page-title']}>Supplier Management</h1>
                            <p className={styles['page-subtitle']}>Create and manage agency suppliers</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container" style={{ marginTop: '2rem' }}>
                <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                    {!isAdding && (
                        <Button onClick={() => setIsAdding(true)}>+ Add New Supplier</Button>
                    )}
                </div>

                {isAdding ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>{editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <form onSubmit={handleSave} className={styles['supplier-form']}>
                                <div className={styles['form-grid']}>
                                    <Input
                                        label="Supplier Name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. MIERA LEGACY"
                                        required
                                    />
                                    <Input
                                        label="Email Address"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="supplier@example.com"
                                        required
                                    />
                                    <Input
                                        label="Phone Number"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="+60123456789"
                                        required
                                    />
                                    <div className={styles['form-group']}>
                                        <label style={{ fontSize: '14px', marginBottom: '8px', display: 'block' }}>Status</label>
                                        <select
                                            value={formData.active ? 'active' : 'inactive'}
                                            className={styles['select-input']}
                                            onChange={(e) => setFormData({ ...formData, active: e.target.value === 'active' })}
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>
                                <div className={styles['form-actions']}>
                                    <Button variant="secondary" onClick={() => {
                                        setIsAdding(false);
                                        setEditingSupplier(null);
                                        setFormData(initialFormState);
                                    }}>
                                        Cancel
                                    </Button>
                                    <Button type="submit">
                                        {editingSupplier ? 'Update Supplier' : 'Add Supplier'}
                                    </Button>
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                ) : (
                    <div className={styles['suppliers-list']}>
                        {suppliers.length === 0 ? (
                            <Card>
                                <CardBody>
                                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                                        <p style={{ color: 'var(--color-text-tertiary)' }}>No suppliers found. Add one to get started.</p>
                                    </div>
                                </CardBody>
                            </Card>
                        ) : (
                            <div className={styles['table-container']}>
                                <table className={styles['suppliers-table']}>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {suppliers.map((supplier) => (
                                            <tr key={supplier.id}>
                                                <td className={styles['supplier-name-cell']}>{supplier.name}</td>
                                                <td>{supplier.email}</td>
                                                <td>{supplier.phone}</td>
                                                <td>
                                                    <span className={supplier.active ? styles['status-active'] : styles['status-inactive']}>
                                                        {supplier.active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <Button variant="secondary" size="sm" onClick={() => handleEdit(supplier)}>Edit</Button>
                                                        <Button variant="danger" size="sm" onClick={() => {
                                                            if (window.confirm(`Are you sure you want to delete ${supplier.name}?`)) {
                                                                deleteSupplier(supplier.id);
                                                                setToast({ message: 'Supplier deleted', type: 'success' });
                                                            }
                                                        }}>Delete</Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
