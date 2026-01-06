import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Card, CardHeader, CardTitle, CardBody } from '../components/Card';
import { Button } from '../components/Button';
import { Input, Textarea } from '../components/Input';
import { CampaignPackage } from '../types';
import { Toast } from '../components/Toast';
import styles from './PackageSettings.module.css';

export const PackageSettings: React.FC = () => {
    const packages = useStore((state) => state.packages);
    const addPackage = useStore((state) => state.addPackage);
    const updatePackage = useStore((state) => state.updatePackage);
    const deletePackage = useStore((state) => state.deletePackage);
    const navigate = useNavigate();

    const [editingPkg, setEditingPkg] = useState<CampaignPackage | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const initialFormState = {
        name: '',
        affiliateCount: 100,
        videoCountPerAffiliate: 1,
        totalVideos: 100,
        originalPrice: 0,
        currentPrice: 0,
        commissionRate: 10,
        supplierCost: 1000,
        description: '',
        isActive: true,
    };

    const [formData, setFormData] = useState(initialFormState);

    const handleEdit = (pkg: CampaignPackage) => {
        setEditingPkg(pkg);
        setFormData({
            name: pkg.name,
            affiliateCount: pkg.affiliateCount,
            videoCountPerAffiliate: pkg.videoCountPerAffiliate,
            totalVideos: pkg.totalVideos,
            originalPrice: pkg.originalPrice,
            currentPrice: pkg.currentPrice,
            commissionRate: pkg.commissionRate,
            supplierCost: pkg.supplierCost,
            description: pkg.description,
            isActive: pkg.isActive,
        });
        setIsAdding(true);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        // Calculate total videos if not updated
        const finalData = {
            ...formData,
            totalVideos: formData.affiliateCount * formData.videoCountPerAffiliate
        };

        if (editingPkg) {
            updatePackage(editingPkg.id, finalData);
            setToast({ message: 'Package updated successfully', type: 'success' });
        } else {
            addPackage(finalData);
            setToast({ message: 'Package added successfully', type: 'success' });
        }

        setIsAdding(false);
        setEditingPkg(null);
        setFormData(initialFormState);
    };

    return (
        <div className={styles['settings-page']}>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div className={styles['page-header']}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                            <Button variant="secondary" onClick={() => navigate('/admin')}>← Dashboard</Button>
                            <div>
                                <h1 className={styles['page-title']}>Package Settings</h1>
                                <p className={styles['page-subtitle']}>Manage available campaign packages and pricing</p>
                            </div>
                        </div>
                        {!isAdding && (
                            <Button onClick={() => setIsAdding(true)}>+ Add New Package</Button>
                        )}
                    </div>
                </div>
            </div>

            <div className="container">
                {isAdding ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>{editingPkg ? 'Edit Package' : 'Create New Package'}</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <form onSubmit={handleSave} className={styles['package-form']}>
                                <div className={styles['form-grid']}>
                                    <div className={styles['form-group']}>
                                        <label>Package Name</label>
                                        <Input
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g. 100 Affiliates (Silver)"
                                            required
                                        />
                                    </div>
                                    <div className={styles['form-group']}>
                                        <label>Affiliate Count</label>
                                        <Input
                                            type="number"
                                            value={formData.affiliateCount}
                                            onChange={(e) => {
                                                const count = parseInt(e.target.value) || 0;
                                                setFormData({
                                                    ...formData,
                                                    affiliateCount: count,
                                                    totalVideos: count * formData.videoCountPerAffiliate
                                                });
                                            }}
                                            required
                                        />
                                    </div>
                                    <div className={styles['form-group']}>
                                        <label>Videos per Affiliate</label>
                                        <Input
                                            type="number"
                                            value={formData.videoCountPerAffiliate}
                                            onChange={(e) => {
                                                const perAff = parseInt(e.target.value) || 0;
                                                setFormData({
                                                    ...formData,
                                                    videoCountPerAffiliate: perAff,
                                                    totalVideos: formData.affiliateCount * perAff
                                                });
                                            }}
                                            required
                                        />
                                    </div>
                                    <div className={styles['form-group']}>
                                        <label>Original Price (RM)</label>
                                        <Input
                                            type="number"
                                            value={formData.originalPrice}
                                            onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || 0 })}
                                            required
                                        />
                                    </div>
                                    <div className={styles['form-group']}>
                                        <label>Selling Price (RM)</label>
                                        <Input
                                            type="number"
                                            value={formData.currentPrice}
                                            onChange={(e) => setFormData({ ...formData, currentPrice: parseFloat(e.target.value) || 0 })}
                                            required
                                        />
                                    </div>
                                    <div className={styles['form-group']}>
                                        <label>Supplier Cost (RM)</label>
                                        <Input
                                            type="number"
                                            value={formData.supplierCost}
                                            onChange={(e) => setFormData({ ...formData, supplierCost: parseFloat(e.target.value) || 0 })}
                                            required
                                        />
                                    </div>
                                    <div className={styles['form-group']}>
                                        <label>Commission Rate (%)</label>
                                        <Input
                                            type="number"
                                            value={formData.commissionRate}
                                            onChange={(e) => setFormData({ ...formData, commissionRate: parseInt(e.target.value) || 0 })}
                                            required
                                        />
                                    </div>
                                    <div className={styles['form-group']}>
                                        <label>Status</label>
                                        <select
                                            value={formData.isActive ? 'active' : 'inactive'}
                                            className={styles['select-input']}
                                            onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'active' })}
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>
                                <div className={styles['form-group']} style={{ marginTop: '1rem' }}>
                                    <label>Description</label>
                                    <Textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Briefly describe what's included..."
                                        rows={3}
                                    />
                                </div>
                                <div className={styles['modal-actions']}>
                                    <Button variant="secondary" onClick={() => {
                                        setIsAdding(false);
                                        setEditingPkg(null);
                                        setFormData(initialFormState);
                                    }}>
                                        Cancel
                                    </Button>
                                    <Button type="submit">
                                        {editingPkg ? 'Update Package' : 'Create Package'}
                                    </Button>
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                ) : (
                    <div className={styles['packages-grid']}>
                        {packages.map((pkg) => (
                            <Card key={pkg.id}>
                                <div className={styles['package-card-header']} style={{ background: pkg.isActive ? 'transparent' : '#f8f9fa' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <h3 className={styles['pkg-name']}>{pkg.name}</h3>
                                            <div className={styles['pkg-stats']}>
                                                {pkg.affiliateCount} Affiliates • {pkg.totalVideos} Videos Total
                                            </div>
                                        </div>
                                        <span className={pkg.isActive ? styles['status-active'] : styles['status-inactive']}>
                                            {pkg.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                                <CardBody>
                                    <div className={styles['pkg-pricing']}>
                                        <div className={styles['pricing-item']}>
                                            <span className={styles['pricing-label']}>Original</span>
                                            <span className={styles['pricing-old']}>RM {pkg.originalPrice.toLocaleString()}</span>
                                        </div>
                                        <div className={styles['pricing-item']}>
                                            <span className={styles['pricing-label']}>Selling Price</span>
                                            <span className={styles['pricing-current']}>RM {pkg.currentPrice.toLocaleString()}</span>
                                        </div>
                                        <div className={styles['pricing-item']}>
                                            <span className={styles['pricing-label']}>Supplier Cost</span>
                                            <span className={styles['pricing-cost']}>RM {pkg.supplierCost.toLocaleString()}</span>
                                        </div>
                                        <div className={styles['pricing-item']}>
                                            <span className={styles['pricing-label']}>Profit</span>
                                            <span className={styles['pricing-profit']}>RM {(pkg.currentPrice - pkg.supplierCost).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className={styles['pkg-actions']}>
                                        <Button variant="secondary" size="sm" onClick={() => handleEdit(pkg)}>Edit</Button>
                                        <Button variant="danger" size="sm" onClick={() => {
                                            if (window.confirm('Are you sure you want to delete this package?')) {
                                                deletePackage(pkg.id);
                                                setToast({ message: 'Package deleted', type: 'success' });
                                            }
                                        }}>Delete</Button>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
