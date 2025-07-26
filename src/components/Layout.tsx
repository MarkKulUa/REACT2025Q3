import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import styles from './Layout.module.css';

const Layout: React.FC = () => {
  const location = useLocation();
  const isAboutPage = location.pathname === '/about';

  return (
    <div className={styles.layoutContainer}>
      <nav className={styles.navigation}>
        <Link
          to="/"
          className={`${styles.navLink} ${!isAboutPage ? styles.active : ''}`}
        >
          🔍 Pokemon Search
        </Link>
        <Link
          to="/about"
          className={`${styles.navLink} ${isAboutPage ? styles.active : ''}`}
        >
          ℹ️ About
        </Link>
      </nav>

      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
