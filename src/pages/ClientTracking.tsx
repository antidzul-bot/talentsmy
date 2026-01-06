import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../store';
import { Card, CardHeader, CardTitle, CardBody } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Timeline, TimelineItemStatus } from '../components/Timeline';
import { Order } from '../types';
import styles from './ClientTracking.module.css';

export const ClientTracking: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [trackingCode, setTrackingCode] = useState('');
    const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
    const [notFound, setNotFound] = useState(false);
    const getOrderByTrackingCode = useStore((state) => state.getOrderByTrackingCode);

    // Auto-fill from URL parameter
    useEffect(() => {
        const codeFromUrl = searchParams.get('code');
        if (codeFromUrl) {
            setTrackingCode(codeFromUrl.toUpperCase());
            const order = getOrderByTrackingCode(codeFromUrl.toUpperCase());
            if (order) {
                setSearchedOrder(order);
                setNotFound(false);
            } else {
                setSearchedOrder(null);
                setNotFound(true);
            }
        }
    }, [searchParams, getOrderByTrackingCode]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const order = getOrderByTrackingCode(trackingCode.toUpperCase());
        if (order) {
            setSearchedOrder(order);
            setNotFound(false);
        } else {
            setSearchedOrder(null);
            setNotFound(true);
        }
    };

    const getTimelineItems = (order: Order) => {
        const { progress } = order;

        const getStatus = (isCompleted: boolean, isNext: boolean): TimelineItemStatus => {
            if (isCompleted) return 'completed';
            if (isNext) return 'active';
            return 'pending';
        };

        let nextStepFound = false;
        const checkNext = (isCompleted: boolean) => {
            if (!isCompleted && !nextStepFound) {
                nextStepFound = true;
                return true;
            }
            return false;
        };

        return [
            {
                id: '1',
                title: 'Payment Received',
                description: 'Your payment has been confirmed and order is being processed',
                status: getStatus(progress.clientPaid, checkNext(progress.clientPaid)),
                date: progress.clientPaidDate,
            },
            {
                id: '2',
                title: 'Guidelines Approved',
                description: 'Content guidelines have been reviewed and approved',
                status: getStatus(progress.guidelinesApproved, checkNext(progress.guidelinesApproved)),
                date: progress.guidelinesApprovedDate,
            },
            {
                id: '3',
                title: 'Affiliates Selected',
                description: `${order.affiliates.length} affiliates have been selected for your campaign`,
                status: getStatus(progress.affiliatesSelected, checkNext(progress.affiliatesSelected)),
                date: progress.affiliatesSelectedDate,
                details: order.affiliates.length > 0 && (
                    <div>
                        <strong>Selected Affiliates:</strong>
                        <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                            {order.affiliates.slice(0, 5).map((aff) => (
                                <li key={aff.id}>{aff.name} (@{aff.tiktokHandle})</li>
                            ))}
                            {order.affiliates.length > 5 && <li>...and {order.affiliates.length - 5} more</li>}
                        </ul>
                    </div>
                ),
            },
            {
                id: '4',
                title: 'Samples Shipped',
                description: 'Product samples have been sent to all affiliates',
                status: getStatus(progress.samplesReceived, checkNext(progress.samplesReceived)),
                date: progress.samplesReceivedDate,
            },
            {
                id: '5',
                title: 'Production Started',
                description: order.supplierProgress?.videoStartDate && order.supplierProgress?.videoDeadline
                    ? `Production started. Schedule: Starting ${new Date(order.supplierProgress.videoStartDate).toLocaleDateString()} with deadline ${new Date(order.supplierProgress.videoDeadline).toLocaleDateString()}`
                    : 'Affiliates have started creating content',
                status: getStatus(progress.productionStarted, checkNext(progress.productionStarted)),
                date: progress.productionStartDate,
            },
            {
                id: '6',
                title: 'Videos Completed',
                description: 'All affiliate videos have been completed and reviewed',
                status: getStatus(progress.videosCompleted, checkNext(progress.videosCompleted)),
                date: progress.videosCompletedDate,
            },
            {
                id: '7',
                title: 'Final Report Sent',
                description: 'Campaign report with all videos and analytics has been delivered',
                status: getStatus(progress.reportSent, checkNext(progress.reportSent)),
                date: progress.reportSentDate,
            },
        ];
    };

    return (
        <div className={styles['tracking-page']}>
            <div className={styles['tracking-header']}>
                <h1 className={styles['tracking-logo']}>Affiliate Hub</h1>
                <p className={styles['tracking-subtitle']}>Track Your Campaign Progress</p>
            </div>

            <div className={styles['tracking-search']}>
                <form onSubmit={handleSearch} className={styles['tracking-search-form']}>
                    <div className={styles['tracking-search-input']}>
                        <Input
                            type="text"
                            placeholder="Enter your tracking code (e.g., ABC12345)"
                            value={trackingCode}
                            onChange={(e) => setTrackingCode(e.target.value)}
                            required
                        />
                    </div>
                    <Button type="submit" size="lg">
                        Track Order
                    </Button>
                </form>
            </div>

            <div className={styles['tracking-container']}>
                {searchedOrder && (
                    <Card className={styles['tracking-card']} variant="glass">
                        <CardHeader>
                            <CardTitle>Order #{searchedOrder.trackingCode}</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <div className={styles['order-info']}>
                                <div className={styles['info-item']}>
                                    <div className={styles['info-label']}>Client Name</div>
                                    <div className={styles['info-value']}>{searchedOrder.clientName}</div>
                                </div>
                                <div className={styles['info-item']}>
                                    <div className={styles['info-label']}>Product</div>
                                    <div className={styles['info-value']}>{searchedOrder.productName}</div>
                                </div>
                                <div className={styles['info-item']}>
                                    <div className={styles['info-label']}>Package</div>
                                    <div className={styles['info-value']}>
                                        {searchedOrder.affiliateCount} Affiliates
                                    </div>
                                </div>
                                <div className={styles['info-item']}>
                                    <div className={styles['info-label']}>Status</div>
                                    <div className={styles['info-value']}>
                                        <span className={styles['status-badge']}>
                                            <span className={styles['status-indicator']} />
                                            {searchedOrder.status.replace(/_/g, ' ')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <Timeline items={getTimelineItems(searchedOrder)} />
                        </CardBody>
                    </Card>
                )}

                {notFound && (
                    <Card variant="glass">
                        <div className={styles['error-message']}>
                            <div className={styles['error-icon']}>🔍</div>
                            <h3>Order Not Found</h3>
                            <p>
                                We couldn't find an order with tracking code <strong>{trackingCode}</strong>.
                                <br />
                                Please check your code and try again.
                            </p>
                        </div>
                    </Card>
                )}

                {!searchedOrder && !notFound && (
                    <Card variant="glass">
                        <div className={styles['empty-state']}>
                            <div className={styles['empty-icon']}>📦</div>
                            <h3>Enter Your Tracking Code</h3>
                            <p>Enter your unique tracking code above to view your campaign progress</p>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};
