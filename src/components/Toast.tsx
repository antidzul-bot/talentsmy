import React from 'react';
import styles from './Toast.module.css';

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'info';
    onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
    React.useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`${styles.toast} ${styles[`toast-${type}`]}`}>
            <span>{message}</span>
            <button onClick={onClose} className={styles.close}>×</button>
        </div>
    );
};
