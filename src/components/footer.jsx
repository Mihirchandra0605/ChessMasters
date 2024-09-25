import React from 'react';
import styles from '../styles/footer.module.css';
const Footer = () => {
    return (
        <footer className={`${styles.footer}`}>
            <div className={`${styles.logoContainer}`}>
                <img 
                    src="/chess-logo-design-illustration-vector.jpg" 
                    alt="Chess Website Logo" 
                    className={`${styles.logo}`}
                />
                {/* <div className={`${styles.logoText}`}>ChessMasters</div> */}
            </div>
            <div className={`${styles.copyright}`}>
                © 2024 ChessMasters. All rights reserved.
            </div>
        </footer>
    );
};
export default Footer;