import React, { Component } from 'react';
import type { Pokemon } from '../types/pokemon';
import Card from './Card';

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
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '200px',
            fontSize: '18px',
            color: '#6c757d',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #007bff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            ></div>
            <div>Loading Pokemon...</div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div
          style={{
            padding: '20px',
            textAlign: 'center',
            border: '1px solid #f5c6cb',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            borderRadius: '4px',
            margin: '20px',
          }}
        >
          <h3>Error occurred</h3>
          <p>{error}</p>
        </div>
      );
    }

    if (pokemon.length === 0) {
      return (
        <div
          style={{
            padding: '40px',
            textAlign: 'center',
            color: '#6c757d',
            fontSize: '18px',
          }}
        >
          No Pokemon found. Try a different search term.
        </div>
      );
    }

    return (
      <div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '16px',
            padding: '20px',
          }}
        >
          {pokemon.map((poke) => (
            <Card key={poke.name} pokemon={poke} />
          ))}
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }
}

export default CardList;
