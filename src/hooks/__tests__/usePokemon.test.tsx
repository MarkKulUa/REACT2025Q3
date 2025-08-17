import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { vi } from 'vitest';

// Create a minimal store for testing
const testStore = configureStore({
  reducer: {
    test: () => null,
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={testStore}>{children}</Provider>
);

// Mock hooks using vi.hoisted
const mockDispatch = vi.hoisted(() => vi.fn());
const mockTrigger = vi.hoisted(() => vi.fn());
const mockQueryResult = vi.hoisted(() => ({
  data: null,
  isLoading: false,
  isFetching: false,
  error: null,
}));

vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useDispatch: () => mockDispatch,
  };
});

vi.mock('../../store/rtkPokemonApi', () => ({
  rtkPokemonApi: {
    util: {
      invalidateTags: vi.fn(),
    },
  },
  useLazySearchPokemonQuery: () => [mockTrigger, mockQueryResult],
}));

// Import the hook after mocking
const { usePokemon } = await import('../usePokemon');

describe('usePokemon Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTrigger.mockClear();
    Object.assign(mockQueryResult, {
      data: null,
      isLoading: false,
      isFetching: false,
      error: null,
    });
  });

  describe('Initial State', () => {
    it('returns correct initial state', () => {
      const { result } = renderHook(() => usePokemon(), { wrapper });

      expect(result.current.pokemon).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.totalCount).toBe(0);
      expect(typeof result.current.searchPokemon).toBe('function');
      expect(typeof result.current.refetch).toBe('function');
    });
  });

  describe('Data Loading', () => {
    it('returns pokemon data when available', () => {
      Object.assign(mockQueryResult, {
        data: {
          results: [
            { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
            { name: 'charizard', url: 'https://pokeapi.co/api/v2/pokemon/6/' },
          ],
          totalCount: 20,
        },
      });

      const { result } = renderHook(() => usePokemon(), { wrapper });

      expect(result.current.pokemon).toHaveLength(2);
      expect(result.current.pokemon[0].name).toBe('pikachu');
      expect(result.current.totalCount).toBe(20);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('shows loading state correctly', () => {
      Object.assign(mockQueryResult, {
        isLoading: true,
      });

      const { result } = renderHook(() => usePokemon(), { wrapper });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.pokemon).toEqual([]);
      expect(result.current.error).toBe(null);
    });

    it('shows fetching state correctly', () => {
      Object.assign(mockQueryResult, {
        isFetching: true,
      });

      const { result } = renderHook(() => usePokemon(), { wrapper });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.pokemon).toEqual([]);
      expect(result.current.error).toBe(null);
    });
  });

  describe('Error Handling', () => {
    it('handles error with status and data', () => {
      Object.assign(mockQueryResult, {
        error: {
          status: 404,
          data: 'Pokemon not found',
        },
      });

      const { result } = renderHook(() => usePokemon(), { wrapper });

      expect(result.current.error).toBe('Pokemon not found');
      expect(result.current.isLoading).toBe(false);
      expect(result.current.pokemon).toEqual([]);
    });

    it('handles error with message', () => {
      Object.assign(mockQueryResult, {
        error: {
          message: 'Network error',
        },
      });

      const { result } = renderHook(() => usePokemon(), { wrapper });

      expect(result.current.error).toBe('Network error');
      expect(result.current.isLoading).toBe(false);
      expect(result.current.pokemon).toEqual([]);
    });

    it('handles unknown error', () => {
      Object.assign(mockQueryResult, {
        error: { unknown: 'error' },
      });

      const { result } = renderHook(() => usePokemon(), { wrapper });

      expect(result.current.error).toBe('Unknown error occurred');
      expect(result.current.isLoading).toBe(false);
      expect(result.current.pokemon).toEqual([]);
    });
  });

  describe('Search Function', () => {
    it('calls trigger with correct parameters', async () => {
      mockTrigger.mockReturnValue({
        unwrap: () => Promise.resolve(),
      });

      const { result } = renderHook(() => usePokemon(), { wrapper });

      await act(async () => {
        await result.current.searchPokemon('pikachu', 2);
      });

      expect(mockTrigger).toHaveBeenCalledWith({
        searchTerm: 'pikachu',
        page: 2,
        pageSize: 20,
      });
    });

    it('handles trigger error gracefully', async () => {
      mockTrigger.mockReturnValue({
        unwrap: () => Promise.reject(new Error('API Error')),
      });

      const { result } = renderHook(() => usePokemon(), { wrapper });

      await act(async () => {
        await result.current.searchPokemon('pikachu');
      });

      expect(mockTrigger).toHaveBeenCalled();
      // Should not throw error
    });
  });

  describe('Return Value Structure', () => {
    it('always returns an object with correct properties', () => {
      const { result } = renderHook(() => usePokemon(), { wrapper });

      expect(result.current).toHaveProperty('pokemon');
      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('error');
      expect(result.current).toHaveProperty('searchPokemon');
      expect(result.current).toHaveProperty('totalCount');
      expect(result.current).toHaveProperty('refetch');
      expect(Object.keys(result.current)).toHaveLength(6);
    });
  });
});
