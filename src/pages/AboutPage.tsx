import React from 'react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import styles from './HomePage.module.css';

export const AboutPage: React.FC = () => {
    return (
        <div className={styles.page}>
            <Navigation />

            <div className={styles.section} style={{ paddingTop: '120px' }}>
                <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <h1 className={styles.sectionTitle}>About Talents.MY</h1>
                        <p className={styles.sectionSubtitle}>
                            Connecting Brands with Malaysia's Top Creators
                        </p>
                    </div>

                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <p style={{ fontSize: '1.125rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                            Talents.MY is a premier talent management agency specializing in TikTok affiliate campaigns.
                            We bridge the gap between forward-thinking brands and the most influential content creators in Malaysia.
                        </p>
                        <p style={{ fontSize: '1.125rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                            Our mission is to simplify influencer marketing. We handle the complex logistics of managing hundreds
                            of affiliates, product distribution, and payment processing, allowing brands to focus on what they do best:
                            growing their business.
                        </p>
                        <p style={{ fontSize: '1.125rem', lineHeight: '1.8' }}>
                            With a network of thousands of active creators and a proven track record of successful campaigns,
                            we are your trusted partner in the digital creator economy.
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};
