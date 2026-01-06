import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../store';
import { Button } from '../components/Button';
import { Input, Textarea, Select } from '../components/Input';
import styles from './NewOrder.module.css';

export const NewOrder: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const isEditing = !!id;
    const navigate = useNavigate();

    const addOrder = useStore((state) => state.addOrder);
    const updateOrder = useStore((state) => state.updateOrder);
    const suppliers = useStore((state) => state.suppliers);
    const orders = useStore((state) => state.orders);
    const packages = useStore((state) => state.packages.filter(p => p.isActive));

    const [priceDiscount, setPriceDiscount] = useState(0);

    const [formData, setFormData] = useState({
        // Account Management
        accountManager: '',

        // Client Info
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        productName: '',
        productDescription: '',
        productTikTokLink: '',

        // Payment Info
        paymentReceiptNumber: '',

        // Special Requests
        specialRequests: '',

        // Package
        selectedPackageId: '',

        // Assignment
        supplierId: '',
    });

    const [compliance, setCompliance] = useState({
        commissionSet: false,
        termsAcknowledged: false,
        verbalBriefing: false,
        shippingAcknowledged: false,
        contentGuidelinesProvided: false,
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Load existing data if editing
    useEffect(() => {
        if (isEditing) {
            const orderToEdit = orders.find(o => o.id === id);
            if (orderToEdit) {
                setFormData({
                    accountManager: orderToEdit.accountManager,
                    clientName: orderToEdit.clientName,
                    clientEmail: orderToEdit.clientEmail,
                    clientPhone: orderToEdit.clientPhone,
                    productName: orderToEdit.productName,
                    productDescription: orderToEdit.productDescription || '',
                    productTikTokLink: orderToEdit.productTikTokLink || '',
                    paymentReceiptNumber: orderToEdit.paymentReceiptNumber || '',
                    specialRequests: orderToEdit.specialRequests || '',
                    selectedPackageId: orderToEdit.packageId || '', // Fallback if packageId is missing
                    supplierId: orderToEdit.supplierId || '',
                });

                // If package ID from order isn't in current packages list (legacy), we might need to handle gracefully
                // For now assuming package exists or we just show blank selection

                setPriceDiscount(orderToEdit.priceDiscount || 0);

                if (orderToEdit.compliance) {
                    setCompliance(orderToEdit.compliance);
                }
            } else {
                setError('Order not found');
            }
        }
    }, [id, orders, isEditing]);

    const selectedPackage = packages.find(p => p.id === formData.selectedPackageId);

    // If editing, use stored values if package not found (legacy support), otherwise calculate
    // Actually, for consistency, let's rely on selectedPackage for calculations during edit too
    // But if we change package, we want recalculation.

    const finalPrice = selectedPackage ? selectedPackage.currentPrice - priceDiscount : 0;
    const profit = selectedPackage ? finalPrice - selectedPackage.supplierCost : 0;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePackageSelect = (packageId: string) => {
        setFormData(prev => ({ ...prev, selectedPackageId: packageId }));
    };

    const handleComplianceChange = (field: keyof typeof compliance) => {
        setCompliance(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const validateForm = (): boolean => {
        if (!formData.accountManager) {
            setError('Please specify the account manager');
            return false;
        }
        if (!formData.clientName || !formData.clientEmail || !formData.clientPhone) {
            setError('Please fill in all client information');
            return false;
        }
        if (!formData.productName) {
            setError('Please enter the product name');
            return false;
        }
        if (!formData.productTikTokLink) {
            setError('Please enter the TikTok product link');
            return false;
        }
        if (!formData.selectedPackageId) {
            setError('Please select a package');
            return false;
        }

        // Check compliance checklist
        const allCompliance = Object.values(compliance).every(v => v === true);
        if (!allCompliance) {
            setError('Please complete all compliance checklist items before creating the order');
            return false;
        }

        setError('');
        return true;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const selectedSupplier = suppliers.find(s => s.id === formData.supplierId);

        if (isEditing && id) {
            updateOrder(id, {
                accountManager: formData.accountManager,
                clientName: formData.clientName,
                clientEmail: formData.clientEmail,
                clientPhone: formData.clientPhone,
                productName: formData.productName,
                productDescription: formData.productDescription,
                productTikTokLink: formData.productTikTokLink || undefined,
                paymentReceiptNumber: formData.paymentReceiptNumber || undefined,
                specialRequests: formData.specialRequests || undefined,
                packageId: selectedPackage!.id,
                packageType: selectedPackage!.name,
                affiliateCount: selectedPackage!.affiliateCount,
                videoCountPerAffiliate: selectedPackage!.videoCountPerAffiliate,
                totalVideos: selectedPackage!.totalVideos,
                priceClient: finalPrice,
                priceDiscount: priceDiscount,
                costSupplier: selectedPackage!.supplierCost,
                profit,
                commissionRate: selectedPackage!.commissionRate,
                supplierId: formData.supplierId || undefined,
                supplierName: selectedSupplier?.name,
                compliance,
            });
        } else {
            addOrder({
                accountManager: formData.accountManager,
                clientName: formData.clientName,
                clientEmail: formData.clientEmail,
                clientPhone: formData.clientPhone,
                productName: formData.productName,
                productDescription: formData.productDescription,
                productTikTokLink: formData.productTikTokLink || undefined,
                paymentReceiptNumber: formData.paymentReceiptNumber || undefined,
                specialRequests: formData.specialRequests || undefined,
                packageId: selectedPackage!.id,
                packageType: selectedPackage!.name,
                affiliateCount: selectedPackage!.affiliateCount,
                videoCountPerAffiliate: selectedPackage!.videoCountPerAffiliate,
                totalVideos: selectedPackage!.totalVideos,
                priceClient: finalPrice,
                priceDiscount: priceDiscount,
                costSupplier: selectedPackage!.supplierCost,
                profit,
                commissionRate: selectedPackage!.commissionRate,
                supplierId: formData.supplierId || undefined,
                supplierName: selectedSupplier?.name,
                compliance,
                status: 'PENDING_PAYMENT',
                supplierPaymentStatus: 'unpaid',
                supplierProgress: {
                    affiliatesSubmitted: false,
                    briefingCompleted: false,
                    samplesReceivedByAffiliates: false,
                    productionStarted: false,
                    allVideosCompleted: false,
                    reportSubmitted: false,
                },
                progress: {
                    clientPaid: false,
                    supplierPaid: false,
                    guidelinesApproved: false,
                    agreementSigned: false,
                    commissionSet: compliance.commissionSet,
                    affiliatesSelected: false,
                    briefingCompleted: false,
                    samplesReceived: false,
                    productionStarted: false,
                    videosCompleted: false,
                    reportSent: false,
                },
                affiliates: [],
            });
        }

        setSuccess(true);

        // Redirect to order detail after 2 seconds
        setTimeout(() => {
            if (isEditing) {
                navigate(`/admin/orders/${id}`);
            } else {
                navigate('/admin');
            }
        }, 2000);
    };

    if (success) {
        return (
            <div className={styles['new-order-page']}>
                <div className="container">
                    <div className={styles['form-container']}>
                        <div className={styles['success-message']}>
                            <h2>✓ Order {isEditing ? 'Updated' : 'Created'} Successfully!</h2>
                            <p style={{ marginTop: 'var(--space-md)', marginBottom: 0 }}>
                                Redirecting...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles['new-order-page']}>
            <div className={styles['page-header']}>
                <div className="container">
                    <Link to="/admin" className={styles['back-button']}>
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Dashboard
                    </Link>
                    <h1 className={styles['page-title']}>{isEditing ? 'Edit Order' : 'Create New Order'}</h1>
                </div>
            </div>

            <div className="container">
                <form onSubmit={handleSubmit} className={styles['form-container']}>
                    {error && (
                        <div className={styles['error-message']}>
                            {error}
                        </div>
                    )}

                    {/* Account Management */}
                    <div className={styles['form-section']}>
                        <h2 className={styles['section-title']}>Account Management</h2>
                        <Input
                            label="Person in Charge (Account Manager)"
                            name="accountManager"
                            value={formData.accountManager}
                            onChange={handleInputChange}
                            placeholder="e.g., Ahmad, Sarah, etc."
                            required
                        />
                    </div>

                    {/* Client Information */}
                    <div className={styles['form-section']}>
                        <h2 className={styles['section-title']}>Client Information</h2>
                        <div className={styles['form-grid']}>
                            <Input
                                label="Client Name"
                                name="clientName"
                                value={formData.clientName}
                                onChange={handleInputChange}
                                placeholder="Full name or company name"
                                required
                            />
                            <Input
                                label="Email Address"
                                name="clientEmail"
                                type="email"
                                value={formData.clientEmail}
                                onChange={handleInputChange}
                                placeholder="client@example.com"
                                required
                            />
                            <Input
                                label="Phone Number"
                                name="clientPhone"
                                type="tel"
                                value={formData.clientPhone}
                                onChange={handleInputChange}
                                placeholder="+60123456789"
                                required
                            />
                        </div>
                    </div>

                    {/* Product Information */}
                    <div className={styles['form-section']}>
                        <h2 className={styles['section-title']}>Product Information</h2>
                        <div className={styles['form-grid']}>
                            <Input
                                label="Product Name"
                                name="productName"
                                value={formData.productName}
                                onChange={handleInputChange}
                                placeholder="e.g., Organic Skincare Set"
                                required
                            />
                            <Input
                                label="TikTok Product Link"
                                name="productTikTokLink"
                                value={formData.productTikTokLink}
                                onChange={handleInputChange}
                                placeholder="https://www.tiktok.com/@shop/..."
                                required
                            />
                        </div>
                        <Textarea
                            label="Product Description"
                            name="productDescription"
                            value={formData.productDescription}
                            onChange={handleInputChange}
                            placeholder="Brief description of the product..."
                            rows={3}
                        />
                    </div>

                    {/* Package Selection */}
                    <div className={styles['form-section']}>
                        <h2 className={styles['section-title']}>Select Package</h2>
                        <div className={styles['package-selector']}>
                            {packages.map((pkg) => (
                                <label key={pkg.id} className={styles['package-option']}>
                                    <input
                                        type="radio"
                                        name="selectedPackageId"
                                        value={pkg.id}
                                        checked={formData.selectedPackageId === pkg.id}
                                        onChange={() => handlePackageSelect(pkg.id)}
                                    />
                                    <div className={styles['package-card']}>
                                        <div className={styles['package-count']}>{pkg.affiliateCount}</div>
                                        <div className={styles['package-name']}>Affiliates</div>
                                        <div className={styles['package-price']}>RM{pkg.currentPrice.toLocaleString()}</div>
                                        <div className={styles['package-meta']}>{pkg.videoCountPerAffiliate} Video/Aff</div>
                                    </div>
                                </label>
                            ))}
                        </div>

                        {selectedPackage && (
                            <div className={styles['pricing-summary-container']} style={{ marginTop: '20px' }}>
                                <div className={styles['adjustment-section']} style={{ marginBottom: '20px', padding: '15px', background: 'var(--color-bg-secondary)', borderRadius: '8px' }}>
                                    <label style={{ fontSize: '14px', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
                                        Price Adjustment (Discount RM)
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{ fontWeight: 'bold' }}>- RM</span>
                                        <input
                                            type="number"
                                            value={priceDiscount}
                                            onChange={(e) => setPriceDiscount(parseFloat(e.target.value) || 0)}
                                            style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                                            placeholder="Enter discount amount..."
                                        />
                                    </div>
                                    <p style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', marginTop: '5px' }}>
                                        Adjust this to offer discounts or custom pricing for this client.
                                    </p>
                                </div>

                                <div className={styles['pricing-summary']}>
                                    <div className={styles['pricing-row']}>
                                        <span className={styles['pricing-label']}>Package Base Price:</span>
                                        <span className={styles['pricing-value']}>RM{selectedPackage.currentPrice.toLocaleString()}</span>
                                    </div>
                                    {priceDiscount > 0 && (
                                        <div className={styles['pricing-row']} style={{ color: 'var(--color-error)' }}>
                                            <span className={styles['pricing-label']}>Discount:</span>
                                            <span className={styles['pricing-value']}>- RM{priceDiscount.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className={styles['pricing-row']}>
                                        <span className={styles['pricing-label']}>Supplier Cost:</span>
                                        <span className={styles['pricing-value']}>RM{selectedPackage.supplierCost.toLocaleString()}</span>
                                    </div>
                                    <div className={`${styles['pricing-row']} ${styles['pricing-row-total']}`}>
                                        <div className={styles['pricing-item']}>
                                            <span className={styles['pricing-label']}>FINAL CLIENT PRICE:</span>
                                            <span className={styles['pricing-value']} style={{ fontSize: '24px', color: 'var(--color-primary)' }}>
                                                RM{finalPrice.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className={styles['pricing-item']} style={{ textAlign: 'right' }}>
                                            <span className={styles['pricing-label']}>NET PROFIT:</span>
                                            <span className={styles['pricing-value-profit']} style={{ fontSize: '24px' }}>
                                                RM{profit.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Payment Information */}
                    <div className={styles['form-section']}>
                        <h2 className={styles['section-title']}>Payment Information</h2>
                        <Input
                            label="Payment Receipt Number (Optional)"
                            name="paymentReceiptNumber"
                            value={formData.paymentReceiptNumber}
                            onChange={handleInputChange}
                            placeholder="e.g., RCP-2024-001"
                            helper="Enter the receipt reference number if payment received"
                        />
                    </div>

                    {/* Supplier Assignment */}
                    {suppliers.length > 0 && (
                        <div className={styles['form-section']}>
                            <h2 className={styles['section-title']}>Supplier Assignment (Optional)</h2>
                            <Select
                                label="Assign to Supplier"
                                name="supplierId"
                                value={formData.supplierId}
                                onChange={handleInputChange}
                                options={suppliers.map(s => ({ value: s.id, label: s.name }))}
                                helper="You can assign a supplier now or later"
                            />
                        </div>
                    )}

                    {/* Special Requests */}
                    <div className={styles['form-section']}>
                        <h2 className={styles['section-title']}>Special Requests</h2>
                        <Textarea
                            label="Special Requests from Client (Optional)"
                            name="specialRequests"
                            value={formData.specialRequests}
                            onChange={handleInputChange}
                            placeholder="Any special requirements or notes..."
                            rows={4}
                        />
                    </div>

                    {/* Compliance Checklist */}
                    <div className={styles['form-section']}>
                        <h2 className={styles['section-title']}>Compliance Checklist</h2>
                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)' }}>
                            Please confirm all items below before creating the order:
                        </p>
                        <div className={styles.checklist}>
                            <div className={styles['checkbox-item']}>
                                <input
                                    type="checkbox"
                                    id="commissionSet"
                                    checked={compliance.commissionSet}
                                    onChange={() => handleComplianceChange('commissionSet')}
                                />
                                <label htmlFor="commissionSet" className={styles['checkbox-label']}>
                                    ✓ Client has set 10% affiliate commission in TikTok Seller Center
                                </label>
                            </div>

                            <div className={styles['checkbox-item']}>
                                <input
                                    type="checkbox"
                                    id="termsAcknowledged"
                                    checked={compliance.termsAcknowledged}
                                    onChange={() => handleComplianceChange('termsAcknowledged')}
                                />
                                <label htmlFor="termsAcknowledged" className={styles['checkbox-label']}>
                                    ✓ Client is aware they cannot directly contact any affiliate from this service (Terms & Conditions)
                                </label>
                            </div>

                            <div className={styles['checkbox-item']}>
                                <input
                                    type="checkbox"
                                    id="verbalBriefing"
                                    checked={compliance.verbalBriefing}
                                    onChange={() => handleComplianceChange('verbalBriefing')}
                                />
                                <label htmlFor="verbalBriefing" className={styles['checkbox-label']}>
                                    ✓ Client has been briefed verbally about all Terms & Conditions
                                </label>
                            </div>

                            <div className={styles['checkbox-item']}>
                                <input
                                    type="checkbox"
                                    id="shippingAcknowledged"
                                    checked={compliance.shippingAcknowledged}
                                    onChange={() => handleComplianceChange('shippingAcknowledged')}
                                />
                                <label htmlFor="shippingAcknowledged" className={styles['checkbox-label']}>
                                    ✓ Client knows they must ship all product samples to affiliates
                                </label>
                            </div>

                            <div className={styles['checkbox-item']}>
                                <input
                                    type="checkbox"
                                    id="contentGuidelinesProvided"
                                    checked={compliance.contentGuidelinesProvided}
                                    onChange={() => handleComplianceChange('contentGuidelinesProvided')}
                                />
                                <label htmlFor="contentGuidelinesProvided" className={styles['checkbox-label']}>
                                    ✓ Content guidelines have been provided to client
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className={styles['form-actions']}>
                        <Button type="button" variant="secondary" onClick={() => navigate(isEditing ? `/admin/orders/${id}` : '/admin')}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            {isEditing ? 'Update Order' : 'Create Order'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
