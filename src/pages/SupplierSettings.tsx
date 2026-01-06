import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';
import { Card, CardHeader, CardTitle, CardBody } from '../components/Card';
import { Button } from '../components/Button';
import { Input, Textarea } from '../components/Input';
import { Toast } from '../components/Toast';
import styles from './SupplierSettings.module.css';

export const SupplierSettings: React.FC = () => {
    const suppliers = useStore((state) => state.suppliers);
    const updateSupplier = useStore((state) => state.updateSupplier);

    // For now, use the first supplier (later: use logged-in supplier)
    const currentSupplier = suppliers[0];

    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        companyName: '',
        address: '',
        backupContactName: '',
        backupContactEmail: '',
        backupContactPhone: '',
        businessRegistrationNumber: '',
        bankAccountNumber: '',
        bankName: '',
        notes: '',
    });

    useEffect(() => {
        if (currentSupplier) {
            setFormData({
                name: currentSupplier.name || '',
                email: currentSupplier.email || '',
                phone: currentSupplier.phone || '',
                companyName: currentSupplier.companyName || '',
                address: currentSupplier.address || '',
                backupContactName: currentSupplier.backupContactName || '',
                backupContactEmail: currentSupplier.backupContactEmail || '',
                backupContactPhone: currentSupplier.backupContactPhone || '',
                businessRegistrationNumber: currentSupplier.businessRegistrationNumber || '',
                bankAccountNumber: currentSupplier.bankAccountNumber || '',
                bankName: currentSupplier.bankName || '',
                notes: currentSupplier.notes || '',
            });
        }
    }, [currentSupplier]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentSupplier) {
            setToast({ message: 'No supplier found', type: 'error' });
            return;
        }

        // Validate required fields
        if (!formData.name || !formData.email || !formData.phone) {
            setToast({ message: 'Please fill in all required fields', type: 'error' });
            return;
        }

        // Update supplier
        updateSupplier(currentSupplier.id, {
            ...formData,
            updatedAt: new Date().toISOString(),
        });

        setToast({ message: 'Settings updated successfully! Changes synced to agency.', type: 'success' });
    };

    if (!currentSupplier) {
        return (
            <div className={styles['settings-page']}>
                <div className="container">
                    <Card>
                        <CardBody>
                            <h2>No Supplier Found</h2>
                            <p>Please contact the administrator.</p>
                            <Link to="/supplier">
                                <Button>Back to Dashboard</Button>
                            </Link>
                        </CardBody>
                    </Card>
                </div>
            </div>
        );
    }

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
                    <Link to="/supplier" className={styles['back-button']}>
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Dashboard
                    </Link>
                    <h1 className={styles['page-title']}>Supplier Settings</h1>
                    <p className={styles['page-subtitle']}>Manage your profile and contact information</p>
                </div>
            </div>

            <div className="container">
                <form onSubmit={handleSubmit}>
                    <div className={styles['content-grid']}>
                        <div>
                            {/* Primary Contact Information */}
                            <div className={styles.section}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Primary Contact Information</CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                        <div className={styles['form-grid']}>
                                            <Input
                                                label="Contact Person Name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="e.g., Ahmad Ibrahim"
                                                required
                                            />
                                            <Input
                                                label="Email Address"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="ahmad@agency.com"
                                                required
                                            />
                                            <Input
                                                label="Phone Number"
                                                name="phone"
                                                type="tel"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                placeholder="+60123456789"
                                                required
                                            />
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>

                            {/* Company Details */}
                            <div className={styles.section}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Company Details</CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                        <div className={styles['form-grid']}>
                                            <Input
                                                label="Company Name"
                                                name="companyName"
                                                value={formData.companyName}
                                                onChange={handleInputChange}
                                                placeholder="e.g., TikTok Agency Malaysia Sdn Bhd"
                                            />
                                            <Input
                                                label="Business Registration Number"
                                                name="businessRegistrationNumber"
                                                value={formData.businessRegistrationNumber}
                                                onChange={handleInputChange}
                                                placeholder="e.g., 202301234567"
                                            />
                                        </div>
                                        <Textarea
                                            label="Business Address"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            placeholder="Full business address..."
                                            rows={3}
                                            style={{ marginTop: 'var(--space-md)' }}
                                        />
                                    </CardBody>
                                </Card>
                            </div>

                            {/* Backup Contact */}
                            <div className={styles.section}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Backup Contact</CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                        <p className={styles['section-description']}>
                                            Provide an alternative contact person in case the primary contact is unavailable
                                        </p>
                                        <div className={styles['form-grid']}>
                                            <Input
                                                label="Backup Contact Name"
                                                name="backupContactName"
                                                value={formData.backupContactName}
                                                onChange={handleInputChange}
                                                placeholder="e.g., Siti Nurhaliza"
                                            />
                                            <Input
                                                label="Backup Email"
                                                name="backupContactEmail"
                                                type="email"
                                                value={formData.backupContactEmail}
                                                onChange={handleInputChange}
                                                placeholder="backup@agency.com"
                                            />
                                            <Input
                                                label="Backup Phone"
                                                name="backupContactPhone"
                                                type="tel"
                                                value={formData.backupContactPhone}
                                                onChange={handleInputChange}
                                                placeholder="+60198765432"
                                            />
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>

                            {/* Banking Information */}
                            <div className={styles.section}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Banking Information</CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                        <p className={styles['section-description']}>
                                            For payment processing
                                        </p>
                                        <div className={styles['form-grid']}>
                                            <Input
                                                label="Bank Name"
                                                name="bankName"
                                                value={formData.bankName}
                                                onChange={handleInputChange}
                                                placeholder="e.g., Maybank, CIMB, etc."
                                            />
                                            <Input
                                                label="Bank Account Number"
                                                name="bankAccountNumber"
                                                value={formData.bankAccountNumber}
                                                onChange={handleInputChange}
                                                placeholder="e.g., 1234567890"
                                            />
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>

                            {/* Additional Notes */}
                            <div className={styles.section}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Additional Notes</CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                        <Textarea
                                            label="Notes"
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleInputChange}
                                            placeholder="Any additional information or special requirements..."
                                            rows={4}
                                            helper="This information will be visible to the agency"
                                        />
                                    </CardBody>
                                </Card>
                            </div>

                            {/* Form Actions */}
                            <div className={styles['form-actions']}>
                                <Button type="button" variant="secondary" onClick={() => window.history.back()}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="primary">
                                    Save Changes
                                </Button>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className={styles.sidebar}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Information</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <div className={styles['info-box']}>
                                        <div className={styles['info-icon']}>ℹ️</div>
                                        <h4>Real-Time Sync</h4>
                                        <p>
                                            All changes you make here will be instantly synced to the agency dashboard.
                                            The agency will be notified of any updates to your contact information.
                                        </p>
                                    </div>

                                    <div className={styles['info-box']} style={{ marginTop: 'var(--space-lg)' }}>
                                        <div className={styles['info-icon']}>🔒</div>
                                        <h4>Data Privacy</h4>
                                        <p>
                                            Your information is securely stored and only accessible to authorized agency staff.
                                        </p>
                                    </div>

                                    {currentSupplier.updatedAt && (
                                        <div className={styles['last-updated']}>
                                            <small>
                                                Last updated: {new Date(currentSupplier.updatedAt).toLocaleDateString('en-MY', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </small>
                                        </div>
                                    )}
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
