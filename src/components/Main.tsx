import React, { Component } from 'react';
import type { Pokemon } from '../types/pokemon';
import CardList from './CardList';
import styles from './Main.module.css';

interface MainProps {
  pokemon: Pokemon[];
  isLoading: boolean;
  error: string | null;
  onError: (error: Error | string) => void;
}

class Main extends Component<MainProps> {
  throwError = (): void => {
    this.props.onError(new Error('Test error for ErrorBoundary!'));
  };

  render(): React.ReactNode {
    const { pokemon, isLoading, error } = this.props;

    return (
      <div className={styles.mainContainer}>
        <CardList pokemon={pokemon} isLoading={isLoading} error={error} />

        <div className={styles.errorButtonContainer}>
          <button onClick={this.throwError} className={styles.errorButton}>
            Test Error
          </button>
        </div>
      </div>
    );
  }
}

export default Main;
