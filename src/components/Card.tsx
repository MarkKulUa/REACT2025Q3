import React, { Component } from 'react';
import type { Pokemon, PokemonDetails } from '../types/pokemon';
import { PokemonApi } from '../services/pokemonApi';

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
        <div
          style={{
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            padding: '16px',
            margin: '8px',
            backgroundColor: '#f8f9fa',
            display: 'flex',
            alignItems: 'center',
            minHeight: '100px',
          }}
        >
          <div style={{ marginLeft: '16px' }}>
            <div
              style={{ fontSize: '18px', fontWeight: 'bold', color: '#6c757d' }}
            >
              Loading...
            </div>
            <div style={{ fontSize: '14px', color: '#6c757d' }}>
              Fetching Pokemon details
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div
          style={{
            border: '1px solid #f5c6cb',
            borderRadius: '8px',
            padding: '16px',
            margin: '8px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
          }}
        >
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
            {pokemon.name}
          </div>
          <div style={{ fontSize: '14px' }}>Error: {error}</div>
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
        style={{
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          padding: '16px',
          margin: '8px',
          backgroundColor: 'white',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        {details.sprites.front_default && (
          <img
            src={details.sprites.front_default}
            alt={pokemon.name}
            style={{ width: '64px', height: '64px' }}
          />
        )}
        <div style={{ marginLeft: '16px', flex: 1 }}>
          <div
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              textTransform: 'capitalize',
            }}
          >
            {pokemon.name}
          </div>
          <div style={{ fontSize: '14px', color: '#6c757d', marginTop: '4px' }}>
            {description}
          </div>
        </div>
      </div>
    );
  }
}

export default Card;
