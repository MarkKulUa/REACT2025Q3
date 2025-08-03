import React from 'react';
import { useTheme } from '../hooks/useTheme';
import type { Theme } from '../contexts/ThemeContextDef';
import styles from './ThemeSelector.module.css';

const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return (
    <div className={styles.themeSelector}>
      <label className={styles.label}>Theme:</label>
      <div className={styles.options}>
        <label className={styles.option}>
          <input
            type="radio"
            name="theme"
            value="light"
            checked={theme === 'light'}
            onChange={() => handleThemeChange('light')}
            className={styles.radio}
          />
          <span className={styles.optionText}>Light</span>
        </label>
        <label className={styles.option}>
          <input
            type="radio"
            name="theme"
            value="dark"
            checked={theme === 'dark'}
            onChange={() => handleThemeChange('dark')}
            className={styles.radio}
          />
          <span className={styles.optionText}>Dark</span>
        </label>
      </div>
    </div>
  );
};

export default ThemeSelector;
