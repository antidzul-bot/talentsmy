import React, { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import styles from './ConfirmDialog.module.css';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    requireCode?: boolean;
    expectedCode?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    requireCode = false,
    expectedCode = '',
    onConfirm,
    onCancel,
}) => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (requireCode && code !== expectedCode) {
            setError('Incorrect tracking code. Please try again.');
            return;
        }
        setCode('');
        setError('');
        onConfirm();
    };

    const handleCancel = () => {
        setCode('');
        setError('');
        onCancel();
    };

    return (
        <div className={styles.overlay} onClick={handleCancel}>
            <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
                <h2 className={styles.title}>{title}</h2>
                <p className={styles.message}>{message}</p>

                {requireCode && (
                    <div className={styles.codeInput}>
                        <Input
                            label="Enter Tracking Code to Confirm"
                            value={code}
                            onChange={(e) => {
                                setCode(e.target.value);
                                setError('');
                            }}
                            placeholder="e.g., ABC123XY"
                            error={error}
                            required
                        />
                    </div>
                )}

                <div className={styles.actions}>
                    <Button variant="secondary" onClick={handleCancel}>
                        {cancelText}
                    </Button>
                    <Button variant="danger" onClick={handleConfirm}>
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
};
