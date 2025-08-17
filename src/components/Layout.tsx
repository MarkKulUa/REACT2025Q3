'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from '@/lib/navigation';
import { Link } from '@/lib/navigation';
import styles from './Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const t = useTranslations('header');
  const pathname = usePathname();
  const isAboutPage = pathname.includes('/about');

  return (
    <div className={styles.layoutContainer}>
      <nav className={styles.navigation}>
        <Link
          href="/"
          className={`${styles.navLink} ${!isAboutPage ? styles.active : ''}`}
        >
          🔍 {t('pokemon')}
        </Link>
        <Link
          href="/about"
          className={`${styles.navLink} ${isAboutPage ? styles.active : ''}`}
        >
          ℹ️ {t('about')}
        </Link>
      </nav>

      <main className={styles.mainContent}>{children}</main>
    </div>
  );
};

export default Layout;
