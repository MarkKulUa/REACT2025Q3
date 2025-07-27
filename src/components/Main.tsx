import React from 'react';
import type { Pokemon } from '../types/pokemon';
import CardList from './CardList';
import styles from './Main.module.css';

interface MainProps {
  pokemon: Pokemon[];
  isLoading: boolean;
  error: string | null;
  onCardClick?: (pokemon: Pokemon) => void;
}

const Main: React.FC<MainProps> = ({
  pokemon,
  isLoading,
  error,
  onCardClick,
}) => {
  return (
    <div className={styles.mainContainer}>
      <CardList
        pokemon={pokemon}
        isLoading={isLoading}
        error={error}
        onCardClick={onCardClick}
      />
    </div>
  );
};

export default Main;
