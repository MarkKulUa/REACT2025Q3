import React from 'react';
import { usePokemonDetails } from '../hooks/usePokemonDetails';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  addSelectedItem,
  removeSelectedItem,
  updateItemDetails,
} from '../store/slices/selectedItemsSlice';
import type { Pokemon } from '../types/pokemon';
import styles from './Card.module.css';

interface CardProps {
  pokemon: Pokemon;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ pokemon, onClick }) => {
  const { details, isLoading, error } = usePokemonDetails(pokemon.name);
  const dispatch = useAppDispatch();
  const selectedItems = useAppSelector((state) => state.selectedItems.items);

  const isSelected = selectedItems.some(
    (item) => item.pokemon.name === pokemon.name
  );

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();

    if (event.target.checked) {
      dispatch(addSelectedItem({ pokemon }));

      if (details) {
        const types = details.types.map((t) => t.type.name).join(', ');
        const description = `Height: ${details.height / 10}m, Weight: ${details.weight / 10}kg, Types: ${types}`;
        dispatch(
          updateItemDetails({
            name: pokemon.name,
            details,
            description,
          })
        );
      }
    } else {
      dispatch(removeSelectedItem(pokemon.name));
    }
  };

  React.useEffect(() => {
    if (details && isSelected) {
      const types = details.types.map((t) => t.type.name).join(', ');
      const description = `Height: ${details.height / 10}m, Weight: ${details.weight / 10}kg, Types: ${types}`;
      dispatch(
        updateItemDetails({
          name: pokemon.name,
          details,
          description,
        })
      );
    }
  }, [details, isSelected, pokemon.name, dispatch]);

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
      className={`${styles.cardContainer} ${isSelected ? styles.selected : ''}`}
      onClick={handleClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className={styles.checkboxContainer}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleCheckboxChange}
          className={styles.checkbox}
          aria-label={`Select ${pokemon.name}`}
        />
      </div>
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
