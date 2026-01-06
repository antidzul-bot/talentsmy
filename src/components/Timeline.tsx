import React from 'react';
import styles from './Timeline.module.css';

export type TimelineItemStatus = 'pending' | 'active' | 'completed';

interface TimelineItemData {
    id: string;
    title: string;
    description: string;
    status: TimelineItemStatus;
    date?: string;
    details?: React.ReactNode;
}

interface TimelineProps {
    items: TimelineItemData[];
}

export const Timeline: React.FC<TimelineProps> = ({ items }) => {
    return (
        <div className={styles.timeline}>
            {items.map((item) => (
                <div
                    key={item.id}
                    className={`${styles['timeline-item']} ${styles[`timeline-item-${item.status}`]}`}
                >
                    <div
                        className={`${styles['timeline-line']} ${item.status === 'completed' ? styles['timeline-line-active'] : ''
                            }`}
                    />
                    <div className={`${styles['timeline-marker']} ${styles[`timeline-marker-${item.status}`]}`}>
                        {item.status === 'completed' && (
                            <svg className={styles['timeline-marker-icon']} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                        {item.status === 'active' && (
                            <svg className={styles['timeline-marker-icon']} fill="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="5" />
                            </svg>
                        )}
                        {item.status === 'pending' && (
                            <svg className={styles['timeline-marker-icon']} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <circle cx="12" cy="12" r="5" strokeWidth={2} />
                            </svg>
                        )}
                    </div>
                    <div className={styles['timeline-content']}>
                        <div className={styles['timeline-header']}>
                            <h4 className={styles['timeline-title']}>{item.title}</h4>
                            <span className={`${styles['timeline-badge']} ${styles[`timeline-badge-${item.status}`]}`}>
                                {item.status}
                            </span>
                        </div>
                        <p className={styles['timeline-description']}>{item.description}</p>
                        {item.date && (
                            <div className={styles['timeline-date']}>
                                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                {item.date}
                            </div>
                        )}
                        {item.details && <div className={styles['timeline-details']}>{item.details}</div>}
                    </div>
                </div>
            ))}
        </div>
    );
};
