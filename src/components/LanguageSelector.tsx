'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/lib/navigation';
import styles from './LanguageSelector.module.css';

const LanguageSelector: React.FC = () => {
  const t = useTranslations('header.language');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className={styles.languageSelector}>
      <button
        onClick={() => handleLanguageChange('en')}
        className={`${styles.languageButton} ${locale === 'en' ? styles.active : ''}`}
        aria-label={t('toggle')}
      >
        EN
      </button>
      <button
        onClick={() => handleLanguageChange('es')}
        className={`${styles.languageButton} ${locale === 'es' ? styles.active : ''}`}
        aria-label={t('toggle')}
      >
        ES
      </button>
    </div>
  );
};

export default LanguageSelector;
