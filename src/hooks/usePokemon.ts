import { useState, useCallback } from 'react';
import type { Pokemon } from '../types/pokemon';
import { PokemonApi } from '../services/pokemonApi';

interface UsePokemonResult {
  pokemon: Pokemon[];
  isLoading: boolean;
  error: string | null;
  searchPokemon: (searchTerm: string, page?: number) => Promise<void>;
  totalCount: number;
}

const ITEMS_PER_PAGE = 20;

export function usePokemon(): UsePokemonResult {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const searchPokemon = useCallback(
    async (searchTerm: string, page: number = 1): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await PokemonApi.searchPokemon(
          searchTerm,
          ITEMS_PER_PAGE * 10
        );

        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const paginatedResults = response.results.slice(startIndex, endIndex);

        setPokemon(paginatedResults);
        setTotalCount(response.results.length);
        setIsLoading(false);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error occurred';
        setError(errorMessage);
        setPokemon([]);
        setTotalCount(0);
        setIsLoading(false);
      }
    },
    []
  );

  return {
    pokemon,
    isLoading,
    error,
    searchPokemon,
    totalCount,
  };
}
