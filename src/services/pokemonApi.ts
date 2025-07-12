import type { PokemonResponse, PokemonDetails } from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

export const PokemonApi = {
  async searchPokemon(
    searchTerm: string = '',
    limit: number = 20
  ): Promise<PokemonResponse> {
    try {
      let url: string;

      if (searchTerm.trim()) {
        url = `${BASE_URL}/pokemon?limit=1000`;
      } else {
        url = `${BASE_URL}/pokemon?limit=${limit}`;
      }

      const response = await fetch(url);

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
      const response = await fetch(`${BASE_URL}/pokemon/${name}`);

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
