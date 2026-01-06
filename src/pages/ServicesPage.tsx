import React from 'react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import styles from './HomePage.module.css'; // Reusing homepage styles for consistency

export const ServicesPage: React.FC = () => {
    return (
        <div className={styles.page}>
            <Navigation />

            <div className={styles.sectionAlt} style={{ paddingTop: '120px' }}>
                <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <h1 className={styles.sectionTitle}>Our Services</h1>
                        <p className={styles.sectionSubtitle}>
                            Comprehensive talent management solutions for your brand
                        </p>
                    </div>

                    <div className={styles.servicesGrid}>
                        <div className={`${styles.serviceCard} ${styles.featured}`}>
                            <div className={styles.serviceIcon}>🎯</div>
                            <h3 className={styles.serviceTitle}>Affiliate Management</h3>
                            <p className={styles.serviceDescription}>
                                <strong>Our Core Expertise.</strong> We manage end-to-end TikTok affiliate campaigns.
                                From recruiting 100-300+ affiliates to ensuring video delivery and payout management.
                            </p>
                            <ul className={styles.featureList} style={{ marginTop: '1rem', padding: 0, listStyle: 'none' }}>
                                <li>✓ Bulk Affiliate Recruitment</li>
                                <li>✓ Product Sample Distribution</li>
                                <li>✓ Video QC & Monitoring</li>
                                <li>✓ Commission Payouts</li>
                            </ul>
                        </div>

                        <div className={styles.serviceCard}>
                            <div className={styles.serviceIcon}>🔥</div>
                            <h3 className={styles.serviceTitle}>KOL Management</h3>
                            <p className={styles.serviceDescription}>
                                Partner with Key Opinion Leaders who drive trends. We handle negotiation,
                                briefing, and campaign execution with high-impact creators.
                            </p>
                        </div>

                        <div className={styles.serviceCard}>
                            <div className={styles.serviceIcon}>✨</div>
                            <h3 className={styles.serviceTitle}>Influencers Management</h3>
                            <p className={styles.serviceDescription}>
                                Connect with micro and macro influencers to amplify your brand message.
                                Authentic storytelling that resonates with targeted audiences.
                            </p>
                        </div>

                        <div className={styles.serviceCard}>
                            <div className={styles.serviceIcon}>🎤</div>
                            <h3 className={styles.serviceTitle}>Artist Management</h3>
                            <p className={styles.serviceDescription}>
                                Professional representation and collaboration with established artists
                                for endorsement deals and creative partnerships.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};
