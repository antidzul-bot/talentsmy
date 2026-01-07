import React from 'react';
import { StatusHistoryEntry } from '../types';
import styles from './StatusHistory.module.css';

interface StatusHistoryProps {
    history: StatusHistoryEntry[];
}

export const StatusHistory: React.FC<StatusHistoryProps> = ({ history }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;

        return date.toLocaleDateString('en-MY', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatValue = (value: string) => {
        // Format status values to be more readable
        return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    if (!history || history.length === 0) {
        return (
            <div className={styles.statusHistory}>
                <h3 className={styles.title}>Change History</h3>
                <div className={styles.emptyState}>
                    <p>No changes recorded yet.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.statusHistory}>
            <h3 className={styles.title}>Change History</h3>
            <div className={styles.timeline}>
                {[...history].reverse().map((entry) => (
                    <div key={entry.id} className={styles.timelineItem}>
                        <div className={styles.timelineDot}></div>
                        <div className={styles.timelineContent}>
                            <div className={styles.changeHeader}>
                                <span className={styles.fieldName}>{entry.field}</span>
                                <span className={styles.timestamp}>{formatDate(entry.changedAt)}</span>
                            </div>
                            <div className={styles.changeDetails}>
                                <span className={styles.oldValue}>{formatValue(entry.oldValue)}</span>
                                <span className={styles.arrow}>→</span>
                                <span className={styles.newValue}>{formatValue(entry.newValue)}</span>
                            </div>
                            <div className={styles.changedBy}>
                                by {entry.changedByName}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
