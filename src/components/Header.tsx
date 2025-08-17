'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useLocalStorage } from '../hooks/useLocalStorage';
import ThemeSelector from './ThemeSelector';
import LanguageSelector from './LanguageSelector';
import styles from './Header.module.css';

interface HeaderProps {
  onSearch: (searchTerm: string) => void;
  isLoading: boolean;
  onRefresh?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, isLoading, onRefresh }) => {
  const t = useTranslations('search');
  const STORAGE_KEY = 'pokemon-search-term';
  const [searchTerm, setSearchTerm] = useLocalStorage(STORAGE_KEY, '');

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = (): void => {
    const trimmedSearchTerm = searchTerm.trim();
    setSearchTerm(trimmedSearchTerm);
    onSearch(trimmedSearchTerm);
  };

  const handleKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerTop}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>{t('title')}</h1>
          <p className={styles.subtitle}>
            Search for your favorite Pokemon and explore their details
          </p>
        </div>
        <div className={styles.controls}>
          <LanguageSelector />
          <ThemeSelector />
        </div>
      </div>
      <div className={styles.searchContainer}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder={t('placeholder')}
          disabled={isLoading}
          className={styles.searchInput}
        />
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className={styles.searchButton}
        >
          {isLoading ? t('loading') : t('button')}
        </button>
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className={styles.searchButton}
            aria-label="Refresh results"
            title="Refresh"
          >
            Refresh
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
