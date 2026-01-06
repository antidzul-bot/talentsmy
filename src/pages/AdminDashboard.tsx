import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { Order } from '../types';
import styles from './AdminDashboard.module.css';

export const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const orders = useStore((state) => state.orders);
    const suppliers = useStore((state) => state.suppliers);
    const stats = useStore((state) => state.getDashboardStats());
    const updateOrder = useStore((state) => state.updateOrder);
    const logout = useStore((state) => state.logout);
    const currentUser = useStore((state) => state.currentUser);

    // Search and filter state
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [supplierFilter, setSupplierFilter] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10;

    // Filtered and searched orders
    const filteredOrders = useMemo(() => {
        let result = [...orders];

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(order =>
                order.trackingCode.toLowerCase().includes(query) ||
                order.clientName.toLowerCase().includes(query) ||
                order.productName.toLowerCase().includes(query)
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            if (statusFilter === 'pending_payment') {
                result = result.filter(order => !order.progress.clientPaid);
            } else if (statusFilter === 'in_progress') {
                result = result.filter(order => order.progress.clientPaid && order.status !== 'COMPLETED');
            } else if (statusFilter === 'completed') {
                result = result.filter(order => order.status === 'COMPLETED');
            }
        }

        // Supplier filter
        if (supplierFilter !== 'all') {
            result = result.filter(order => order.supplierId === supplierFilter);
        }

        return result;
    }, [orders, searchQuery, statusFilter, supplierFilter]);

    // Pagination
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * ordersPerPage,
        currentPage * ordersPerPage
    );

    // Reset to page 1 when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter, supplierFilter]);

    // Auto-approval logic for payment verification
    React.useEffect(() => {
        const now = new Date();
        orders.forEach(order => {
            if (order.supplierPaymentStatus === 'pending_verification' && order.supplierPaymentDate) {
                const payDate = new Date(order.supplierPaymentDate);
                const diffHours = (now.getTime() - payDate.getTime()) / (1000 * 60 * 60);
                if (diffHours >= 24) { // Auto approve after 24h
                    updateOrder(order.id, {
                        supplierPaymentStatus: 'verified',
                        supplierPaymentVerifiedDate: new Date().toISOString()
                    });
                }
            }
        });
    }, [orders, updateOrder]);

    const calculateProgress = (order: Order): number => {
        const progressSteps = [
            order.progress.clientPaid,
            order.progress.supplierPaid,
            order.progress.guidelinesApproved,
            order.progress.affiliatesSelected,
            order.progress.samplesReceived,
            order.progress.productionStarted,
            order.progress.videosCompleted,
            order.progress.reportSent,
        ];
        const completed = progressSteps.filter(Boolean).length;
        return Math.round((completed / progressSteps.length) * 100);
    };

    const formatCurrency = (amount: number) => {
        return `RM${amount.toLocaleString()}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-MY', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getFriendlyStatus = (order: Order) => {
        if (!order.progress.clientPaid) return { label: 'Awaiting Client Payment', color: 'var(--color-warning)' };
        if (!order.clientShipmentProofUrl) return { label: 'Awaiting Sample Shipment', color: 'var(--color-info)' };
        if (order.supplierPaymentStatus === 'pending_verification') return { label: 'Verify Supplier Payment', color: 'var(--color-warning)' };
        if (order.supplierPaymentStatus === 'verified') return { label: 'Paid to Supplier', color: 'var(--color-success)' };
        if (order.status === 'COMPLETED') return { label: 'Campaign Completed', color: 'var(--color-success)' };

        return { label: order.status.replace(/_/g, ' '), color: 'var(--color-text-secondary)' };
    };

    return (
        <div className={styles.dashboard}>
            <div className={styles['dashboard-header']}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h1 className={styles['dashboard-title']}>Admin Dashboard</h1>
                            <p className={styles['dashboard-subtitle']}>Welcome back, {currentUser?.name || 'Admin'}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <Button variant="secondary" onClick={() => logout()}>Logout</Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                {/* Stats Grid */}
                <div className={styles['stats-grid']}>
                    <div className={styles['stat-card']}>
                        <div className={styles['stat-header']}>
                            <span className={styles['stat-label']}>Total Revenue</span>
                            <div className={styles['stat-icon']}>
                                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className={styles['stat-value']}>{formatCurrency(stats.totalRevenue)}</div>
                        <div className={styles['stat-change']}>
                            <span>↗</span> From paid orders
                        </div>
                    </div>

                    <div className={styles['stat-card']}>
                        <div className={styles['stat-header']}>
                            <span className={styles['stat-label']}>Total Profit</span>
                            <div className={styles['stat-icon']}>
                                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className={styles['stat-value']}>{formatCurrency(stats.totalProfit)}</div>
                        <div className={styles['stat-change']}>
                            <span>↗</span> Net profit margin
                        </div>
                    </div>

                    <div className={styles['stat-card']}>
                        <div className={styles['stat-header']}>
                            <span className={styles['stat-label']}>Active Orders</span>
                            <div className={styles['stat-icon']}>
                                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className={styles['stat-value']}>{stats.activeOrders}</div>
                        <div className={styles['stat-change']}>
                            <span>→</span> In progress
                        </div>
                    </div>

                    <div className={styles['stat-card']}>
                        <div className={styles['stat-header']}>
                            <span className={styles['stat-label']}>Completed</span>
                            <div className={styles['stat-icon']}>
                                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className={styles['stat-value']}>{stats.completedOrders}</div>
                        <div className={styles['stat-change']}>
                            <span>✓</span> Successfully delivered
                        </div>
                    </div>
                </div>

                {/* Orders Section */}
                <div className={styles['section-header']}>
                    <h2 className={styles['section-title']}>Orders ({filteredOrders.length})</h2>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Button variant="secondary" onClick={() => navigate('/admin/suppliers')}>
                            👥 Suppliers
                        </Button>
                        <Button variant="secondary" onClick={() => navigate('/admin/packages')}>
                            📦 Packages
                        </Button>
                        <Button onClick={() => navigate('/admin/orders/new')}>
                            + New Order
                        </Button>
                    </div>
                </div>

                {/* Search and Filters */}
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginBottom: '20px',
                    flexWrap: 'wrap',
                    alignItems: 'center'
                }}>
                    <div style={{ flex: '1 1 300px' }}>
                        <Input
                            type="text"
                            placeholder="Search by tracking code, client, or product..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: '1px solid var(--color-border)',
                            background: 'var(--color-bg-secondary)',
                            color: 'var(--color-text-primary)',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="all">All Status</option>
                        <option value="pending_payment">Pending Payment</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                    <select
                        value={supplierFilter}
                        onChange={(e) => setSupplierFilter(e.target.value)}
                        style={{
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: '1px solid var(--color-border)',
                            background: 'var(--color-bg-secondary)',
                            color: 'var(--color-text-primary)',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="all">All Suppliers</option>
                        {suppliers.map(supplier => (
                            <option key={supplier.id} value={supplier.id}>
                                {supplier.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles['orders-grid']}>
                    {filteredOrders.length === 0 ? (
                        <Card>
                            <div className={styles['empty-state']}>
                                <div className={styles['empty-icon']}>🔍</div>
                                <h3>No Orders Found</h3>
                                <p>{searchQuery || statusFilter !== 'all' || supplierFilter !== 'all'
                                    ? 'Try adjusting your search or filters'
                                    : 'Create your first order to get started'}</p>
                            </div>
                        </Card>
                    ) : (
                        paginatedOrders.map((order) => (
                            <div
                                key={order.id}
                                className={styles['order-card']}
                                onClick={() => navigate(`/admin/orders/${order.id}`)}
                            >
                                <div className={styles['order-header']}>
                                    <div className={styles['order-info']}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <h3>{order.clientName}</h3>
                                            <div className={styles['badge-group']}>
                                                {order.status === 'PENDING_PAYMENT' && <span className={styles['badge-warn']}>UNPAID CLIENT</span>}
                                                {order.supplierPaymentStatus === 'verified' && <span className={styles['badge-success']}>PAID SUPPLIER</span>}
                                                {order.supplierPaymentStatus === 'pending_verification' && <span className={styles['badge-warn']}>VERIFY PAY</span>}
                                                {!order.clientShipmentProofUrl && <span className={styles['badge-info']}>PENDING SHIP</span>}
                                            </div>
                                        </div>
                                        <div className={styles['order-meta']}>
                                            {order.productName} • Created {formatDate(order.createdAt)}
                                        </div>
                                    </div>
                                    <div className={styles['order-tracking']}>
                                        <code>{order.trackingCode}</code>
                                        <button
                                            className={styles['copy-btn']}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const url = `${window.location.origin}/track?code=${order.trackingCode}`;
                                                navigator.clipboard.writeText(url);
                                                alert('Tracking link copied to clipboard!');
                                            }}
                                            title="Copy Tracking Link"
                                        >
                                            📋
                                        </button>
                                    </div>
                                </div>

                                <div className={styles['order-details']}>
                                    <div className={styles['order-detail-item']}>
                                        <div className={styles['order-detail-label']}>Package</div>
                                        <div className={styles['order-detail-value']}>
                                            {order.affiliateCount} Affiliates
                                        </div>
                                    </div>
                                    <div className={styles['order-detail-item']}>
                                        <div className={styles['order-detail-label']}>Client Price</div>
                                        <div className={styles['order-detail-value']}>
                                            {formatCurrency(order.priceClient)}
                                        </div>
                                    </div>
                                    <div className={styles['order-detail-item']}>
                                        <div className={styles['order-detail-label']}>Profit</div>
                                        <div className={styles['order-detail-value']}>
                                            {formatCurrency(order.profit)}
                                        </div>
                                    </div>
                                    <div className={styles['order-detail-item']}>
                                        <div className={styles['order-detail-label']}>Status</div>
                                        <div className={styles['order-detail-value']} style={{ color: getFriendlyStatus(order).color, fontWeight: 'bold' }}>
                                            {getFriendlyStatus(order).label}
                                        </div>
                                    </div>
                                </div>

                                <div className={styles['order-progress']}>
                                    <div className={styles['progress-bar']}>
                                        <div
                                            className={styles['progress-fill']}
                                            style={{ width: `${calculateProgress(order)}%` }}
                                        />
                                    </div>
                                    <div className={styles['progress-text']}>
                                        {calculateProgress(order)}% Complete
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '12px',
                        marginTop: '24px',
                        padding: '16px'
                    }}>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            ← Previous
                        </Button>
                        <span style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                            Page {currentPage} of {totalPages}
                        </span>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            Next →
                        </Button>
                    </div>
                )}
            </div>
        </div >
    );
};
