import { useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import type { PokemonDetails } from '../types/pokemon';
import {
  useGetPokemonDetailsQuery,
  rtkPokemonApi,
} from '../store/rtkPokemonApi';

interface UsePokemonDetailsResult {
  details: PokemonDetails | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function usePokemonDetails(
  pokemonName: string | null
): UsePokemonDetailsResult {
  const dispatch = useDispatch();
  const shouldSkip = !pokemonName || pokemonName.trim() === '';

  const { data, isFetching, error, refetch } = useGetPokemonDetailsQuery(
    pokemonName as string,
    { skip: shouldSkip, refetchOnMountOrArgChange: true }
  );

  const errorMessage = useMemo(() => {
    if (!error) return null;
    if (
      error &&
      typeof error === 'object' &&
      'status' in error &&
      error.status !== undefined
    ) {
      const errorData = error as { status: unknown; data: unknown };
      if (typeof errorData.data === 'string') return errorData.data;
      if (
        errorData.data &&
        typeof (errorData.data as { message?: string }).message === 'string'
      ) {
        return (errorData.data as { message: string }).message;
      }
      return `HTTP error${typeof error.status === 'number' ? `! status: ${error.status}` : ''}`;
    }
    if (
      error &&
      typeof error === 'object' &&
      'message' in error &&
      typeof (error as { message?: string }).message === 'string'
    )
      return (error as { message: string }).message;
    return 'Unknown error occurred';
  }, [error]);

  const handleRefetch = useCallback(() => {
    if (pokemonName) {
      dispatch(
        rtkPokemonApi.util.invalidateTags([
          { type: 'PokemonDetails', id: pokemonName },
        ])
      );
      refetch();
    }
  }, [dispatch, pokemonName, refetch]);

  return {
    details: data ?? null,
    isLoading: !shouldSkip && isFetching,
    error: errorMessage,
    refetch: handleRefetch,
  };
}
