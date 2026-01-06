import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    {/* Company Info */}
                    <div className={styles.column}>
                        <div className={styles.logo}>
                            <span className={styles.logoText}>Talents</span>
                            <span className={styles.logoAccent}>.MY</span>
                        </div>
                        <p className={styles.description}>
                            Professional TikTok affiliate campaign management.
                            Connecting brands with top-tier content creators across Malaysia.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className={styles.column}>
                        <h4 className={styles.columnTitle}>Quick Links</h4>
                        <ul className={styles.linkList}>
                            <li><Link to="/services">Services</Link></li>
                            <li><Link to="/packages">Packages</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                        </ul>
                    </div>

                    {/* For Clients */}
                    <div className={styles.column}>
                        <h4 className={styles.columnTitle}>For Clients</h4>
                        <ul className={styles.linkList}>
                            <li><Link to="/track">Track Your Order</Link></li>
                            <li><Link to="/packages">View Packages</Link></li>
                            <li><Link to="/contact">Get Started</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className={styles.column}>
                        <h4 className={styles.columnTitle}>Contact</h4>
                        <ul className={styles.contactList}>
                            <li>
                                <span className={styles.icon}>📧</span>
                                <a href="mailto:hello@talents.my">hello@talents.my</a>
                            </li>
                            <li>
                                <span className={styles.icon}>💬</span>
                                <a href="https://wa.me/60135229966" target="_blank" rel="noopener noreferrer">
                                    +60 13-522 9966
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p className={styles.copyright}>
                        © {currentYear} Talents.MY. All rights reserved.
                    </p>
                    <div className={styles.social}>
                        <a href="https://tiktok.com/@talents.my" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                            TikTok
                        </a>
                        <a href="https://instagram.com/talents.my" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            Instagram
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
