import React from 'react';
import styles from './Card.module.css';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'glass' | 'elevated';
    interactive?: boolean;
    onClick?: () => void;
    style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    variant = 'default',
    interactive = false,
    onClick,
    style,
}) => {
    const classes = [
        styles.card,
        variant !== 'default' && styles[`card-${variant}`],
        interactive && styles['card-interactive'],
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={classes} onClick={onClick} style={style}>
            {children}
        </div>
    );
};

export const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className={styles['card-header']}>{children}</div>
);

export const CardTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 className={styles['card-title']}>{children}</h3>
);

export const CardSubtitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <p className={styles['card-subtitle']}>{children}</p>
);

export const CardBody: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className={styles['card-body']}>{children}</div>
);

export const CardFooter: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className={styles['card-footer']}>{children}</div>
);
