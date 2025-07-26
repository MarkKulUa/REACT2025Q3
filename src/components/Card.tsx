import React from 'react';
import { usePokemonDetails } from '../hooks/usePokemonDetails';
import type { Pokemon } from '../types/pokemon';
import styles from './Card.module.css';

interface CardProps {
  pokemon: Pokemon;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ pokemon, onClick }) => {
  const { details, isLoading, error } = usePokemonDetails(pokemon.name);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  if (isLoading) {
    return (
      <div
        className={`${styles.cardContainer} ${styles.loadingCard}`}
        onClick={handleClick}
      >
        <div className={styles.cardContent}>
          <div className={styles.loadingText}>Loading...</div>
          <div className={styles.loadingSubtext}>Fetching Pokemon details</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`${styles.cardContainer} ${styles.errorCard}`}
        onClick={handleClick}
      >
        <div className={styles.cardContent}>
          <div className={styles.errorTitle}>{pokemon.name}</div>
          <div className={styles.errorMessage}>Error: {error}</div>
        </div>
      </div>
    );
  }

  if (!details) {
    return null;
  }

  const types = details.types.map((t) => t.type.name).join(', ');
  const description = `Height: ${details.height / 10}m, Weight: ${details.weight / 10}kg, Types: ${types}`;

  return (
    <div
      className={styles.cardContainer}
      onClick={handleClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {details.sprites.front_default && (
        <img
          src={details.sprites.front_default}
          alt={pokemon.name}
          className={styles.pokemonImage}
        />
      )}
      <div className={styles.cardContent}>
        <div className={styles.pokemonName}>{pokemon.name}</div>
        <div className={styles.pokemonDescription}>{description}</div>
      </div>
    </div>
  );
};

export default Card;
