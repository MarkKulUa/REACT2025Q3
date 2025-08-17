import { PokemonApi } from '../pokemonApi';
import {
  mockPokemonResponse,
  mockPokemonDetails,
  mockEmptyResults,
} from '../../__tests__/mocks/pokemonApi';

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('PokemonApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    console.error = vi.fn();
  });

  describe('searchPokemon', () => {
    describe('Success Scenarios', () => {
      it('fetches all pokemon when no search term provided', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockPokemonResponse,
        });

        const result = await PokemonApi.searchPokemon('', 20);

        expect(mockFetch).toHaveBeenCalledWith(
          'https://pokeapi.co/api/v2/pokemon?limit=20'
        );
        expect(result).toEqual(mockPokemonResponse);
      });

      it('fetches all pokemon with default limit when no search term and no limit', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockPokemonResponse,
        });

        const result = await PokemonApi.searchPokemon();

        expect(mockFetch).toHaveBeenCalledWith(
          'https://pokeapi.co/api/v2/pokemon?limit=20'
        );
        expect(result).toEqual(mockPokemonResponse);
      });

      it('fetches and filters pokemon when search term provided', async () => {
        const fullResponse = {
          ...mockPokemonResponse,
          results: [
            { name: 'pikachu', url: 'https://example.com/25' },
            { name: 'raichu', url: 'https://example.com/26' },
            { name: 'bulbasaur', url: 'https://example.com/1' },
          ],
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => fullResponse,
        });

        const result = await PokemonApi.searchPokemon('pika', 20);

        expect(mockFetch).toHaveBeenCalledWith(
          'https://pokeapi.co/api/v2/pokemon?limit=1000'
        );
        expect(result.results).toHaveLength(1);
        expect(result.results[0].name).toBe('pikachu');
      });

      it('handles case insensitive search', async () => {
        const fullResponse = {
          ...mockPokemonResponse,
          results: [
            { name: 'pikachu', url: 'https://example.com/25' },
            { name: 'CHARIZARD', url: 'https://example.com/6' },
          ],
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => fullResponse,
        });

        const result = await PokemonApi.searchPokemon('PIKA', 20);

        expect(result.results).toHaveLength(1);
        expect(result.results[0].name).toBe('pikachu');
      });

      it('limits search results to specified limit', async () => {
        const fullResponse = {
          ...mockPokemonResponse,
          results: [
            { name: 'pikachu', url: 'https://example.com/25' },
            { name: 'pikablu', url: 'https://example.com/fake' },
            { name: 'pikachu2', url: 'https://example.com/fake2' },
          ],
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => fullResponse,
        });

        const result = await PokemonApi.searchPokemon('pika', 2);

        expect(result.results).toHaveLength(2);
      });

      it('trims whitespace from search term', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockEmptyResults,
        });

        await PokemonApi.searchPokemon('  test  ', 20);

        expect(mockFetch).toHaveBeenCalledWith(
          'https://pokeapi.co/api/v2/pokemon?limit=1000'
        );
      });
    });

    describe('Error Scenarios', () => {
      it('throws error when response is not ok (404)', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 404,
        });

        await expect(PokemonApi.searchPokemon('invalid')).rejects.toThrow(
          'HTTP error! status: 404'
        );
        expect(console.error).toHaveBeenCalledWith(
          'Error fetching Pokemon:',
          expect.any(Error)
        );
      });

      it('throws error when response is not ok (500)', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 500,
        });

        await expect(PokemonApi.searchPokemon()).rejects.toThrow(
          'HTTP error! status: 500'
        );
      });

      it('handles network errors', async () => {
        const networkError = new Error('Network error');
        mockFetch.mockRejectedValueOnce(networkError);

        await expect(PokemonApi.searchPokemon()).rejects.toThrow(
          'Network error'
        );
        expect(console.error).toHaveBeenCalledWith(
          'Error fetching Pokemon:',
          networkError
        );
      });

      it('handles JSON parsing errors', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => {
            throw new Error('Invalid JSON');
          },
        });

        await expect(PokemonApi.searchPokemon()).rejects.toThrow(
          'Invalid JSON'
        );
      });
    });

    describe('Empty Results', () => {
      it('returns empty results when no pokemon match search term', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockEmptyResults,
        });

        const result = await PokemonApi.searchPokemon('nonexistentpokemon');

        expect(result.results).toHaveLength(0);
      });
    });
  });

  describe('getPokemonDetails', () => {
    describe('Success Scenarios', () => {
      it('fetches pokemon details successfully', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockPokemonDetails,
        });

        const result = await PokemonApi.getPokemonDetails('bulbasaur');

        expect(mockFetch).toHaveBeenCalledWith(
          'https://pokeapi.co/api/v2/pokemon/bulbasaur'
        );
        expect(result).toEqual(mockPokemonDetails);
      });

      it('handles pokemon names with special characters', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockPokemonDetails,
        });

        await PokemonApi.getPokemonDetails('mr-mime');

        expect(mockFetch).toHaveBeenCalledWith(
          'https://pokeapi.co/api/v2/pokemon/mr-mime'
        );
      });

      it('handles pokemon IDs as strings', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockPokemonDetails,
        });

        await PokemonApi.getPokemonDetails('1');

        expect(mockFetch).toHaveBeenCalledWith(
          'https://pokeapi.co/api/v2/pokemon/1'
        );
      });
    });

    describe('Error Scenarios', () => {
      it('throws error when pokemon not found (404)', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 404,
        });

        await expect(
          PokemonApi.getPokemonDetails('invalidpokemon')
        ).rejects.toThrow('HTTP error! status: 404');
        expect(console.error).toHaveBeenCalledWith(
          'Error fetching Pokemon details:',
          expect.any(Error)
        );
      });

      it('throws error when response is not ok (500)', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 500,
        });

        await expect(PokemonApi.getPokemonDetails('bulbasaur')).rejects.toThrow(
          'HTTP error! status: 500'
        );
      });

      it('handles network errors', async () => {
        const networkError = new Error('Failed to fetch');
        mockFetch.mockRejectedValueOnce(networkError);

        await expect(PokemonApi.getPokemonDetails('bulbasaur')).rejects.toThrow(
          'Failed to fetch'
        );
        expect(console.error).toHaveBeenCalledWith(
          'Error fetching Pokemon details:',
          networkError
        );
      });

      it('handles JSON parsing errors', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => {
            throw new Error('Malformed JSON');
          },
        });

        await expect(PokemonApi.getPokemonDetails('bulbasaur')).rejects.toThrow(
          'Malformed JSON'
        );
      });

      it('handles empty pokemon name', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 404,
        });

        await expect(PokemonApi.getPokemonDetails('')).rejects.toThrow(
          'HTTP error! status: 404'
        );
      });
    });
  });
});
