import React, { Component } from 'react';
import type { Pokemon } from '../types/pokemon';
import Card from './Card';
import styles from './CardList.module.css';

interface CardListProps {
  pokemon: Pokemon[];
  isLoading: boolean;
  error: string | null;
}

class CardList extends Component<CardListProps> {
  render(): React.ReactNode {
    const { pokemon, isLoading, error } = this.props;

    if (isLoading) {
      return (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingContent}>
            <div className={styles.spinner}></div>
            <div>Loading Pokemon...</div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className={styles.errorContainer}>
          <h3 className={styles.errorTitle}>Error occurred</h3>
          <p className={styles.errorMessage}>{error}</p>
        </div>
      );
    }

    if (pokemon.length === 0) {
      return (
        <div className={styles.emptyContainer}>
          No Pokemon found. Try a different search term.
        </div>
      );
    }

    return (
      <div className={styles.cardsGrid}>
        {pokemon.map((poke) => (
          <Card key={poke.name} pokemon={poke} />
        ))}
      </div>
    );
  }
}

export default CardList;
