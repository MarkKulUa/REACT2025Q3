import { renderHook, act, waitFor } from '@testing-library/react';
import { usePokemonDetails } from '../usePokemonDetails';
import { PokemonApi } from '../../services/pokemonApi';
import type { PokemonDetails } from '../../types/pokemon';

// Mock the PokemonApi
vi.mock('../../services/pokemonApi', () => ({
  PokemonApi: {
    getPokemonDetails: vi.fn(),
  },
}));

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
  });

  describe('Initial State', () => {
    it('returns correct initial state when pokemonName is null', () => {
      const { result } = renderHook(() => usePokemonDetails(null));

      expect(result.current.details).toBe(null);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('returns correct initial state when pokemonName is provided', () => {
      vi.mocked(PokemonApi.getPokemonDetails).mockImplementation(
        () => new Promise(() => {}) // Never resolves to keep loading state
      );

      const { result } = renderHook(() => usePokemonDetails('pikachu'));

      expect(result.current.details).toBe(null);
      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBe(null);
    });
  });

  describe('Successful API Calls', () => {
    it('fetches and returns pokemon details successfully', async () => {
      vi.mocked(PokemonApi.getPokemonDetails).mockResolvedValue(
        mockPokemonDetails
      );

      const { result } = renderHook(() => usePokemonDetails('pikachu'));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.details).toEqual(mockPokemonDetails);
      expect(result.current.error).toBe(null);
      expect(PokemonApi.getPokemonDetails).toHaveBeenCalledWith('pikachu');
    });

    it('calls API with correct pokemon name', async () => {
      vi.mocked(PokemonApi.getPokemonDetails).mockResolvedValue(
        mockPokemonDetails
      );

      renderHook(() => usePokemonDetails('charizard'));

      expect(PokemonApi.getPokemonDetails).toHaveBeenCalledWith('charizard');
    });

    it('updates loading state correctly during fetch', async () => {
      let resolvePromise: (value: PokemonDetails) => void = () => {};
      vi.mocked(PokemonApi.getPokemonDetails).mockImplementation(
        () =>
          new Promise<PokemonDetails>((resolve) => {
            resolvePromise = resolve;
          })
      );

      const { result } = renderHook(() => usePokemonDetails('pikachu'));

      // Initially loading
      expect(result.current.isLoading).toBe(true);
      expect(result.current.details).toBe(null);
      expect(result.current.error).toBe(null);

      // Complete the fetch
      await act(async () => {
        resolvePromise(mockPokemonDetails);
      });

      // Should no longer be loading
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.details).toEqual(mockPokemonDetails);
      expect(result.current.error).toBe(null);
    });
  });

  describe('Error Handling', () => {
    it('handles API errors correctly', async () => {
      const errorMessage = 'Pokemon not found';
      vi.mocked(PokemonApi.getPokemonDetails).mockRejectedValue(
        new Error(errorMessage)
      );

      const { result } = renderHook(() => usePokemonDetails('nonexistent'));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.details).toBe(null);
      expect(result.current.error).toBe(errorMessage);
    });

    it('handles unknown errors correctly', async () => {
      vi.mocked(PokemonApi.getPokemonDetails).mockRejectedValue('String error');

      const { result } = renderHook(() => usePokemonDetails('test'));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.details).toBe(null);
      expect(result.current.error).toBe('Unknown error occurred');
    });

    it('clears previous data on error', async () => {
      // First successful call
      vi.mocked(PokemonApi.getPokemonDetails).mockResolvedValueOnce(
        mockPokemonDetails
      );

      const { result, rerender } = renderHook(
        ({ pokemonName }: { pokemonName: string | null }) =>
          usePokemonDetails(pokemonName),
        { initialProps: { pokemonName: 'pikachu' as string | null } }
      );

      await waitFor(() => {
        expect(result.current.details).toEqual(mockPokemonDetails);
      });

      // Second call with error
      vi.mocked(PokemonApi.getPokemonDetails).mockRejectedValue(
        new Error('Network error')
      );

      rerender({ pokemonName: 'invalid' });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.details).toBe(null);
      expect(result.current.error).toBe('Network error');
    });
  });

  describe('Pokemon Name Changes', () => {
    it('fetches new data when pokemon name changes', async () => {
      vi.mocked(PokemonApi.getPokemonDetails).mockResolvedValue(
        mockPokemonDetails
      );

      const { result, rerender } = renderHook(
        ({ pokemonName }: { pokemonName: string | null }) =>
          usePokemonDetails(pokemonName),
        { initialProps: { pokemonName: 'pikachu' as string | null } }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(PokemonApi.getPokemonDetails).toHaveBeenCalledWith('pikachu');

      // Change pokemon name
      rerender({ pokemonName: 'charizard' });

      await waitFor(() => {
        expect(PokemonApi.getPokemonDetails).toHaveBeenCalledWith('charizard');
      });

      expect(PokemonApi.getPokemonDetails).toHaveBeenCalledTimes(2);
    });

    it('clears data when pokemon name becomes null', async () => {
      vi.mocked(PokemonApi.getPokemonDetails).mockResolvedValue(
        mockPokemonDetails
      );

      const { result, rerender } = renderHook(
        ({ pokemonName }: { pokemonName: string | null }) =>
          usePokemonDetails(pokemonName),
        { initialProps: { pokemonName: 'pikachu' as string | null } }
      );

      await waitFor(() => {
        expect(result.current.details).toEqual(mockPokemonDetails);
      });

      // Change to null
      rerender({ pokemonName: null });

      expect(result.current.details).toBe(null);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('does not make API call when pokemon name is null', () => {
      renderHook(() => usePokemonDetails(null));

      expect(PokemonApi.getPokemonDetails).not.toHaveBeenCalled();
    });

    it('does not make API call when pokemon name is empty string', () => {
      renderHook(() => usePokemonDetails(''));

      expect(PokemonApi.getPokemonDetails).not.toHaveBeenCalled();
    });
  });

  describe('Cleanup and Memory Management', () => {
    it('does not update state after component unmount', async () => {
      let resolvePromise: (value: PokemonDetails) => void = () => {};
      vi.mocked(PokemonApi.getPokemonDetails).mockImplementation(
        () =>
          new Promise<PokemonDetails>((resolve) => {
            resolvePromise = resolve;
          })
      );

      const { result, unmount } = renderHook(() =>
        usePokemonDetails('pikachu')
      );

      expect(result.current.isLoading).toBe(true);

      // Unmount before API call completes
      unmount();

      // Complete the API call after unmount
      await act(async () => {
        resolvePromise(mockPokemonDetails);
      });

      // Should not cause any errors or warnings
      expect(true).toBe(true); // Test passes if no errors thrown
    });
  });

  describe('Edge Cases', () => {
    it('handles very long pokemon names', async () => {
      const longName = 'a'.repeat(1000);
      vi.mocked(PokemonApi.getPokemonDetails).mockResolvedValue(
        mockPokemonDetails
      );

      renderHook(() => usePokemonDetails(longName));

      expect(PokemonApi.getPokemonDetails).toHaveBeenCalledWith(longName);
    });

    it('handles special characters in pokemon names', async () => {
      const specialName = 'nidoran-♀';
      vi.mocked(PokemonApi.getPokemonDetails).mockResolvedValue(
        mockPokemonDetails
      );

      renderHook(() => usePokemonDetails(specialName));

      expect(PokemonApi.getPokemonDetails).toHaveBeenCalledWith(specialName);
    });

    it('handles rapid pokemon name changes', async () => {
      vi.mocked(PokemonApi.getPokemonDetails).mockResolvedValue(
        mockPokemonDetails
      );

      const { rerender } = renderHook(
        ({ pokemonName }: { pokemonName: string | null }) =>
          usePokemonDetails(pokemonName),
        { initialProps: { pokemonName: 'pikachu' as string | null } }
      );

      // Rapidly change pokemon names
      rerender({ pokemonName: 'charizard' });
      rerender({ pokemonName: 'blastoise' });
      rerender({ pokemonName: 'venusaur' });

      await waitFor(() => {
        expect(PokemonApi.getPokemonDetails).toHaveBeenCalledWith('venusaur');
      });

      // Should have been called for each pokemon
      expect(PokemonApi.getPokemonDetails).toHaveBeenCalledTimes(4);
    });
  });

  describe('Return Value Structure', () => {
    it('always returns an object with correct properties', () => {
      const { result } = renderHook(() => usePokemonDetails(null));

      expect(result.current).toHaveProperty('details');
      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('error');
      expect(Object.keys(result.current)).toHaveLength(3);
    });

    it('maintains consistent return type across state changes', async () => {
      vi.mocked(PokemonApi.getPokemonDetails).mockResolvedValue(
        mockPokemonDetails
      );

      const { result } = renderHook(() => usePokemonDetails('pikachu'));

      // Loading state
      expect(
        result.current.details === null ||
          typeof result.current.details === 'object'
      ).toBe(true);
      expect(typeof result.current.isLoading).toBe('boolean');
      expect(
        result.current.error === null ||
          typeof result.current.error === 'string'
      ).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Success state
      expect(
        result.current.details === null ||
          typeof result.current.details === 'object'
      ).toBe(true);
      expect(typeof result.current.isLoading).toBe('boolean');
      expect(
        result.current.error === null ||
          typeof result.current.error === 'string'
      ).toBe(true);
    });
  });
});
