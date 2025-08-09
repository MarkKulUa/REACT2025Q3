import React from 'react';
import { Link } from 'react-router-dom';
import ThemeSelector from '../components/ThemeSelector';
import styles from './About.module.css';

const About: React.FC = () => {
  return (
    <div className={styles.aboutContainer}>
      <div className={styles.headerSection}>
        <h1 className={styles.title}>About This Pokemon App</h1>
        <div className={styles.themeSelectorContainer}>
          <ThemeSelector />
        </div>
      </div>

      <section className={styles.authorSection}>
        <h2>Author Information</h2>
        <p>
          This Pokemon search application was created as part of the React
          course assignment.
        </p>
        <p>
          Developed with React, TypeScript, and React Router for a modern,
          type-safe experience.
        </p>
      </section>

      <section className={styles.courseSection}>
        <h2>Course Information</h2>
        <p>This project is part of the React course at RS School.</p>
        <a
          href="https://rs.school/courses/reactjs"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.courseLink}
        >
          Visit RS School React Course
        </a>
      </section>

      <section className={styles.featuresSection}>
        <h2>Features</h2>
        <ul className={styles.featuresList}>
          <li>Search Pokemon by name with localStorage persistence</li>
          <li>Pagination with URL synchronization</li>
          <li>Master-detail view with route-based navigation</li>
          <li>Responsive design and error handling</li>
          <li>Built with modern React hooks and functional components</li>
        </ul>
      </section>

      <div className={styles.navigationSection}>
        <Link to="/" className={styles.homeLink}>
          ← Back to Pokemon Search
        </Link>
      </div>
    </div>
  );
};

export default About;
