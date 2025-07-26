import { useState, useEffect } from 'react';
import type { PokemonDetails } from '../types/pokemon';
import { PokemonApi } from '../services/pokemonApi';

interface UsePokemonDetailsResult {
  details: PokemonDetails | null;
  isLoading: boolean;
  error: string | null;
}

export function usePokemonDetails(
  pokemonName: string | null
): UsePokemonDetailsResult {
  const [details, setDetails] = useState<PokemonDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pokemonName) {
      setDetails(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    const fetchDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const pokemonDetails = await PokemonApi.getPokemonDetails(pokemonName);
        setDetails(pokemonDetails);
        setIsLoading(false);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error occurred';
        setError(errorMessage);
        setDetails(null);
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [pokemonName]);

  return {
    details,
    isLoading,
    error,
  };
}
