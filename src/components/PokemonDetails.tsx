import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePokemonDetails } from '../hooks/usePokemonDetails';
import styles from './PokemonDetails.module.css';

const PokemonDetails: React.FC = () => {
  const { pokemonName } = useParams<{ pokemonName: string }>();
  const navigate = useNavigate();
  const { details, isLoading, error } = usePokemonDetails(pokemonName || null);

  const handleClose = () => {
    navigate('../', { replace: true });
  };

  const handleContainerClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  if (isLoading) {
    return (
      <div className={styles.detailsContainer} onClick={handleContainerClick}>
        <div className={styles.header}>
          <button onClick={handleClose} className={styles.closeButton}>
            ✕ Close
          </button>
        </div>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <div>Loading Pokemon details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.detailsContainer} onClick={handleContainerClick}>
        <div className={styles.header}>
          <button onClick={handleClose} className={styles.closeButton}>
            ✕ Close
          </button>
        </div>
        <div className={styles.errorContainer}>
          <h3>Error loading Pokemon details</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!details) {
    return (
      <div className={styles.detailsContainer} onClick={handleContainerClick}>
        <div className={styles.header}>
          <button onClick={handleClose} className={styles.closeButton}>
            ✕ Close
          </button>
        </div>
        <div className={styles.errorContainer}>
          <h3>Pokemon not found</h3>
          <p>No details available for this Pokemon.</p>
        </div>
      </div>
    );
  }

  const types = details.types.map((t) => t.type.name);

  return (
    <div className={styles.detailsContainer} onClick={handleContainerClick}>
      <div className={styles.header}>
        <h2 className={styles.pokemonName}>{details.name}</h2>
        <button onClick={handleClose} className={styles.closeButton}>
          ✕ Close
        </button>
      </div>

      <div className={styles.content}>
        {details.sprites.front_default && (
          <div className={styles.imageContainer}>
            <img
              src={details.sprites.front_default}
              alt={details.name}
              className={styles.pokemonImage}
            />
          </div>
        )}

        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.label}>ID:</span>
            <span className={styles.value}>#{details.id}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.label}>Height:</span>
            <span className={styles.value}>{details.height / 10}m</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.label}>Weight:</span>
            <span className={styles.value}>{details.weight / 10}kg</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.label}>Type(s):</span>
            <div className={styles.typesContainer}>
              {types.map((type) => (
                <span
                  key={type}
                  className={`${styles.typeTag} ${styles[`type-${type}`]}`}
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetails;
