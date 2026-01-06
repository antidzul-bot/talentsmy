import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Card, CardHeader, CardTitle, CardBody } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Toast } from '../components/Toast';
import { sendOTP, verifyOTPBackend } from '../utils/emailService';
import { User } from '../types';
import styles from './Login.module.css';

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const currentUser = useStore((state) => state.currentUser);

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'email' | 'otp'>('email');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [demoOtp, setDemoOtp] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(false);

    // Redirect if already logged in
    React.useEffect(() => {
        if (currentUser) {
            if (currentUser.role === 'OWNER' || currentUser.role === 'STAFF') {
                navigate('/admin');
            } else {
                navigate('/supplier');
            }
        }
    }, [currentUser, navigate]);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        setDemoOtp(null); // Clear previous demo OTP

        try {
            // Call backend API to send OTP
            const result = await sendOTP(email);

            if (result.success) {
                setStep('otp');
                setToast({ message: 'OTP code sent to your email!', type: 'success' });

                // For demo/testing: Fetch the OTP from backend logs
                // In production, remove this section
                try {
                    const logResponse = await fetch('http://localhost:3001/api/get-last-otp?email=' + encodeURIComponent(email));
                    if (logResponse.ok) {
                        const logData = await logResponse.json();
                        if (logData.otp) {
                            setDemoOtp(logData.otp);
                        }
                    }
                } catch (err) {
                    // Silently fail - demo OTP is optional
                    console.log('Could not fetch demo OTP');
                }
            } else {
                setToast({ message: result.error || 'Failed to send OTP', type: 'error' });
            }
        } catch (err) {
            console.error(err);
            setToast({ message: 'Network error. Is the backend running?', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otp) return;

        setIsLoading(true);

        try {
            // Call backend API to verify OTP
            const result = await verifyOTPBackend(email, otp);

            if (result.success) {
                // OTP verified successfully - now create user session
                // Determine user role based on email
                let user: User;

                const emailLower = email.toLowerCase();

                if (emailLower === 'antidzul@gmail.com') {
                    user = { id: 'admin-1', name: 'Agency Owner', email, role: 'OWNER' };
                } else if (emailLower === 'doc@kerabat.digital') {
                    user = { id: 'staff-doc', name: 'Kerabat Digital', email, role: 'STAFF' };
                } else if (emailLower === 'miera@talents.my') {
                    // Fetch supplier details from store if possible, or just mock it for session start
                    // Ideally we find the supplier in the store to get their ID
                    const supplier = useStore.getState().suppliers.find(s => s.email.toLowerCase() === emailLower);
                    user = {
                        id: supplier?.id || 'miera-legacy',
                        name: supplier?.name || 'MIERA LEGACY',
                        email,
                        role: 'SUPPLIER',
                        supplierId: supplier?.id || 'miera-id'
                    };
                } else {
                    // Check if they match any OTHER supplier
                    const supplier = useStore.getState().suppliers.find(s => s.email.toLowerCase() === emailLower);
                    if (supplier) {
                        user = { id: supplier.id, name: supplier.name, email, role: 'SUPPLIER', supplierId: supplier.id };
                    } else {
                        // REJECT unknown logins or treat as guest? 
                        // For now, let's Fail if strict mode is requested, or default to generic Staff if you prefer.
                        // User requested "no one can get otp except above".
                        // Logic for rejection should be at OTP sending stage, but here we can also block login.
                        setToast({ message: 'Access Denied: Email not recognized.', type: 'error' });
                        setIsLoading(false);
                        return;
                    }
                }

                // Set user in store
                useStore.setState({ currentUser: user });

                setToast({ message: 'Login successful!', type: 'success' });

                // Navigate based on role
                setTimeout(() => {
                    if (user.role === 'OWNER' || user.role === 'STAFF') {
                        navigate('/admin');
                    } else {
                        navigate('/supplier');
                    }
                }, 500);
            } else {
                setToast({ message: result.error || 'Invalid or expired OTP', type: 'error' });
            }
        } catch (err) {
            console.error(err);
            setToast({ message: 'Verification failed. Please try again.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles['login-page']}>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div className={styles['login-container']}>
                <div className={styles['logo-section']}>
                    <h1>Talents.MY</h1>
                    <p>Affiliate Management System</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            {step === 'email' ? 'Login with Magic OTP' : 'Enter 6-Digit Code'}
                        </CardTitle>
                    </CardHeader>
                    <CardBody>
                        {step === 'email' ? (
                            <form onSubmit={handleSendOtp} className={styles['login-form']}>
                                <Input
                                    label="Work Email Address"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="yourname@example.com"
                                    required
                                />
                                <p className={styles['login-hint']}>
                                    We'll send a 6-digit magic code to your email. No password needed.
                                </p>
                                <Button type="submit" block disabled={isLoading}>
                                    {isLoading ? 'Sending...' : 'Send Magic Code'}
                                </Button>
                            </form>
                        ) : (
                            <form onSubmit={handleVerifyOtp} className={styles['login-form']}>
                                <Input
                                    label={`Code sent to ${email}`}
                                    type="text"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="123456"
                                    required
                                    autoFocus
                                />
                                <p className={styles['login-hint']}>
                                    Check your inbox (and spam) for the code.
                                </p>

                                {demoOtp && (
                                    <div className={styles['demo-otp-box']}>
                                        <strong>🔑 DEMO/TEST CODE:</strong> <code>{demoOtp}</code>
                                    </div>
                                )}

                                <Button type="submit" block>Verify & Login</Button>
                                <button
                                    type="button"
                                    className={styles['back-btn']}
                                    onClick={() => setStep('email')}
                                >
                                    ← Back to email
                                </button>
                            </form>
                        )}
                    </CardBody>
                </Card>

                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <a href="/track" style={{ color: 'var(--color-text-tertiary)', fontSize: '14px', textDecoration: 'none' }}>
                        Are you a client? Track your order here →
                    </a>
                </div>
            </div>
        </div>
    );
};
