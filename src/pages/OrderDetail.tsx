import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Card, CardHeader, CardTitle, CardBody } from '../components/Card';
import { Button } from '../components/Button';
import { Toast } from '../components/Toast';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { supabase } from '../lib/supabase';
import { Order } from '../types';
import styles from './OrderDetail.module.css';

export const OrderDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const orders = useStore((state) => state.orders);
    const isLoadingStore = useStore((state) => state.isLoading);
    const suppliers = useStore((state) => state.suppliers);
    const updateOrder = useStore((state) => state.updateOrder);
    const updateOrderProgress = useStore((state) => state.updateOrderProgress);
    const deleteOrder = useStore((state) => state.deleteOrder);

    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    // Local state for fallback fetching
    const [localOrder, setLocalOrder] = useState<Order | null>(null);
    const [localLoading, setLocalLoading] = useState(false);

    const order = orders.find((o) => o.id === id) || localOrder;
    const isLoading = isLoadingStore || localLoading;

    // Fallback fetch if store doesn't have it (e.g. direct link)
    useEffect(() => {
        if (!order && !isLoadingStore && id) {
            const fetchDirect = async () => {
                setLocalLoading(true);
                try {
                    const { data, error } = await supabase
                        .from('orders')
                        .select('*')
                        .eq('id', id)
                        .maybeSingle();

                    if (data) {
                        // Handle legacy JSON column structure vs new flat structure if applicable
                        // Currently store assumes 'data' column holds the object.
                        // But if we migrated to flat columns, simpler.
                        // We'll stick to store's assumption: d.data
                        const orderData = data.data || data;
                        setLocalOrder(orderData as Order);
                    }
                } catch (e) {
                    console.error(e);
                } finally {
                    setLocalLoading(false);
                }
            };
            fetchDirect();
        }
    }, [id, order, isLoadingStore]);

    if (isLoading) {
        return (
            <div className={styles['order-detail-page']}>
                <div className="container" style={{ display: 'flex', justifyContent: 'center', paddingTop: '100px' }}>
                    <h3>Loading Order Details...</h3>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className={styles['order-detail-page']}>
                <div className="container">
                    <Card>
                        <CardBody>
                            <h2>Order Not Found</h2>
                            <p>The order you're looking for doesn't exist or you don't have permission to view it.</p>
                            <Button onClick={() => navigate('/admin')}>Back to Dashboard</Button>
                        </CardBody>
                    </Card>
                </div>
            </div>
        );
    }

    const supplier = suppliers.find(s => s.id === order.supplierId);

    const formatCurrency = (amount: number) => `RM${amount.toLocaleString()}`;

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Not set';
        return new Date(dateString).toLocaleDateString('en-MY', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleProgressUpdate = (field: keyof typeof order.progress, value: boolean) => {
        const updates: any = { [field]: value };

        if (value) {
            const dateField = `${field}Date` as keyof typeof order.progress;
            updates[dateField] = new Date().toISOString();
        }

        updateOrderProgress(order.id, updates);
        setToast({ message: value ? 'Progress updated successfully' : 'Progress reverted', type: 'success' });
    };

    const handleDeleteOrder = () => {
        deleteOrder(order.id);
        setToast({ message: 'Order deleted successfully', type: 'success' });
        setTimeout(() => navigate('/admin'), 1500);
    };

    const progressSteps = [
        {
            key: 'clientPaid' as const,
            title: 'Client Payment Received',
            description: 'Payment confirmed from client',
        },
        {
            key: 'supplierPaid' as const,
            title: 'Supplier Payment Sent',
            description: 'Payment sent to supplier',
        },
        {
            key: 'guidelinesApproved' as const,
            title: 'Content Guidelines Approved',
            description: 'Client approved content guidelines',
        },
        {
            key: 'affiliatesSelected' as const,
            title: 'Affiliates Selected',
            description: 'Supplier selected suitable affiliates',
        },
        {
            key: 'samplesReceived' as const,
            title: 'Samples Received by Affiliates',
            description: 'All affiliates received product samples',
        },
        {
            key: 'productionStarted' as const,
            title: 'Video Production Started',
            description: 'Affiliates started creating content',
        },
        {
            key: 'videosCompleted' as const,
            title: 'Videos Completed',
            description: 'All videos finished and reviewed',
        },
        {
            key: 'reportSent' as const,
            title: 'Final Report Sent',
            description: 'Campaign report delivered to client',
        },
    ];

    return (
        <div className={styles['order-detail-page']}>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <ConfirmDialog
                isOpen={showDeleteDialog}
                title="Delete Order"
                message={`Are you sure you want to delete this order? This action cannot be undone. Please enter the tracking code "${order.trackingCode}" to confirm.`}
                confirmText="Delete Order"
                cancelText="Cancel"
                requireCode={true}
                expectedCode={order.trackingCode}
                onConfirm={handleDeleteOrder}
                onCancel={() => setShowDeleteDialog(false)}
            />

            <div className={styles['page-header']}>
                <div className="container">
                    <div className={styles['header-content']}>
                        <div>
                            <Link to="/admin" className={styles['back-button']}>
                                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Dashboard
                            </Link>
                            <h1 className={styles['page-title']}>Order #{order.trackingCode}</h1>
                            <p className={styles['page-subtitle']}>
                                Created {formatDate(order.createdAt)} • Last updated {formatDate(order.updatedAt)}
                            </p>
                        </div>
                        <span className={styles['status-badge']}>
                            {order.status.replace(/_/g, ' ')}
                        </span>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className={styles['content-grid']}>
                    <div>
                        {/* Account Management */}
                        <div className={styles.section}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Account Management</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <div className={styles['info-grid']}>
                                        <div className={styles['info-item']}>
                                            <span className={styles['info-label']}>Person in Charge</span>
                                            <span className={styles['info-value']}>{order.accountManager}</span>
                                        </div>
                                        <div className={styles['info-item']}>
                                            <span className={styles['info-label']}>Tracking Link</span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span className={styles['info-value']} style={{ fontFamily: 'monospace' }}>
                                                    {order.trackingCode}
                                                </span>
                                                <Button size="sm" variant="secondary" onClick={() => {
                                                    const url = `${window.location.origin}/track?code=${order.trackingCode}`;
                                                    navigator.clipboard.writeText(url);
                                                    alert('Tracking link copied to clipboard!');
                                                }}>
                                                    📋 Copy Link
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>

                        {/* Client Information */}
                        <div className={styles.section}>
                            <Card>
                                <CardHeader>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <CardTitle>Client Information</CardTitle>
                                        <div className={styles['shipment-status-badge']} style={{
                                            background: order.clientShipmentProofUrl ? 'var(--color-success-bg)' : 'var(--color-warning-bg)',
                                            color: order.clientShipmentProofUrl ? 'var(--color-success)' : 'var(--color-warning)',
                                            padding: '4px 12px',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            fontWeight: 'bold'
                                        }}>
                                            {order.clientShipmentProofUrl ? '📦 Shipped' : '⌛ Pending Shipment'}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <div className={styles['info-grid']}>
                                        <div className={styles['info-item']}>
                                            <span className={styles['info-label']}>Client Name</span>
                                            <span className={styles['info-value']}>{order.clientName}</span>
                                        </div>
                                        <div className={styles['info-item']}>
                                            <span className={styles['info-label']}>Email</span>
                                            <span className={styles['info-value']}>{order.clientEmail}</span>
                                        </div>
                                        <div className={styles['info-item']}>
                                            <span className={styles['info-label']}>Phone</span>
                                            <span className={styles['info-value']}>{order.clientPhone}</span>
                                        </div>
                                    </div>

                                    <div className={styles['logistics-section']} style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--color-border-light)' }}>
                                        <h4 style={{ fontSize: '14px', marginBottom: '12px' }}>Logistics & Shipment</h4>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <input
                                                type="text"
                                                placeholder="Enter Shipment Proof (Link/Tracking)..."
                                                className={styles['compact-input']}
                                                defaultValue={order.clientShipmentProofUrl}
                                                onBlur={(e) => updateOrder(order.id, { clientShipmentProofUrl: e.target.value })}
                                            />
                                            {order.clientShipmentProofUrl && (
                                                <a href={order.clientShipmentProofUrl} target="_blank" rel="noopener noreferrer" className={styles['sync-link']} style={{ whiteSpace: 'nowrap' }}>
                                                    View Proof →
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>

                        {/* Product Information */}
                        <div className={styles.section}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Product Information</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <div className={styles['info-grid']}>
                                        <div className={styles['info-item']}>
                                            <span className={styles['info-label']}>Product Name</span>
                                            <span className={styles['info-value']}>{order.productName}</span>
                                        </div>
                                        <div className={styles['info-item']}>
                                            <span className={styles['info-label']}>TikTok Product Link</span>
                                            {order.productTikTokLink ? (
                                                <a
                                                    href={order.productTikTokLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={styles['info-link']}
                                                >
                                                    View on TikTok →
                                                </a>
                                            ) : (
                                                <span className={styles['info-value']} style={{ color: 'var(--color-text-tertiary)' }}>
                                                    Not provided
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {order.productDescription && (
                                        <div className={styles['info-item']} style={{ marginTop: 'var(--space-md)' }}>
                                            <span className={styles['info-label']}>Description</span>
                                            <p className={styles['info-value']}>{order.productDescription}</p>
                                        </div>
                                    )}
                                </CardBody>
                            </Card>
                        </div>

                        {/* Package & Pricing */}
                        <div className={styles.section}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Package & Pricing</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <div className={styles['info-grid']}>
                                        <div className={styles['info-item']}>
                                            <span className={styles['info-label']}>Package Name</span>
                                            <span className={styles['info-value']}>{order.packageType}</span>
                                        </div>
                                        <div className={styles['info-item']}>
                                            <span className={styles['info-label']}>Volumes</span>
                                            <span className={styles['info-value']}>
                                                {order.affiliateCount} Affiliates • {order.totalVideos} Videos
                                            </span>
                                        </div>
                                        <div className={styles['info-item']}>
                                            <span className={styles['info-label']}>Client Price</span>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span className={styles['info-value']}>{formatCurrency(order.priceClient)}</span>
                                                {(order.priceDiscount ?? 0) > 0 && (
                                                    <span style={{ fontSize: '11px', color: 'var(--color-error)' }}>
                                                        (Discounted RM {(order.priceDiscount ?? 0).toLocaleString()})
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className={styles['info-item']}>
                                            <span className={styles['info-label']}>Supplier Cost</span>
                                            <span className={styles['info-value']}>{formatCurrency(order.costSupplier)}</span>
                                        </div>
                                        <div className={styles['info-item']}>
                                            <span className={styles['info-label']}>Profit</span>
                                            <span className={styles['info-value']} style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>
                                                {formatCurrency(order.profit)}
                                            </span>
                                        </div>
                                        <div className={styles['info-item']}>
                                            <span className={styles['info-label']}>Commission Rate</span>
                                            <span className={styles['info-value']}>{order.commissionRate}%</span>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>

                        {/* Payment Information */}
                        {order.paymentReceiptNumber && (
                            <div className={styles.section}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Payment Information</CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                        <div className={styles['info-item']}>
                                            <span className={styles['info-label']}>Receipt Number</span>
                                            <span className={styles['info-value']}>{order.paymentReceiptNumber}</span>
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>
                        )}

                        {/* Supplier Information */}
                        {supplier && (
                            <div className={styles.section}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Supplier Information</CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                        <div className={styles['info-grid']}>
                                            <div className={styles['info-item']}>
                                                <span className={styles['info-label']}>Supplier Name</span>
                                                <span className={styles['info-value']}>{supplier.name}</span>
                                            </div>
                                            <div className={styles['info-item']}>
                                                <span className={styles['info-label']}>Email</span>
                                                <span className={styles['info-value']}>{supplier.email}</span>
                                            </div>
                                            <div className={styles['info-item']}>
                                                <span className={styles['info-label']}>Phone</span>
                                                <span className={styles['info-value']}>{supplier.phone}</span>
                                            </div>
                                        </div>

                                        {/* Supplier Workflow Sync */}
                                        <div className={styles['supplier-sync-section']}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                                <h4 className={styles['sync-title']} style={{ margin: 0 }}>Supplier Progress Details</h4>
                                                {order.supplierProgress?.affiliateSheetUrl && (
                                                    <a href={order.supplierProgress.affiliateSheetUrl} target="_blank" rel="noopener noreferrer"
                                                        className={styles['prominent-affiliate-link']}
                                                        style={{
                                                            background: 'var(--color-primary)',
                                                            color: 'white',
                                                            padding: '8px 16px',
                                                            borderRadius: '8px',
                                                            textDecoration: 'none',
                                                            fontWeight: 'bold',
                                                            fontSize: '14px',
                                                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                                        }}>
                                                        🚀 VIEW AFFILIATE LIST
                                                    </a>
                                                )}
                                            </div>

                                            <div className={styles['sync-items-grid']}>
                                                <div className={styles['sync-item']}>
                                                    <span className={styles['sync-label']}>Video Start Date:</span>
                                                    {order.supplierProgress?.videoStartDate ? (
                                                        <span className={styles['sync-value']}>{new Date(order.supplierProgress.videoStartDate).toLocaleDateString()}</span>
                                                    ) : <span className={styles['sync-pending']}>Not set</span>}
                                                </div>

                                                <div className={styles['sync-item']}>
                                                    <span className={styles['sync-label']}>Video Deadline:</span>
                                                    {order.supplierProgress?.videoDeadline ? (
                                                        <span className={styles['sync-value']} style={{ color: 'var(--color-warning)', fontWeight: 'bold' }}>
                                                            {new Date(order.supplierProgress.videoDeadline).toLocaleDateString()}
                                                        </span>
                                                    ) : <span className={styles['sync-pending']}>Not set</span>}
                                                </div>

                                                <div className={styles['sync-item']}>
                                                    <span className={styles['sync-label']}>Final Report:</span>
                                                    {order.supplierProgress?.reportUrl ? (
                                                        <a href={order.supplierProgress.reportUrl} target="_blank" rel="noopener noreferrer" className={styles['sync-link']}>
                                                            📄 View Report
                                                        </a>
                                                    ) : <span className={styles['sync-pending']}>Pending</span>}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Payment verification between agency and supplier */}
                                        <div className={styles['payment-verification-section']} style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--color-border-light)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <h4 className={styles['sync-title']}>Supplier Payment Status</h4>
                                                <div className={styles['status-pill']} style={{
                                                    padding: '4px 12px',
                                                    borderRadius: '12px',
                                                    fontSize: '12px',
                                                    fontWeight: 'bold',
                                                    background: order.supplierPaymentStatus === 'verified' ? 'var(--color-success-bg)' :
                                                        order.supplierPaymentStatus === 'disputed' ? 'var(--color-error-bg)' :
                                                            order.supplierPaymentStatus === 'pending_verification' ? 'var(--color-warning-bg)' : 'var(--color-bg-tertiary)',
                                                    color: order.supplierPaymentStatus === 'verified' ? 'var(--color-success)' :
                                                        order.supplierPaymentStatus === 'disputed' ? 'var(--color-error)' :
                                                            order.supplierPaymentStatus === 'pending_verification' ? 'var(--color-warning)' : 'var(--color-text-tertiary)'
                                                }}>
                                                    {order.supplierPaymentStatus.replace('_', ' ').toUpperCase()}
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                                <input
                                                    type="text"
                                                    placeholder="Payment Proof URL (e.g. Bank Receipt Link)..."
                                                    className={styles['compact-input']}
                                                    defaultValue={order.supplierPaymentProofUrl}
                                                    onBlur={(e) => updateOrder(order.id, { supplierPaymentProofUrl: e.target.value })}
                                                />
                                                <Button
                                                    size="sm"
                                                    variant={order.supplierPaymentStatus === 'unpaid' ? 'primary' : 'secondary'}
                                                    onClick={() => updateOrder(order.id, {
                                                        supplierPaymentStatus: 'pending_verification',
                                                        supplierPaymentDate: new Date().toISOString()
                                                    })}
                                                >
                                                    Mark as Paid
                                                </Button>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>
                        )}

                        {/* Compliance Checklist */}
                        <div className={styles.section}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Compliance Checklist</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <div className={styles['compliance-list']}>
                                        <div className={styles['compliance-item']}>
                                            <span className={order.compliance.commissionSet ? styles['check-yes'] : styles['check-no']}>
                                                {order.compliance.commissionSet ? '✓' : '✗'}
                                            </span>
                                            <span>Client set 10% affiliate commission</span>
                                        </div>
                                        <div className={styles['compliance-item']}>
                                            <span className={order.compliance.termsAcknowledged ? styles['check-yes'] : styles['check-no']}>
                                                {order.compliance.termsAcknowledged ? '✓' : '✗'}
                                            </span>
                                            <span>Client aware cannot contact affiliates directly</span>
                                        </div>
                                        <div className={styles['compliance-item']}>
                                            <span className={order.compliance.verbalBriefing ? styles['check-yes'] : styles['check-no']}>
                                                {order.compliance.verbalBriefing ? '✓' : '✗'}
                                            </span>
                                            <span>Client briefed verbally about T&C</span>
                                        </div>
                                        <div className={styles['compliance-item']}>
                                            <span className={order.compliance.shippingAcknowledged ? styles['check-yes'] : styles['check-no']}>
                                                {order.compliance.shippingAcknowledged ? '✓' : '✗'}
                                            </span>
                                            <span>Client knows must ship to affiliates</span>
                                        </div>
                                        <div className={styles['compliance-item']}>
                                            <span className={order.compliance.contentGuidelinesProvided ? styles['check-yes'] : styles['check-no']}>
                                                {order.compliance.contentGuidelinesProvided ? '✓' : '✗'}
                                            </span>
                                            <span>Content guidelines provided</span>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>

                        {/* Special Requests */}
                        {order.specialRequests && (
                            <div className={styles.section}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Special Requests</CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                                            {order.specialRequests}
                                        </p>
                                    </CardBody>
                                </Card>
                            </div>
                        )}

                        {/* Progress Tracking */}
                        <div className={styles.section}>
                            <h2 className={styles['section-title']}>Progress Tracking</h2>
                            <div className={styles['progress-list']}>
                                {progressSteps.map((step) => {
                                    const isCompleted = order.progress[step.key];
                                    const dateField = `${step.key}Date` as keyof typeof order.progress;
                                    const completedDate = order.progress[dateField] as string | undefined;

                                    return (
                                        <div key={step.key} className={styles['progress-item']}>
                                            <div className={styles['progress-info']}>
                                                <div className={styles['progress-title']}>{step.title}</div>
                                                <div className={styles['progress-date']}>
                                                    {isCompleted ? `Completed: ${formatDate(completedDate)}` : step.description}
                                                </div>
                                            </div>
                                            <div className={styles['progress-actions']}>
                                                {isCompleted ? (
                                                    <div className={styles['completed-indicator']}>
                                                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        Completed
                                                    </div>
                                                ) : (
                                                    <div className={styles['pending-indicator']}>Pending</div>
                                                )}
                                                <Button
                                                    size="sm"
                                                    variant={isCompleted ? 'ghost' : 'primary'}
                                                    onClick={() => handleProgressUpdate(step.key, !isCompleted)}
                                                >
                                                    {isCompleted ? 'Undo' : 'Mark Complete'}
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className={styles.sidebar}>
                        {/* Person in Charge */}
                        <Card style={{ marginBottom: 'var(--space-lg)' }}>
                            <CardHeader>
                                <CardTitle>Account Manager</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: 'var(--radius-full)',
                                        background: 'var(--color-primary-light)',
                                        color: 'var(--color-primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 'var(--font-size-xl)',
                                        fontWeight: 'var(--font-weight-semibold)',
                                    }}>
                                        {order.accountManager.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div style={{
                                            fontSize: 'var(--font-size-base)',
                                            fontWeight: 'var(--font-weight-semibold)',
                                            color: 'var(--color-text-primary)',
                                        }}>
                                            {order.accountManager}
                                        </div>
                                        <div style={{
                                            fontSize: 'var(--font-size-xs)',
                                            color: 'var(--color-text-tertiary)',
                                        }}>
                                            Person in Charge
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Countdown Timer */}
                        {order.progress.samplesReceived && order.progress.samplesReceivedDate && !order.progress.reportSent && (
                            <Card style={{ marginBottom: 'var(--space-lg)' }}>
                                <CardHeader>
                                    <CardTitle>Project Deadline</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    {(() => {
                                        const samplesDate = new Date(order.progress.samplesReceivedDate);
                                        const deadlineDate = new Date(samplesDate);

                                        // Add 14 working days (excluding weekends)
                                        let workingDaysAdded = 0;
                                        while (workingDaysAdded < 14) {
                                            deadlineDate.setDate(deadlineDate.getDate() + 1);
                                            const dayOfWeek = deadlineDate.getDay();
                                            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                                                workingDaysAdded++;
                                            }
                                        }

                                        const now = new Date();
                                        const daysRemaining = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                                        const isOverdue = daysRemaining < 0;
                                        const isUrgent = daysRemaining <= 3 && daysRemaining >= 0;

                                        return (
                                            <div>
                                                <div style={{
                                                    fontSize: 'var(--font-size-xs)',
                                                    color: 'var(--color-text-tertiary)',
                                                    marginBottom: 'var(--space-sm)',
                                                }}>
                                                    Samples received: {formatDate(order.progress.samplesReceivedDate)}
                                                </div>
                                                <div style={{
                                                    fontSize: 'var(--font-size-2xl)',
                                                    fontWeight: 'var(--font-weight-bold)',
                                                    color: isOverdue ? 'var(--color-error)' : isUrgent ? 'var(--color-warning)' : 'var(--color-success)',
                                                    marginBottom: 'var(--space-xs)',
                                                }}>
                                                    {isOverdue ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days left`}
                                                </div>
                                                <div style={{
                                                    fontSize: 'var(--font-size-xs)',
                                                    color: 'var(--color-text-secondary)',
                                                }}>
                                                    Deadline: {deadlineDate.toLocaleDateString('en-MY', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </div>
                                                <div style={{
                                                    marginTop: 'var(--space-md)',
                                                    padding: 'var(--space-sm)',
                                                    background: isOverdue ? 'var(--color-error-bg)' : isUrgent ? 'var(--color-warning-bg)' : 'var(--color-success-bg)',
                                                    borderRadius: 'var(--radius-sm)',
                                                    fontSize: 'var(--font-size-xs)',
                                                    color: isOverdue ? 'var(--color-error)' : isUrgent ? 'var(--color-warning)' : 'var(--color-success)',
                                                    fontWeight: 'var(--font-weight-medium)',
                                                    textAlign: 'center',
                                                }}>
                                                    {isOverdue ? '⚠️ Project Overdue' : isUrgent ? '⏰ Urgent' : '✓ On Track'}
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </CardBody>
                            </Card>
                        )}

                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <div className={styles['quick-actions']}>
                                    <Button
                                        variant="primary"
                                        onClick={() => {
                                            window.location.href = `/track?code=${order.trackingCode}`;
                                        }}
                                    >
                                        📋 View Tracking Page
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onClick={() => navigate(`/admin/orders/${order.id}/edit`)}
                                    >
                                        ✏️ Edit Order Details
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onClick={() => {
                                            const phoneNumber = order.clientPhone.replace(/[^0-9]/g, '');
                                            const message = encodeURIComponent(
                                                `Hi ${order.clientName},\n\nThis is ${order.accountManager} from Talents.MY regarding your TikTok affiliate campaign for "${order.productName}".\n\nTracking Code: ${order.trackingCode}\n\nHow can I assist you today?`
                                            );
                                            window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
                                        }}
                                    >
                                        💬 Contact Client
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() => setShowDeleteDialog(true)}
                                    >
                                        🗑️ Delete Order
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>

                        {order.notes && (
                            <Card style={{ marginTop: 'var(--space-lg)' }}>
                                <CardHeader>
                                    <CardTitle>Notes</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                        {order.notes}
                                    </p>
                                </CardBody>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
