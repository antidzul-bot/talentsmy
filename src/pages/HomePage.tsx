import React from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import styles from './HomePage.module.css';

export const HomePage: React.FC = () => {
    return (
        <div className={styles.page}>
            <Navigation />

            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <div className={styles.heroText}>
                        <h1 className={styles.heroTitle}>
                            Scale Your Brand with
                            <span className={styles.gradient}> TikTok Affiliates</span>
                        </h1>
                        <p className={styles.heroSubtitle}>
                            Connect with Malaysia's top TikTok content creators.
                            Professional affiliate campaign management that delivers real results.
                        </p>
                        <div className={styles.heroActions}>
                            <a href="https://wa.me/60135229966?text=Hi%2C%20I'm%20interested%20in%20your%20TikTok%20affiliate%20packages" className={styles.btnPrimary} target="_blank" rel="noopener noreferrer">
                                Get Started
                            </a>
                            <Link to="/track" className={styles.btnSecondary}>
                                Track Your Order
                            </Link>
                        </div>
                        <div className={styles.heroStats}>
                            <div className={styles.stat}>
                                <div className={styles.statValue}>500+</div>
                                <div className={styles.statLabel}>Campaigns Delivered</div>
                            </div>
                            <div className={styles.stat}>
                                <div className={styles.statValue}>1000+</div>
                                <div className={styles.statLabel}>Affiliate Partners</div>
                            </div>
                            <div className={styles.stat}>
                                <div className={styles.statValue}>50M+</div>
                                <div className={styles.statLabel}>Total Reach</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Highlight Section */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Why Choose Talents.MY?</h2>
                        <p className={styles.sectionSubtitle}>
                            We actively manage the entire affiliate process so you don't have to.
                        </p>
                    </div>

                    <div className={styles.servicesGrid}>
                        <div className={styles.serviceCard}>
                            <div className={styles.serviceIcon}>🎯</div>
                            <h3 className={styles.serviceTitle}>Affiliate Management</h3>
                            <p className={styles.serviceDescription}>
                                Our core expertise. Recruit, manage, and payout thousands of affiliates seamlessly.
                            </p>
                        </div>
                        <div className={styles.serviceCard}>
                            <div className={styles.serviceIcon}>📦</div>
                            <h3 className={styles.serviceTitle}>Product Logistics</h3>
                            <p className={styles.serviceDescription}>
                                We handle the logistics of shipping products to hundreds of creators nationwide.
                            </p>
                        </div>
                        <div className={styles.serviceCard}>
                            <div className={styles.serviceIcon}>📊</div>
                            <h3 className={styles.serviceTitle}>Live Tracking</h3>
                            <p className={styles.serviceDescription}>
                                Clients get a real-time portal to see their campaign progress 24/7.
                            </p>
                        </div>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                        <Link to="/services" className={styles.btnOutline}>
                            Explore All Services
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className={styles.cta}>
                <div className={styles.container}>
                    <div className={styles.ctaContent}>
                        <h2 className={styles.ctaTitle}>Ready to Scale Your Brand?</h2>
                        <p className={styles.ctaSubtitle}>
                            Join hundreds of brands already growing with TikTok affiliate marketing
                        </p>
                        <div className={styles.ctaActions}>
                            <a href="https://wa.me/60135229966?text=Hi%2C%20I%20want%20to%20start%20a%20TikTok%20affiliate%20campaign" className={styles.btnPrimary} target="_blank" rel="noopener noreferrer">
                                Start Your Campaign
                            </a>
                            <a href="https://wa.me/60135229966" className={styles.btnSecondary} target="_blank" rel="noopener noreferrer">
                                Chat on WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};
