import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import type { PokemonDetails } from '../../types/pokemon';
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
const mockRefetch = vi.hoisted(() => vi.fn());
const mockQueryResult = vi.hoisted(() => ({
  data: null,
  isFetching: false,
  error: null,
  refetch: mockRefetch,
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
  useGetPokemonDetailsQuery: () => mockQueryResult,
}));

// Import the hook after mocking
const { usePokemonDetails } = await import('../usePokemonDetails');

const mockPokemonDetails: PokemonDetails = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  sprites: {
    front_default:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
  },
  types: [
    {
      type: {
        name: 'electric',
      },
    },
  ],
};

describe('usePokemonDetails Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRefetch.mockClear();
    Object.assign(mockQueryResult, {
      data: null,
      isFetching: false,
      error: null,
      refetch: mockRefetch,
    });
  });

  describe('Initial State', () => {
    it('returns correct initial state when pokemonName is null', () => {
      const { result } = renderHook(() => usePokemonDetails(null), { wrapper });

      expect(result.current.details).toBe(null);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(typeof result.current.refetch).toBe('function');
    });

    it('returns correct initial state when pokemonName is provided and loading', () => {
      Object.assign(mockQueryResult, {
        isFetching: true,
      });

      const { result } = renderHook(() => usePokemonDetails('pikachu'), {
        wrapper,
      });

      expect(result.current.details).toBe(null);
      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBe(null);
    });

    it('does not show loading when pokemon name is null', () => {
      Object.assign(mockQueryResult, {
        isFetching: true,
      });

      const { result } = renderHook(() => usePokemonDetails(null), { wrapper });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Successful Data Loading', () => {
    it('returns pokemon details when available', () => {
      Object.assign(mockQueryResult, {
        data: mockPokemonDetails,
        isFetching: false,
      });

      const { result } = renderHook(() => usePokemonDetails('pikachu'), {
        wrapper,
      });

      expect(result.current.details).toEqual(mockPokemonDetails);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('shows loading state correctly', () => {
      Object.assign(mockQueryResult, {
        data: null,
        isFetching: true,
      });

      const { result } = renderHook(() => usePokemonDetails('pikachu'), {
        wrapper,
      });

      expect(result.current.details).toBe(null);
      expect(result.current.isLoading).toBe(true);
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

      const { result } = renderHook(() => usePokemonDetails('nonexistent'), {
        wrapper,
      });

      expect(result.current.error).toBe('Pokemon not found');
      expect(result.current.isLoading).toBe(false);
      expect(result.current.details).toBe(null);
    });

    it('handles error with message', () => {
      Object.assign(mockQueryResult, {
        error: {
          message: 'Network error',
        },
      });

      const { result } = renderHook(() => usePokemonDetails('test'), {
        wrapper,
      });

      expect(result.current.error).toBe('Network error');
      expect(result.current.isLoading).toBe(false);
      expect(result.current.details).toBe(null);
    });

    it('handles unknown error', () => {
      Object.assign(mockQueryResult, {
        error: { unknown: 'error' },
      });

      const { result } = renderHook(() => usePokemonDetails('test'), {
        wrapper,
      });

      expect(result.current.error).toBe('Unknown error occurred');
      expect(result.current.isLoading).toBe(false);
      expect(result.current.details).toBe(null);
    });

    it('handles error with nested data message', () => {
      Object.assign(mockQueryResult, {
        error: {
          status: 500,
          data: { message: 'Server error' },
        },
      });

      const { result } = renderHook(() => usePokemonDetails('test'), {
        wrapper,
      });

      expect(result.current.error).toBe('Server error');
    });

    it('handles HTTP error without specific message', () => {
      Object.assign(mockQueryResult, {
        error: {
          status: 500,
          data: {},
        },
      });

      const { result } = renderHook(() => usePokemonDetails('test'), {
        wrapper,
      });

      expect(result.current.error).toBe('HTTP error! status: 500');
    });
  });

  describe('Refetch Function', () => {
    it('does not call refetch when pokemon name is null', () => {
      const { result } = renderHook(() => usePokemonDetails(null), { wrapper });

      act(() => {
        result.current.refetch();
      });

      expect(mockRefetch).not.toHaveBeenCalled();
    });
  });

  describe('Return Value Structure', () => {
    it('always returns an object with correct properties', () => {
      const { result } = renderHook(() => usePokemonDetails(null), { wrapper });

      expect(result.current).toHaveProperty('details');
      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('error');
      expect(result.current).toHaveProperty('refetch');
      expect(Object.keys(result.current)).toHaveLength(4);
    });

    it('maintains consistent return type across state changes', () => {
      Object.assign(mockQueryResult, {
        data: mockPokemonDetails,
      });

      const { result } = renderHook(() => usePokemonDetails('pikachu'), {
        wrapper,
      });

      expect(
        result.current.details === null ||
          typeof result.current.details === 'object'
      ).toBe(true);
      expect(typeof result.current.isLoading).toBe('boolean');
      expect(
        result.current.error === null ||
          typeof result.current.error === 'string'
      ).toBe(true);
      expect(typeof result.current.refetch).toBe('function');
    });
  });
});
