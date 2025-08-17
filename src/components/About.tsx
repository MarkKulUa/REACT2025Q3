'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';
import ThemeSelector from '../components/ThemeSelector';
import LanguageSelector from '../components/LanguageSelector';
import styles from './About.module.css';

const About: React.FC = () => {
  const t = useTranslations('about');

  return (
    <div className={styles.aboutContainer}>
      <div className={styles.headerSection}>
        <h1 className={styles.title}>{t('title')}</h1>
        <div className={styles.controls}>
          <LanguageSelector />
          <ThemeSelector />
        </div>
      </div>

      <section className={styles.authorSection}>
        <p>{t('description')}</p>
      </section>

      <section className={styles.featuresSection}>
        <h2>{t('features.title')}</h2>
        <ul className={styles.featuresList}>
          <li>{t('features.search')}</li>
          <li>{t('features.details')}</li>
          <li>{t('features.selection')}</li>
          <li>{t('features.export')}</li>
          <li>{t('features.themes')}</li>
          <li>{t('features.responsive')}</li>
        </ul>
      </section>

      <div className={styles.navigationSection}>
        <Link href="/" className={styles.homeLink}>
          ← Back to Pokemon Search
        </Link>
      </div>
    </div>
  );
};

export default About;
