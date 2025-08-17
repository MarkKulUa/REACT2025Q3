import type { PokemonResponse, PokemonDetails } from '@/types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

export const PokemonServerApi = {
  async searchPokemon(
    searchTerm: string = '',
    limit: number = 20,
    offset: number = 0
  ): Promise<PokemonResponse> {
    try {
      let url: string;

      if (searchTerm.trim()) {
        // For search, we need to fetch all and filter
        url = `${BASE_URL}/pokemon?limit=1000`;
      } else {
        // For pagination, use offset
        url = `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`;
      }

      const response = await fetch(url, {
        next: { revalidate: 3600 }, // Cache for 1 hour
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PokemonResponse = await response.json();

      if (searchTerm.trim()) {
        const filteredResults = data.results.filter((pokemon) =>
          pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return {
          ...data,
          results: filteredResults.slice(0, limit),
          count: filteredResults.length,
        };
      }

      return data;
    } catch (error) {
      console.error('Error fetching Pokemon:', error);
      throw error;
    }
  },

  async getPokemonDetails(name: string): Promise<PokemonDetails> {
    try {
      const response = await fetch(`${BASE_URL}/pokemon/${name}`, {
        next: { revalidate: 3600 }, // Cache for 1 hour
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching Pokemon details:', error);
      throw error;
    }
  },
};
