import { renderHook, act, waitFor } from '@testing-library/react';
import { usePokemon } from '../usePokemon';
import { PokemonApi } from '../../services/pokemonApi';
import type { PokemonResponse } from '../../types/pokemon';

vi.mock('../../services/pokemonApi', () => ({
  PokemonApi: {
    searchPokemon: vi.fn(),
  },
}));

const mockPokemonResponse: PokemonResponse = {
  count: 100,
  next: null,
  previous: null,
  results: Array.from({ length: 50 }, (_, i) => ({
    name: `pokemon-${i + 1}`,
    url: `https://pokeapi.co/api/v2/pokemon/${i + 1}/`,
  })),
};

describe('usePokemon Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('returns correct initial state', () => {
      const { result } = renderHook(() => usePokemon());

      expect(result.current.pokemon).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.totalCount).toBe(0);
      expect(typeof result.current.searchPokemon).toBe('function');
    });
  });

  describe('searchPokemon Function', () => {
    it('handles successful search with pagination', async () => {
      vi.mocked(PokemonApi.searchPokemon).mockResolvedValue(
        mockPokemonResponse
      );

      const { result } = renderHook(() => usePokemon());

      await act(async () => {
        await result.current.searchPokemon('pikachu', 1);
      });

      expect(PokemonApi.searchPokemon).toHaveBeenCalledWith('pikachu', 200);
      expect(result.current.pokemon).toHaveLength(20);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.totalCount).toBe(50);
    });

    it('handles pagination correctly for second page', async () => {
      vi.mocked(PokemonApi.searchPokemon).mockResolvedValue(
        mockPokemonResponse
      );

      const { result } = renderHook(() => usePokemon());

      await act(async () => {
        await result.current.searchPokemon('pokemon', 2);
      });

      expect(result.current.pokemon).toHaveLength(20);
      expect(result.current.pokemon[0].name).toBe('pokemon-21');
      expect(result.current.pokemon[19].name).toBe('pokemon-40');
    });

    it('handles pagination for last partial page', async () => {
      const partialResponse: PokemonResponse = {
        ...mockPokemonResponse,
        results: Array.from({ length: 25 }, (_, i) => ({
          name: `pokemon-${i + 1}`,
          url: `https://pokeapi.co/api/v2/pokemon/${i + 1}/`,
        })),
      };

      vi.mocked(PokemonApi.searchPokemon).mockResolvedValue(partialResponse);

      const { result } = renderHook(() => usePokemon());

      await act(async () => {
        await result.current.searchPokemon('pokemon', 2);
      });

      expect(result.current.pokemon).toHaveLength(5);
      expect(result.current.pokemon[0].name).toBe('pokemon-21');
      expect(result.current.pokemon[4].name).toBe('pokemon-25');
    });

    it('sets loading state correctly during search', async () => {
      let resolveSearch: (value: PokemonResponse) => void = () => {};
      const searchPromise = new Promise<PokemonResponse>((resolve) => {
        resolveSearch = resolve;
      });

      vi.mocked(PokemonApi.searchPokemon).mockReturnValue(searchPromise);

      const { result } = renderHook(() => usePokemon());

      act(() => {
        result.current.searchPokemon('test');
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBe(null);

      await act(async () => {
        resolveSearch(mockPokemonResponse);
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('handles API errors correctly', async () => {
      const errorMessage = 'Network error';
      vi.mocked(PokemonApi.searchPokemon).mockRejectedValue(
        new Error(errorMessage)
      );

      const { result } = renderHook(() => usePokemon());

      await act(async () => {
        await result.current.searchPokemon('invalid').catch(() => {});
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(errorMessage);
      expect(result.current.pokemon).toEqual([]);
      expect(result.current.totalCount).toBe(0);
    });

    it('handles unknown errors correctly', async () => {
      vi.mocked(PokemonApi.searchPokemon).mockRejectedValue('String error');

      const { result } = renderHook(() => usePokemon());

      await act(async () => {
        await result.current.searchPokemon('test').catch(() => {});
      });

      expect(result.current.error).toBe('Unknown error occurred');
    });

    it('clears previous errors on new search', async () => {
      vi.mocked(PokemonApi.searchPokemon).mockRejectedValueOnce(
        new Error('First error')
      );

      const { result } = renderHook(() => usePokemon());

      await act(async () => {
        await result.current.searchPokemon('fail').catch(() => {});
      });

      expect(result.current.error).toBe('First error');

      vi.mocked(PokemonApi.searchPokemon).mockResolvedValue(
        mockPokemonResponse
      );

      await act(async () => {
        await result.current.searchPokemon('success');
      });

      expect(result.current.error).toBe(null);
      expect(result.current.pokemon).toHaveLength(20);
    });
  });

  describe('Pagination Edge Cases', () => {
    it('handles empty search results', async () => {
      const emptyResponse: PokemonResponse = {
        count: 0,
        next: null,
        previous: null,
        results: [],
      };

      vi.mocked(PokemonApi.searchPokemon).mockResolvedValue(emptyResponse);

      const { result } = renderHook(() => usePokemon());

      await act(async () => {
        await result.current.searchPokemon('nonexistent');
      });

      expect(result.current.pokemon).toEqual([]);
      expect(result.current.totalCount).toBe(0);
      expect(result.current.error).toBe(null);
    });

    it('handles page beyond available results', async () => {
      const smallResponse: PokemonResponse = {
        count: 10,
        next: null,
        previous: null,
        results: Array.from({ length: 5 }, (_, i) => ({
          name: `pokemon-${i + 1}`,
          url: `https://pokeapi.co/api/v2/pokemon/${i + 1}/`,
        })),
      };

      vi.mocked(PokemonApi.searchPokemon).mockResolvedValue(smallResponse);

      const { result } = renderHook(() => usePokemon());

      await act(async () => {
        await result.current.searchPokemon('pokemon', 5);
      });

      expect(result.current.pokemon).toEqual([]);
      expect(result.current.totalCount).toBe(5);
    });
  });

  describe('Function Memoization', () => {
    it('memoizes searchPokemon function correctly', () => {
      const { result, rerender } = renderHook(() => usePokemon());

      const firstSearchFunction = result.current.searchPokemon;

      rerender();

      const secondSearchFunction = result.current.searchPokemon;

      expect(firstSearchFunction).toBe(secondSearchFunction);
    });
  });
});
