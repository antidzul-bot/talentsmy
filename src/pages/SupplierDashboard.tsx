import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Card, CardHeader, CardTitle, CardBody } from '../components/Card';
import { Button } from '../components/Button';
import styles from './SupplierDashboard.module.css';

export const SupplierDashboard: React.FC = () => {
    const navigate = useNavigate();
    const orders = useStore((state) => state.orders);

    // For now, show all orders with suppliers assigned
    // Later: filter by current supplier's ID
    const supplierOrders = orders.filter(order => order.supplierId);

    const stats = {
        total: supplierOrders.length,
        inProgress: supplierOrders.filter(o => o.status !== 'COMPLETED').length,
        completed: supplierOrders.filter(o => o.status === 'COMPLETED').length,
        pendingAction: supplierOrders.filter(o => !o.supplierProgress?.affiliatesSubmitted).length,
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return styles['status-completed'];
            case 'PRODUCTION_STARTED':
                return styles['status-progress'];
            default:
                return styles['status-pending'];
        }
    };

    return (
        <div className={styles['supplier-dashboard']}>
            <div className={styles['dashboard-header']}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h1 className={styles['page-title']}>Supplier Portal</h1>
                            <p className={styles['page-subtitle']}>Manage your assigned orders</p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <Button variant="secondary" onClick={() => navigate('/supplier/settings')}>
                                ⚙️ Settings
                            </Button>
                            <Button variant="secondary" onClick={() => {
                                useStore.getState().logout();
                                // Store will update, but we might need to nav to /login manually if guard doesn't catch it instantly (it should).
                                // But AuthGuard redirects to login if user is null.
                                // Just in case navigate explicitly.
                                navigate('/login');
                            }}>
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                {/* Stats Cards */}
                <div className={styles['stats-grid']}>
                    <Card>
                        <CardBody>
                            <div className={styles['stat-card']}>
                                <div className={styles['stat-value']}>{stats.total}</div>
                                <div className={styles['stat-label']}>Total Assigned</div>
                            </div>
                        </CardBody>
                    </Card>
                    <Card>
                        <CardBody>
                            <div className={styles['stat-card']}>
                                <div className={styles['stat-value']}>{stats.inProgress}</div>
                                <div className={styles['stat-label']}>In Progress</div>
                            </div>
                        </CardBody>
                    </Card>
                    <Card>
                        <CardBody>
                            <div className={styles['stat-card']}>
                                <div className={styles['stat-value']}>{stats.completed}</div>
                                <div className={styles['stat-label']}>Completed</div>
                            </div>
                        </CardBody>
                    </Card>
                    <Card>
                        <CardBody>
                            <div className={styles['stat-card']}>
                                <div className={styles['stat-value']}>{stats.pendingAction}</div>
                                <div className={styles['stat-label']}>Pending Action</div>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Orders List */}
                <div className={styles.section}>
                    <h2 className={styles['section-title']}>Assigned Orders</h2>

                    {supplierOrders.length === 0 ? (
                        <Card>
                            <CardBody>
                                <div className={styles['empty-state']}>
                                    <div className={styles['empty-icon']}>📦</div>
                                    <h3>No Orders Assigned</h3>
                                    <p>You don't have any assigned orders yet.</p>
                                </div>
                            </CardBody>
                        </Card>
                    ) : (
                        <div className={styles['orders-grid']}>
                            {supplierOrders.map((order) => (
                                <Card
                                    key={order.id}
                                    className={styles['order-card']}
                                    interactive
                                    onClick={() => navigate(`/supplier/orders/${order.id}`)}
                                >
                                    <CardHeader>
                                        <div className={styles['order-header']}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <CardTitle>Order #{order.trackingCode}</CardTitle>
                                                {order.supplierPaymentStatus === 'pending_verification' && (
                                                    <span style={{ fontSize: '10px', background: 'var(--color-warning-bg)', color: 'var(--color-warning)', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>💰 VERIFY PAYMENT</span>
                                                )}
                                                {order.supplierPaymentStatus === 'verified' && (
                                                    <span style={{ fontSize: '10px', background: 'var(--color-success-bg)', color: 'var(--color-success)', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>✅ PAID</span>
                                                )}
                                            </div>
                                            <span className={`${styles['status-badge']} ${getStatusBadgeClass(order.status)}`}>
                                                {order.status.replace(/_/g, ' ')}
                                            </span>
                                        </div>
                                    </CardHeader>
                                    <CardBody>
                                        <div className={styles['order-info']}>
                                            <div className={styles['info-row']}>
                                                <span className={styles['info-label']}>Client:</span>
                                                <span className={styles['info-value']}>{order.clientName}</span>
                                            </div>
                                            <div className={styles['info-row']}>
                                                <span className={styles['info-label']}>Product:</span>
                                                <span className={styles['info-value']}>{order.productName}</span>
                                            </div>
                                            <div className={styles['info-row']}>
                                                <span className={styles['info-label']}>Package:</span>
                                                <span className={styles['info-value']}>{order.affiliateCount} Affiliates</span>
                                            </div>
                                        </div>

                                        {/* Progress Indicator */}
                                        <div className={styles['progress-summary']}>
                                            <div className={styles['progress-label']}>Supplier Progress:</div>
                                            <div className={styles['progress-steps']}>
                                                <div className={order.supplierProgress?.affiliatesSubmitted ? styles['step-done'] : styles['step-pending']}>
                                                    {order.supplierProgress?.affiliatesSubmitted ? '✓' : '1'}
                                                </div>
                                                <div className={order.supplierProgress?.briefingCompleted ? styles['step-done'] : styles['step-pending']}>
                                                    {order.supplierProgress?.briefingCompleted ? '✓' : '2'}
                                                </div>
                                                <div className={order.supplierProgress?.samplesReceivedByAffiliates ? styles['step-done'] : styles['step-pending']}>
                                                    {order.supplierProgress?.samplesReceivedByAffiliates ? '✓' : '3'}
                                                </div>
                                                <div className={order.supplierProgress?.productionStarted ? styles['step-done'] : styles['step-pending']}>
                                                    {order.supplierProgress?.productionStarted ? '✓' : '4'}
                                                </div>
                                                <div className={order.supplierProgress?.allVideosCompleted ? styles['step-done'] : styles['step-pending']}>
                                                    {order.supplierProgress?.allVideosCompleted ? '✓' : '5'}
                                                </div>
                                                <div className={order.supplierProgress?.reportSubmitted ? styles['step-done'] : styles['step-pending']}>
                                                    {order.supplierProgress?.reportSubmitted ? '✓' : '6'}
                                                </div>
                                            </div>
                                        </div>

                                        <Button variant="primary" size="sm" style={{ marginTop: 'var(--space-md)', width: '100%' }}>
                                            View Details →
                                        </Button>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
