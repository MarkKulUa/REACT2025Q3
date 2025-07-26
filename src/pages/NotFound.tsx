import React from 'react';
import { Link } from 'react-router-dom';
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
          <Link to="/" className={styles.homeButton}>
            🏠 Go to Home
          </Link>
          <Link to="/about" className={styles.aboutButton}>
            ℹ️ About Page
          </Link>
        </div>

        <div className={styles.pokemonEmoji}>🔍 No Pokemon found here!</div>
      </div>
    </div>
  );
};

export default NotFound;
