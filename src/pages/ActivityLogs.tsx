import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useStore } from '../store';
import { Card, CardHeader, CardTitle, CardBody } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import styles from './ActivityLogs.module.css';

interface ActivityLog {
    id: string;
    user_email: string;
    user_role: string;
    action_type: string;
    action_description: string;
    related_entity_type?: string;
    related_entity_id?: string;
    metadata?: any;
    created_at: string;
}

export const ActivityLogs: React.FC = () => {
    const navigate = useNavigate();
    const currentUser = useStore((state) => state.currentUser);
    const logout = useStore((state) => state.logout);

    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [actionFilter, setActionFilter] = useState<string>('all');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const logsPerPage = 50;

    // Redirect if not superadmin
    useEffect(() => {
        if (currentUser && currentUser.role !== 'OWNER') {
            navigate('/admin');
        }
    }, [currentUser, navigate]);

    // Fetch activity logs
    useEffect(() => {
        const fetchLogs = async () => {
            setIsLoading(true);
            try {
                const { data, error } = await supabase
                    .from('activity_logs')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(500); // Get last 500 logs

                if (error) throw error;
                setLogs(data || []);
            } catch (error) {
                console.error('Error fetching activity logs:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLogs();

        // Set up real-time subscription
        const subscription = supabase
            .channel('activity_logs_changes')
            .on('postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'activity_logs' },
                (payload) => {
                    setLogs((current) => [payload.new as ActivityLog, ...current]);
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // Filtered logs
    const filteredLogs = useMemo(() => {
        let result = [...logs];

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(log =>
                log.user_email.toLowerCase().includes(query) ||
                log.action_description?.toLowerCase().includes(query) ||
                log.action_type.toLowerCase().includes(query)
            );
        }

        // Action type filter
        if (actionFilter !== 'all') {
            result = result.filter(log => log.action_type === actionFilter);
        }

        // Role filter
        if (roleFilter !== 'all') {
            result = result.filter(log => log.user_role === roleFilter);
        }

        return result;
    }, [logs, searchQuery, actionFilter, roleFilter]);

    // Pagination
    const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
    const paginatedLogs = filteredLogs.slice(
        (currentPage - 1) * logsPerPage,
        currentPage * logsPerPage
    );

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, actionFilter, roleFilter]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-MY', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    const getActionColor = (actionType: string) => {
        const colors: Record<string, string> = {
            'LOGIN': 'var(--color-success)',
            'LOGOUT': 'var(--color-text-secondary)',
            'LOGIN_FAILED': 'var(--color-error)',
            'ORDER_CREATE': 'var(--color-primary)',
            'ORDER_UPDATE': 'var(--color-info)',
            'ORDER_DELETE': 'var(--color-error)',
            'SUPPLIER_CREATE': 'var(--color-primary)',
            'SUPPLIER_UPDATE': 'var(--color-info)',
            'SUPPLIER_DELETE': 'var(--color-error)',
        };
        return colors[actionType] || 'var(--color-text-primary)';
    };

    const exportToCSV = () => {
        const headers = ['Timestamp', 'User Email', 'Role', 'Action', 'Description'];
        const rows = filteredLogs.map(log => [
            formatDate(log.created_at),
            log.user_email,
            log.user_role,
            log.action_type,
            log.action_description || '',
        ]);

        const csv = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `activity-logs-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const uniqueActionTypes = Array.from(new Set(logs.map(log => log.action_type))).sort();

    if (isLoading) {
        return (
            <div className={styles.page}>
                <div className="container" style={{ textAlign: 'center', paddingTop: '100px' }}>
                    <h3>Loading Activity Logs...</h3>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h1 className={styles.title}>Activity Logs</h1>
                            <p className={styles.subtitle}>Monitor all user activities across the platform</p>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <Button variant="secondary" onClick={() => navigate('/admin')}>
                                ← Back to Dashboard
                            </Button>
                            <Button variant="secondary" onClick={() => logout()}>
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                {/* Stats */}
                <div className={styles.stats}>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>{logs.length}</div>
                        <div className={styles.statLabel}>Total Activities</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>{filteredLogs.length}</div>
                        <div className={styles.statLabel}>Filtered Results</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>
                            {logs.filter(l => l.action_type === 'LOGIN').length}
                        </div>
                        <div className={styles.statLabel}>Total Logins</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>
                            {logs.filter(l => l.action_type.includes('ORDER')).length}
                        </div>
                        <div className={styles.statLabel}>Order Activities</div>
                    </div>
                </div>

                {/* Filters */}
                <Card style={{ marginBottom: '20px' }}>
                    <CardBody>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                            <div style={{ flex: '1 1 300px' }}>
                                <Input
                                    type="text"
                                    placeholder="Search by email, action, or description..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <select
                                value={actionFilter}
                                onChange={(e) => setActionFilter(e.target.value)}
                                style={{
                                    padding: '10px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--color-border)',
                                    background: 'var(--color-bg-secondary)',
                                    color: 'var(--color-text-primary)',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="all">All Actions</option>
                                {uniqueActionTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                style={{
                                    padding: '10px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--color-border)',
                                    background: 'var(--color-bg-secondary)',
                                    color: 'var(--color-text-primary)',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="all">All Roles</option>
                                <option value="OWNER">Owner</option>
                                <option value="STAFF">Staff</option>
                                <option value="SUPPLIER">Supplier</option>
                            </select>
                            <Button variant="secondary" onClick={exportToCSV}>
                                📥 Export CSV
                            </Button>
                        </div>
                    </CardBody>
                </Card>

                {/* Logs Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Activity Timeline</CardTitle>
                    </CardHeader>
                    <CardBody>
                        {paginatedLogs.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>
                                <p>No activity logs found</p>
                            </div>
                        ) : (
                            <div className={styles.logsTable}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Timestamp</th>
                                            <th>User</th>
                                            <th>Role</th>
                                            <th>Action</th>
                                            <th>Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedLogs.map((log) => (
                                            <tr key={log.id}>
                                                <td className={styles.timestamp}>
                                                    {formatDate(log.created_at)}
                                                </td>
                                                <td className={styles.email}>{log.user_email}</td>
                                                <td>
                                                    <span className={styles.roleBadge} data-role={log.user_role}>
                                                        {log.user_role}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span
                                                        className={styles.actionBadge}
                                                        style={{ color: getActionColor(log.action_type) }}
                                                    >
                                                        {log.action_type}
                                                    </span>
                                                </td>
                                                <td className={styles.description}>
                                                    {log.action_description || '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '12px',
                                marginTop: '24px',
                                paddingTop: '16px',
                                borderTop: '1px solid var(--color-border)'
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
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};
