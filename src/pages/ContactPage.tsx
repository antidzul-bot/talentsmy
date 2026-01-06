import React from 'react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import styles from './HomePage.module.css';

export const ContactPage: React.FC = () => {
    return (
        <div className={styles.page}>
            <Navigation />

            <div className={styles.sectionAlt} style={{ paddingTop: '120px', minHeight: '80vh' }}>
                <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <h1 className={styles.sectionTitle}>Contact Us</h1>
                        <p className={styles.sectionSubtitle}>
                            Ready to start your campaign? Get in touch with us today.
                        </p>
                    </div>

                    <div style={{
                        maxWidth: '800px',
                        margin: '0 auto',
                        background: 'white',
                        padding: '3rem',
                        borderRadius: 'var(--radius-xl)',
                        boxShadow: 'var(--shadow-lg)'
                    }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
                                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>WhatsApp</h3>
                                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                                    Fastest response time (9am - 6pm)
                                </p>
                                <a
                                    href="https://wa.me/60135229966"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.btnPrimary}
                                    style={{ width: '100%' }}
                                >
                                    +60 13-522 9966
                                </a>
                            </div>

                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📧</div>
                                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>Email</h3>
                                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                                    For official inquiries & quotations
                                </p>
                                <a
                                    href="mailto:hello@talents.my"
                                    className={styles.btnSecondary}
                                    style={{ width: '100%', color: 'var(--color-text-primary)' }}
                                >
                                    hello@talents.my
                                </a>
                            </div>
                        </div>

                        <div style={{ marginTop: '3rem', textAlign: 'center', paddingTop: '2rem', borderTop: '1px solid var(--color-border-light)' }}>
                            <h3 style={{ marginBottom: '1rem' }}>Visit Our Office</h3>
                            <p style={{ color: 'var(--color-text-secondary)' }}>
                                Talents.MY Agency<br />
                                Kuala Lumpur, Malaysia
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};
