import React from 'react';
import styles from './NotFound.module.css';

const NotFound: React.FC = () => {
  return (
    <div className={styles.notFoundContainer}>
      <div className={styles.content}>
        <h1 className={styles.errorCode}>404</h1>
        <h2 className={styles.errorTitle}>Page Not Found</h2>
        <p className={styles.errorMessage}>
          Oops! The page you&apos;re looking for doesn&apos;t exist. It might
          have been moved, deleted, or you entered the wrong URL.
        </p>

        <div className={styles.navigation}>
          <a href="/" className={styles.homeButton}>
            🏠 Go Home
          </a>
          <a href="/about" className={styles.aboutButton}>
            ℹ️ About Page
          </a>
        </div>

        <div className={styles.pokemonEmoji}>🔍 No Pokemon found here!</div>
      </div>
    </div>
  );
};

export default NotFound;
