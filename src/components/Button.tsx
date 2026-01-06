import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'success' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    icon?: boolean;
    block?: boolean;
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    icon = false,
    block = false,
    className = '',
    children,
    ...props
}) => {
    const classes = [
        styles.button,
        styles[`button-${variant}`],
        size !== 'md' && styles[`button-${size}`],
        icon && styles['button-icon'],
        block && styles['button-block'],
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button className={classes} {...props}>
            {children}
        </button>
    );
};
