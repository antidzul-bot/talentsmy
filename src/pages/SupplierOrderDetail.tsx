import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Card, CardHeader, CardTitle, CardBody } from '../components/Card';
import { Button } from '../components/Button';
import { Input, Textarea } from '../components/Input';
import { Toast } from '../components/Toast';
import styles from './SupplierOrderDetail.module.css';

export const SupplierOrderDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const orders = useStore((state) => state.orders);
    const updateOrder = useStore((state) => state.updateOrder);
    const updateSupplierProgress = useStore((state) => state.updateSupplierProgress);

    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [showAffiliateForm, setShowAffiliateForm] = useState(false);
    const [showReportForm, setShowReportForm] = useState(false);

    // Affiliate submission state
    const [affiliateSheetUrl, setAffiliateSheetUrl] = useState('');
    const [checklist, setChecklist] = useState({
        linkAccessible: false,
        countMatches: false,
        allColumnsComplete: false,
        affiliatesSuitable: false,
    });

    // Video schedule state
    const [videoStartDate, setVideoStartDate] = useState('');
    const [videoDeadline, setVideoDeadline] = useState('');
    const [showVideoScheduleForm, setShowVideoScheduleForm] = useState(false);

    // Report submission state
    const [reportUrl, setReportUrl] = useState('');
    const [reportNotes, setReportNotes] = useState('');

    const order = orders.find((o) => o.id === id);

    if (!order) {
        return (
            <div className={styles['order-detail-page']}>
                <div className="container">
                    <Card>
                        <CardBody>
                            <h2>Order Not Found</h2>
                            <p>The order you're looking for doesn't exist.</p>
                            <Button onClick={() => navigate('/supplier')}>Back to Dashboard</Button>
                        </CardBody>
                    </Card>
                </div>
            </div>
        );
    }

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

    const handleStageUpdate = (field: keyof typeof order.supplierProgress, value: boolean) => {
        const updates: any = { [field]: value };

        if (value) {
            const dateField = `${field}Date` as keyof typeof order.supplierProgress;
            updates[dateField] = new Date().toISOString();
        }

        updateSupplierProgress(order.id, updates);
        setToast({ message: value ? 'Progress updated successfully' : 'Progress reverted', type: 'success' });
    };

    const handleAffiliateSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate Google Sheets URL
        if (!affiliateSheetUrl.includes('docs.google.com/spreadsheets')) {
            setToast({ message: 'Please enter a valid Google Sheets URL', type: 'error' });
            return;
        }

        // Check all checklist items
        const allChecked = Object.values(checklist).every(v => v === true);
        if (!allChecked) {
            setToast({ message: 'Please complete all checklist items', type: 'error' });
            return;
        }

        // Submit
        updateSupplierProgress(order.id, {
            affiliatesSubmitted: true,
            affiliatesSubmittedDate: new Date().toISOString(),
            affiliateSheetUrl,
            affiliateSheetChecklist: checklist,
        });

        setToast({ message: 'Affiliate list submitted successfully!', type: 'success' });
        setShowAffiliateForm(false);
        setAffiliateSheetUrl('');
        setChecklist({
            linkAccessible: false,
            countMatches: false,
            allColumnsComplete: false,
            affiliatesSuitable: false,
        });
    };

    const handlePaymentAction = (status: 'verified' | 'disputed') => {
        updateOrder(order.id, {
            supplierPaymentStatus: status,
            supplierPaymentVerifiedDate: new Date().toISOString()
        });
        setToast({
            message: status === 'verified' ? 'Payment verified! Thank you.' : 'Payment disputed. The agency will be notified.',
            type: status === 'verified' ? 'success' : 'error'
        });
    };

    const handleUpdatePackage = (count: string) => {
        const num = parseInt(count);
        if (!isNaN(num) && num > 0) {
            updateOrder(order.id, { affiliateCount: num });
            setToast({ message: `Package updated to ${num} affiliates`, type: 'success' });
        }
    };

    const handleVideoScheduleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!videoStartDate || !videoDeadline) {
            setToast({ message: 'Please enter both start date and deadline', type: 'error' });
            return;
        }

        updateSupplierProgress(order.id, {
            productionStarted: true,
            productionStartDate: new Date().toISOString(),
            videoStartDate,
            videoDeadline,
        });

        setToast({ message: 'Video schedule updated successfully!', type: 'success' });
        setShowVideoScheduleForm(false);
    };

    const handleReportSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!reportUrl) {
            setToast({ message: 'Please enter report URL', type: 'error' });
            return;
        }

        updateSupplierProgress(order.id, {
            reportSubmitted: true,
            reportSubmittedDate: new Date().toISOString(),
            reportUrl,
        });

        setToast({ message: 'Report submitted successfully!', type: 'success' });
        setShowReportForm(false);
        setReportUrl('');
        setReportNotes('');
    };



    const workflowStages = [
        {
            key: 'affiliatesSubmitted' as const,
            titleMalay: 'Sediakan Affiliate',
            titleEnglish: 'Prepare Affiliates',
            description: 'Submit affiliate list via Google Sheets according to package size',
            action: 'submit',
        },
        {
            key: 'briefingCompleted' as const,
            titleMalay: 'Briefing Affiliate',
            titleEnglish: 'Brief Affiliates',
            description: 'Brief affiliates about approved content guidelines',
            action: 'mark',
        },
        {
            key: 'samplesReceivedByAffiliates' as const,
            titleMalay: 'Affiliate Terima Sample',
            titleEnglish: 'Affiliates Receive Samples',
            description: 'Confirm all affiliates received product samples from client',
            action: 'mark',
        },
        {
            key: 'productionStarted' as const,
            titleMalay: 'Affiliate Mula Buat Video',
            titleEnglish: 'Affiliates Start Videos',
            description: 'Insert video production start date and deadline',
            action: 'schedule',
        },
        {
            key: 'allVideosCompleted' as const,
            titleMalay: 'Affiliate Siap Semua Video',
            titleEnglish: 'All Videos Completed',
            description: 'Confirm all videos completed according to package',
            action: 'mark',
        },
        {
            key: 'reportSubmitted' as const,
            titleMalay: 'Sediakan Laporan & Bukti',
            titleEnglish: 'Prepare Report & Proof',
            description: 'Submit final report URL',
            action: 'report',
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

            <div className={styles['page-header']}>
                <div className="container">
                    <Link to="/supplier" className={styles['back-button']}>
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Dashboard
                    </Link>
                    <h1 className={styles['page-title']}>Order #{order.trackingCode}</h1>
                    <p className={styles['page-subtitle']}>
                        Created {formatDate(order.createdAt)}
                    </p>
                </div>
            </div>

            <div className="container">
                <div className={styles['content-grid']}>
                    <div>
                        {/* Order Information */}
                        <div className={styles.section}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Order Information</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <div className={styles['info-grid']}>
                                        <div className={styles['info-item']}>
                                            <span className={styles['info-label']}>Client Name</span>
                                            <span className={styles['info-value']}>{order.clientName}</span>
                                        </div>
                                        <div className={styles['info-item']}>
                                            <span className={styles['info-label']}>Product Name</span>
                                            <span className={styles['info-value']}>{order.productName}</span>
                                        </div>
                                        <div className={styles['info-item']}>
                                            <span className={styles['info-label']}>Product Link</span>
                                            {order.productTikTokLink ? (
                                                <a href={order.productTikTokLink} target="_blank" rel="noopener noreferrer" className={styles['info-link']}>
                                                    View on TikTok →
                                                </a>
                                            ) : <span className={styles['info-value']}>N/A</span>}
                                        </div>
                                        <div className={styles['info-item']}>
                                            <span className={styles['info-label']}>Status</span>
                                            <span className={styles['status-badge']}>
                                                {order.status.replace(/_/g, ' ')}
                                            </span>
                                        </div>
                                        <div className={styles['info-item']}>
                                            <span className={styles['info-label']}>Package (Affiliates)</span>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                    <input
                                                        type="number"
                                                        defaultValue={order.affiliateCount}
                                                        style={{ width: '60px', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                                                        onBlur={(e) => handleUpdatePackage(e.target.value)}
                                                    />
                                                    <span className={styles['info-value']}>Affiliates</span>
                                                </div>
                                                <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>
                                                    Expected Total: {order.totalVideos} Videos
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {order.productDescription && (
                                        <div className={styles['info-item']} style={{ marginTop: 'var(--space-md)' }}>
                                            <span className={styles['info-label']}>Product Description</span>
                                            <p className={styles['info-value']} style={{ fontSize: '14px', lineHeight: '1.5' }}>{order.productDescription}</p>
                                        </div>
                                    )}

                                    {order.specialRequests && (
                                        <div className={styles['info-item']} style={{ marginTop: 'var(--space-md)' }}>
                                            <span className={styles['info-label']}>Special Requests</span>
                                            <p className={styles['info-value']} style={{ fontSize: '14px', lineHeight: '1.5', padding: '10px', background: 'var(--color-bg-secondary)', borderRadius: '8px' }}>
                                                {order.specialRequests}
                                            </p>
                                        </div>
                                    )}

                                    <div className={styles['shipment-section']} style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--color-border-light)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <h4 style={{ margin: 0, fontSize: '14px' }}>Client Shipment Proof</h4>
                                            {order.clientShipmentProofUrl ? (
                                                <a href={order.clientShipmentProofUrl} target="_blank" rel="noopener noreferrer" className={styles['sheet-link']}>
                                                    📦 View Proof →
                                                </a>
                                            ) : <span style={{ color: 'var(--color-text-tertiary)', fontSize: '12px' }}>Waiting for client to ship...</span>}
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>

                        {/* Agency Payment Verification */}
                        <div className={styles.section}>
                            <Card>
                                <CardHeader>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <CardTitle>Agency Payment Status</CardTitle>
                                        <div className={styles['status-badge']} style={{
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
                                </CardHeader>
                                <CardBody>
                                    <div style={{ padding: '15px', background: 'var(--color-bg-secondary)', borderRadius: '12px', marginBottom: '20px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                            <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', textTransform: 'uppercase' }}>Current Balance Status</span>
                                            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>RM {order.costSupplier.toLocaleString()}</span>
                                        </div>

                                        <div style={{ height: '4px', background: 'var(--color-border-light)', borderRadius: '2px', overflow: 'hidden' }}>
                                            <div style={{
                                                width: order.supplierPaymentStatus === 'verified' ? '100%' :
                                                    order.supplierPaymentStatus === 'pending_verification' ? '50%' : '5%',
                                                height: '100%',
                                                background: 'var(--color-primary)',
                                                transition: 'width 0.5s ease'
                                            }} />
                                        </div>
                                    </div>

                                    {order.supplierPaymentStatus === 'pending_verification' ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                            <div style={{ border: '2px solid var(--color-warning)', padding: '15px', borderRadius: '12px', background: 'var(--color-warning-bg)' }}>
                                                <h4 style={{ margin: '0 0 10px 0', color: 'var(--color-warning)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    🔔 Action Required: Verify Payment
                                                </h4>
                                                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '0 0 12px 0' }}>
                                                    The agency has marked this order as paid. Please check your bank account.
                                                </p>
                                                {order.supplierPaymentProofUrl && (
                                                    <div style={{ marginBottom: '15px' }}>
                                                        <a href={order.supplierPaymentProofUrl} target="_blank" rel="noopener noreferrer"
                                                            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '6px 12px', background: 'white', borderRadius: '6px', fontSize: '13px', color: 'var(--color-primary)', fontWeight: 'bold', textDecoration: 'none', border: '1px solid var(--color-primary)' }}>
                                                            📄 View Payment Receipt →
                                                        </a>
                                                    </div>
                                                )}
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <Button variant="primary" style={{ flex: 1 }} onClick={() => handlePaymentAction('verified')}>
                                                        ✅ I've Received Payment
                                                    </Button>
                                                    <Button variant="danger" style={{ flex: 1 }} onClick={() => handlePaymentAction('disputed')}>
                                                        ❌ No Payment Received
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : order.supplierPaymentStatus === 'verified' ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-success)', background: 'var(--color-success-bg)', padding: '15px', borderRadius: '12px' }}>
                                            <span style={{ fontSize: '24px' }}>✅</span>
                                            <div>
                                                <div style={{ fontWeight: 'bold' }}>Payment Verified</div>
                                                <div style={{ fontSize: '12px' }}>Confirmed on {new Date(order.supplierPaymentVerifiedDate!).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ textAlign: 'center', padding: '20px' }}>
                                            <p style={{ fontSize: '14px', color: 'var(--color-text-tertiary)', marginBottom: '15px' }}>
                                                Order cost is being processed by agency. Once the agency marks payment as complete, you can verify it here.
                                            </p>
                                            <Button variant="secondary" size="sm" onClick={() => {
                                                setToast({ message: 'Request sent to agency. They will process payment soon.', type: 'success' });
                                            }}>
                                                🔔 Nudge Agency for Payment
                                            </Button>
                                        </div>
                                    )}
                                </CardBody>
                            </Card>
                        </div>

                        {/* Content Guidelines */}
                        {order.contentGuidelines && (
                            <div className={styles.section}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Content Guidelines</CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                                            {order.contentGuidelines}
                                        </p>
                                    </CardBody>
                                </Card>
                            </div>
                        )}

                        {/* Workflow Progress */}
                        <div className={styles.section}>
                            <h2 className={styles['section-title']}>Supplier Workflow</h2>
                            <div className={styles['workflow-list']}>
                                {workflowStages.map((stage, index) => {
                                    const isCompleted = order.supplierProgress[stage.key];
                                    const dateField = `${stage.key}Date` as keyof typeof order.supplierProgress;
                                    const completedDate = order.supplierProgress[dateField] as string | undefined;

                                    return (
                                        <div key={stage.key} className={styles['workflow-item']}>
                                            <div className={styles['workflow-number']}>
                                                {isCompleted ? '✓' : index + 1}
                                            </div>
                                            <div className={styles['workflow-content']}>
                                                <div className={styles['workflow-title']}>
                                                    {stage.titleMalay}
                                                    <span className={styles['workflow-subtitle']}>({stage.titleEnglish})</span>
                                                </div>
                                                <div className={styles['workflow-description']}>
                                                    {stage.description}
                                                </div>
                                                {isCompleted && (
                                                    <div className={styles['workflow-date']}>
                                                        Completed: {formatDate(completedDate)}
                                                    </div>
                                                )}

                                                {/* Show submitted data */}
                                                {stage.key === 'affiliatesSubmitted' && order.supplierProgress.affiliateSheetUrl && (
                                                    <div className={styles['submitted-data']}>
                                                        <a
                                                            href={order.supplierProgress.affiliateSheetUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className={styles['sheet-link']}
                                                        >
                                                            📊 View Affiliate List →
                                                        </a>
                                                    </div>
                                                )}

                                                {stage.key === 'productionStarted' && order.supplierProgress.videoStartDate && (
                                                    <div className={styles['submitted-data']}>
                                                        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                                            <strong>Start Date:</strong> {new Date(order.supplierProgress.videoStartDate).toLocaleDateString()}
                                                        </div>
                                                        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                                            <strong>Deadline:</strong> {new Date(order.supplierProgress.videoDeadline!).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                )}

                                                {stage.key === 'reportSubmitted' && order.supplierProgress.reportUrl && (
                                                    <div className={styles['submitted-data']}>
                                                        <a
                                                            href={order.supplierProgress.reportUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className={styles['sheet-link']}
                                                        >
                                                            📄 View Report →
                                                        </a>
                                                    </div>
                                                )}

                                                <div className={styles['workflow-actions']}>
                                                    {!isCompleted && (
                                                        <>
                                                            {stage.action === 'submit' && (
                                                                <Button
                                                                    variant="primary"
                                                                    size="sm"
                                                                    onClick={() => setShowAffiliateForm(true)}
                                                                >
                                                                    Submit Affiliate List
                                                                </Button>
                                                            )}
                                                            {stage.action === 'mark' && (
                                                                <Button
                                                                    variant="primary"
                                                                    size="sm"
                                                                    onClick={() => handleStageUpdate(stage.key, true)}
                                                                >
                                                                    Mark Complete
                                                                </Button>
                                                            )}
                                                            {stage.action === 'schedule' && (
                                                                <Button
                                                                    variant="primary"
                                                                    size="sm"
                                                                    onClick={() => setShowVideoScheduleForm(true)}
                                                                >
                                                                    Set Video Schedule
                                                                </Button>
                                                            )}
                                                            {stage.action === 'report' && (
                                                                <Button
                                                                    variant="primary"
                                                                    size="sm"
                                                                    onClick={() => setShowReportForm(true)}
                                                                >
                                                                    Submit Report
                                                                </Button>
                                                            )}
                                                        </>
                                                    )}
                                                    {isCompleted && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleStageUpdate(stage.key, false)}
                                                        >
                                                            Undo
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className={styles.sidebar}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <div className={styles['summary-item']}>
                                    <span>Tracking Code:</span>
                                    <strong>{order.trackingCode}</strong>
                                </div>
                                <div className={styles['summary-item']}>
                                    <span>Package:</span>
                                    <strong>{order.affiliateCount} Affiliates</strong>
                                </div>
                                <div className={styles['summary-item']}>
                                    <span>Account Manager:</span>
                                    <strong>{order.accountManager}</strong>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Affiliate Submission Modal */}
            {showAffiliateForm && (
                <div className={styles.modal} onClick={() => setShowAffiliateForm(false)}>
                    <div className={styles['modal-content']} onClick={(e) => e.stopPropagation()}>
                        <h2 className={styles['modal-title']}>Submit Affiliate List</h2>
                        <form onSubmit={handleAffiliateSubmit}>
                            <Input
                                label="Google Sheets Link"
                                value={affiliateSheetUrl}
                                onChange={(e) => setAffiliateSheetUrl(e.target.value)}
                                placeholder="https://docs.google.com/spreadsheets/d/..."
                                helper="Sila pastikan link adalah 'Anyone with the link can view'"
                                required
                            />

                            <div className={styles['checklist-section']}>
                                <h3 className={styles['checklist-title']}>Checklist Sebelum Submit:</h3>
                                <div className={styles.checklist}>
                                    <label className={styles['checkbox-item']}>
                                        <input
                                            type="checkbox"
                                            checked={checklist.linkAccessible}
                                            onChange={(e) => setChecklist({ ...checklist, linkAccessible: e.target.checked })}
                                        />
                                        <span>Link set to "Anyone with the link can view"</span>
                                    </label>
                                    <label className={styles['checkbox-item']}>
                                        <input
                                            type="checkbox"
                                            checked={checklist.countMatches}
                                            onChange={(e) => setChecklist({ ...checklist, countMatches: e.target.checked })}
                                        />
                                        <span>Bilangan affiliate sama dengan pakej ({order.affiliateCount} affiliates)</span>
                                    </label>
                                    <label className={styles['checkbox-item']}>
                                        <input
                                            type="checkbox"
                                            checked={checklist.allColumnsComplete}
                                            onChange={(e) => setChecklist({ ...checklist, allColumnsComplete: e.target.checked })}
                                        />
                                        <span>Semua column lengkap (Nama, Alamat, Nombor Fon, Username/Link TikTok)</span>
                                    </label>
                                    <label className={styles['checkbox-item']}>
                                        <input
                                            type="checkbox"
                                            checked={checklist.affiliatesSuitable}
                                            onChange={(e) => setChecklist({ ...checklist, affiliatesSuitable: e.target.checked })}
                                        />
                                        <span>Semua affiliate sesuai dan memenuhi keperluan</span>
                                    </label>
                                </div>
                            </div>

                            <div className={styles['modal-actions']}>
                                <Button type="button" variant="secondary" onClick={() => setShowAffiliateForm(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="primary">
                                    Submit
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Video Schedule Modal */}
            {showVideoScheduleForm && (
                <div className={styles.modal} onClick={() => setShowVideoScheduleForm(false)}>
                    <div className={styles['modal-content']} onClick={(e) => e.stopPropagation()}>
                        <h2 className={styles['modal-title']}>Set Video Schedule</h2>
                        <form onSubmit={handleVideoScheduleSubmit}>
                            <Input
                                label="Video Start Date"
                                type="date"
                                value={videoStartDate}
                                onChange={(e) => setVideoStartDate(e.target.value)}
                                required
                            />
                            <Input
                                label="Video Completion Deadline"
                                type="date"
                                value={videoDeadline}
                                onChange={(e) => setVideoDeadline(e.target.value)}
                                style={{ marginTop: 'var(--space-md)' }}
                                required
                            />

                            <div className={styles['modal-actions']}>
                                <Button type="button" variant="secondary" onClick={() => setShowVideoScheduleForm(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="primary">
                                    Set Schedule
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Report Submission Modal */}
            {showReportForm && (
                <div className={styles.modal} onClick={() => setShowReportForm(false)}>
                    <div className={styles['modal-content']} onClick={(e) => e.stopPropagation()}>
                        <h2 className={styles['modal-title']}>Submit Final Report</h2>
                        <form onSubmit={handleReportSubmit}>
                            <Input
                                label="Report URL"
                                value={reportUrl}
                                onChange={(e) => setReportUrl(e.target.value)}
                                placeholder="https://drive.google.com/..."
                                helper="Link to final report (Google Drive, Dropbox, etc.)"
                                required
                            />

                            <Textarea
                                label="Notes (Optional)"
                                value={reportNotes}
                                onChange={(e) => setReportNotes(e.target.value)}
                                placeholder="Any additional notes about the campaign..."
                                rows={3}
                                style={{ marginTop: 'var(--space-lg)' }}
                            />

                            <div className={styles['modal-actions']}>
                                <Button type="button" variant="secondary" onClick={() => setShowReportForm(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="primary">
                                    Submit Report
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
