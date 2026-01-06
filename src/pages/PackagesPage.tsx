import React from 'react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import styles from './HomePage.module.css';

export const PackagesPage: React.FC = () => {
    return (
        <div className={styles.page}>
            <Navigation />

            <div className={styles.section} style={{ paddingTop: '120px' }}>
                <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <h1 className={styles.sectionTitle}>Campaign Packages</h1>
                        <p className={styles.sectionSubtitle}>
                            High-volume affiliate video packages designed for maximum reach
                        </p>
                    </div>

                    <div className={styles.pricingGrid}>
                        <div className={styles.pricingCard}>
                            <div className={styles.pricingHeader}>
                                <h3 className={styles.packageName}>Starter Pack</h3>
                                <div className={styles.packagePrice}>
                                    <span className={styles.currency}>RM</span>
                                    <span className={styles.amount}>3,500</span>
                                </div>
                                <p className={styles.packageDescription}>100 Affiliates × 2 Videos</p>
                            </div>
                            <ul className={styles.featureList}>
                                <li>✓ <strong>100</strong> TikTok Affiliates</li>
                                <li>✓ <strong>200</strong> Total Videos (2 each)</li>
                                <li>✓ Affiliate Recruitment</li>
                                <li>✓ Product Sample Management</li>
                                <li>✓ Content Guidelines</li>
                                <li>✓ Payout Management</li>
                            </ul>
                            <a href="https://wa.me/60135229966?text=Hi%2C%20I'm%20interested%20in%20the%20Starter%20Package" className={styles.btnOutline} target="_blank" rel="noopener noreferrer">
                                Get Started
                            </a>
                        </div>

                        <div className={`${styles.pricingCard} ${styles.featured}`}>
                            <div className={styles.badge}>Best Value</div>
                            <div className={styles.pricingHeader}>
                                <h3 className={styles.packageName}>Growth Pack</h3>
                                <div className={styles.packagePrice}>
                                    <span className={styles.currency}>RM</span>
                                    <span className={styles.amount}>6,997</span>
                                </div>
                                <p className={styles.packageDescription}>300 Affiliates × 2 Videos</p>
                            </div>
                            <ul className={styles.featureList}>
                                <li>✓ <strong>300</strong> TikTok Affiliates</li>
                                <li>✓ <strong>600</strong> Total Videos (2 each)</li>
                                <li>✓ Premium Recruitment</li>
                                <li>✓ Product Sample Management</li>
                                <li>✓ Strategy & Guidelines</li>
                                <li>✓ Priority Support</li>
                                <li>✓ Comprehensive Report</li>
                            </ul>
                            <a href="https://wa.me/60135229966?text=Hi%2C%20I'm%20interested%20in%20the%20Growth%20Package" className={styles.btnPrimary} target="_blank" rel="noopener noreferrer">
                                Get Started
                            </a>
                        </div>

                        <div className={styles.pricingCard}>
                            <div className={styles.pricingHeader}>
                                <h3 className={styles.packageName}>Custom Enterprise</h3>
                                <div className={styles.packagePrice}>
                                    <span className={styles.amount}>Custom</span>
                                </div>
                                <p className={styles.packageDescription}>Tailored solution for big brands</p>
                            </div>
                            <ul className={styles.featureList}>
                                <li>✓ Custom Affiliate Count</li>
                                <li>✓ Specific Niche Targeting</li>
                                <li>✓ Dedicated Campaign Manager</li>
                                <li>✓ Live Tracking Dashboard</li>
                                <li>✓ Extended Duration</li>
                                <li>✓ White-label Reporting</li>
                            </ul>
                            <a href="https://wa.me/60135229966?text=Hi%2C%20I'm%20interested%20in%20a%20Custom%20Enterprise%20Package" className={styles.btnOutline} target="_blank" rel="noopener noreferrer">
                                Contact Us
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};
