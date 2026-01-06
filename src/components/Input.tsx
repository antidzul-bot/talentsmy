import React from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helper?: string;
    required?: boolean;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    helper,
    required,
    className = '',
    ...props
}) => {
    return (
        <div className={styles['input-group']}>
            {label && (
                <label className={`${styles['input-label']} ${required ? styles['input-label-required'] : ''}`}>
                    {label}
                </label>
            )}
            <input
                className={`${styles.input} ${error ? styles['input-error'] : ''} ${className}`}
                {...props}
            />
            {error && <span className={styles['input-error-message']}>{error}</span>}
            {helper && !error && <span className={styles['input-helper']}>{helper}</span>}
        </div>
    );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helper?: string;
    required?: boolean;
}

export const Textarea: React.FC<TextareaProps> = ({
    label,
    error,
    helper,
    required,
    className = '',
    ...props
}) => {
    return (
        <div className={styles['input-group']}>
            {label && (
                <label className={`${styles['input-label']} ${required ? styles['input-label-required'] : ''}`}>
                    {label}
                </label>
            )}
            <textarea
                className={`${styles.textarea} ${error ? styles['input-error'] : ''} ${className}`}
                {...props}
            />
            {error && <span className={styles['input-error-message']}>{error}</span>}
            {helper && !error && <span className={styles['input-helper']}>{helper}</span>}
        </div>
    );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    helper?: string;
    required?: boolean;
    options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({
    label,
    error,
    helper,
    required,
    options,
    className = '',
    ...props
}) => {
    return (
        <div className={styles['input-group']}>
            {label && (
                <label className={`${styles['input-label']} ${required ? styles['input-label-required'] : ''}`}>
                    {label}
                </label>
            )}
            <select
                className={`${styles.select} ${error ? styles['input-error'] : ''} ${className}`}
                {...props}
            >
                <option value="">Select...</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <span className={styles['input-error-message']}>{error}</span>}
            {helper && !error && <span className={styles['input-helper']}>{helper}</span>}
        </div>
    );
};
