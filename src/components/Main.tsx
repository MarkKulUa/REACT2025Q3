import React, { Component } from 'react';
import type { Pokemon } from '../types/pokemon';
import CardList from './CardList';

interface MainProps {
  pokemon: Pokemon[];
  isLoading: boolean;
  error: string | null;
}

class Main extends Component<MainProps> {
  throwError = (): void => {
    throw new Error('Test error for ErrorBoundary!');
  };

  render(): React.ReactNode {
    const { pokemon, isLoading, error } = this.props;

    return (
      <div style={{ flex: 1, minHeight: 'calc(100vh - 80px)' }}>
        <CardList pokemon={pokemon} isLoading={isLoading} error={error} />

        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
          }}
        >
          <button
            onClick={this.throwError}
            style={{
              padding: '10px 15px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            Test Error
          </button>
        </div>
      </div>
    );
  }
}

export default Main;
