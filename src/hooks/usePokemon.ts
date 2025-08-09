import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import type { Pokemon } from '../types/pokemon';
import {
  useLazySearchPokemonQuery,
  rtkPokemonApi,
} from '../store/rtkPokemonApi';

interface UsePokemonResult {
  pokemon: Pokemon[];
  isLoading: boolean;
  error: string | null;
  searchPokemon: (searchTerm: string, page?: number) => Promise<void>;
  totalCount: number;
  refetch: () => void;
}

const ITEMS_PER_PAGE = 20;

export function usePokemon(): UsePokemonResult {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  const [trigger, { data, isLoading, isFetching, error }] =
    useLazySearchPokemonQuery();

  const searchPokemon = useCallback(
    async (term: string, newPage: number = 1) => {
      setSearchTerm(term);
      setPage(newPage);
      await trigger({
        searchTerm: term,
        page: newPage,
        pageSize: ITEMS_PER_PAGE,
      })
        .unwrap()
        .catch(() => {});
    },
    [trigger]
  );

  let errorMessage: string | null = null;
  if (error) {
    if (
      error &&
      typeof error === 'object' &&
      'status' in error &&
      error.status !== undefined
    ) {
      const errorData = error as { status: unknown; data: unknown };
      if (typeof errorData.data === 'string') errorMessage = errorData.data;
      else if (
        errorData.data &&
        typeof (errorData.data as { message?: string }).message === 'string'
      ) {
        errorMessage = (errorData.data as { message: string }).message;
      } else {
        errorMessage = `HTTP error${typeof error.status === 'number' ? `! status: ${error.status}` : ''}`;
      }
    } else if (
      error &&
      typeof error === 'object' &&
      'message' in error &&
      typeof (error as { message?: string }).message === 'string'
    ) {
      errorMessage = (error as { message: string }).message;
    } else {
      errorMessage = 'Unknown error occurred';
    }
  }

  const handleRefetch = useCallback(() => {
    // Invalidate all Pokemon list cache tags to force fresh data
    dispatch(rtkPokemonApi.util.invalidateTags(['PokemonList']));
    // Also trigger a new search to immediately fetch fresh data
    if (searchTerm) {
      trigger({ searchTerm, page, pageSize: ITEMS_PER_PAGE });
    }
  }, [dispatch, searchTerm, page, trigger]);

  return {
    pokemon: data?.results ?? [],
    isLoading: isLoading || isFetching,
    error: errorMessage,
    searchPokemon,
    totalCount: data?.totalCount ?? 0,
    refetch: handleRefetch,
  };
}
