import React from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import styles from './Header.module.css';

interface HeaderProps {
  onSearch: (searchTerm: string) => void;
  isLoading: boolean;
}

const Header: React.FC<HeaderProps> = ({ onSearch, isLoading }) => {
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
    <div className={styles.headerContainer}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        placeholder="Search Pokemon..."
        disabled={isLoading}
        className={styles.searchInput}
      />
      <button
        onClick={handleSearch}
        disabled={isLoading}
        className={styles.searchButton}
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </div>
  );
};

export default Header;
