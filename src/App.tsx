import React, { Component } from 'react';
import type { Pokemon } from './types/pokemon';
import { PokemonApi } from './services/pokemonApi';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import Main from './components/Main';
import styles from './App.module.css';
import './App.css';

interface AppState {
  pokemon: Pokemon[];
  isLoading: boolean;
  error: string | null;
}

class App extends Component<Record<string, never>, AppState> {
  constructor(props: Record<string, never>) {
    super(props);
    this.state = {
      pokemon: [],
      isLoading: false,
      error: null,
    };
  }

  handleSearch = async (searchTerm: string): Promise<void> => {
    this.setState({ isLoading: true, error: null });

    try {
      const response = await PokemonApi.searchPokemon(searchTerm, 20);
      this.setState({
        pokemon: response.results,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      this.setState({
        pokemon: [],
        isLoading: false,
        error: errorMessage,
      });
    }
  };

  render(): React.ReactNode {
    const { pokemon, isLoading, error } = this.state;

    return (
      <ErrorBoundary>
        <div className={styles.appContainer}>
          <Header onSearch={this.handleSearch} isLoading={isLoading} />
          <Main pokemon={pokemon} isLoading={isLoading} error={error} />
        </div>
      </ErrorBoundary>
    );
  }
}

export default App;
