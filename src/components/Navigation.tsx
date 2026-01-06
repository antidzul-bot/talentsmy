import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navigation.module.css';

export const Navigation: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [isScrolled, setIsScrolled] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`${styles.nav} ${isScrolled ? styles.scrolled : ''}`}>
            <div className={styles.container}>
                <Link to="/" className={styles.logo}>
                    <span className={styles.logoText}>Talents</span>
                    <span className={styles.logoAccent}>.MY</span>
                </Link>

                <button
                    className={styles.menuToggle}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <div className={`${styles.navLinks} ${isMenuOpen ? styles.open : ''}`}>
                    <Link to="/services" className={styles.navLink}>Services</Link>
                    <Link to="/packages" className={styles.navLink}>Packages</Link>
                    <Link to="/about" className={styles.navLink}>About</Link>
                    <Link to="/contact" className={styles.navLink}>Contact</Link>

                    <div className={styles.navActions}>
                        <Link to="/track" className={styles.btnSecondary}>
                            Track Order
                        </Link>
                        <Link to="/login" className={styles.btnPrimary}>
                            Staff Login
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};
