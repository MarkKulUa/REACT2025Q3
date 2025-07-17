import React, { Component } from 'react';
import type { Pokemon, PokemonDetails } from '../types/pokemon';
import { PokemonApi } from '../services/pokemonApi';
import styles from './Card.module.css';

interface CardState {
  details: PokemonDetails | null;
  isLoading: boolean;
  error: string | null;
}

interface CardProps {
  pokemon: Pokemon;
}

class Card extends Component<CardProps, CardState> {
  constructor(props: CardProps) {
    super(props);
    this.state = {
      details: null,
      isLoading: true,
      error: null,
    };
  }

  async componentDidMount(): Promise<void> {
    try {
      const details = await PokemonApi.getPokemonDetails(
        this.props.pokemon.name
      );
      this.setState({
        details,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      this.setState({
        details: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  render(): React.ReactNode {
    const { pokemon } = this.props;
    const { details, isLoading, error } = this.state;

    if (isLoading) {
      return (
        <div className={`${styles.cardContainer} ${styles.loadingCard}`}>
          <div className={styles.cardContent}>
            <div className={styles.loadingText}>Loading...</div>
            <div className={styles.loadingSubtext}>
              Fetching Pokemon details
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className={`${styles.cardContainer} ${styles.errorCard}`}>
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
      <div className={styles.cardContainer}>
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
  }
}

export default Card;
