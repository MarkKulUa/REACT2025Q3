import { render, screen, waitFor } from '../../__tests__/test-utils';
import Card from '../Card';
import { PokemonApi } from '../../services/pokemonApi';
import { mockPokemonDetails } from '../../__tests__/mocks/pokemonApi';
import type { Pokemon } from '../../types/pokemon';

// Mock the PokemonApi
vi.mock('../../services/pokemonApi', () => ({
  PokemonApi: {
    getPokemonDetails: vi.fn(),
  },
}));

const mockPokemon: Pokemon = {
  name: 'bulbasaur',
  url: 'https://pokeapi.co/api/v2/pokemon/1/',
};

describe('Card Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering Tests', () => {
    it('displays loading state initially', () => {
      vi.mocked(PokemonApi.getPokemonDetails).mockImplementation(
        () => new Promise(() => {}) // Never resolves to keep loading state
      );

      render(<Card pokemon={mockPokemon} />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.getByText('Fetching Pokemon details')).toBeInTheDocument();
    });

    it('displays item name and description correctly after loading', async () => {
      vi.mocked(PokemonApi.getPokemonDetails).mockResolvedValue(
        mockPokemonDetails
      );

      render(<Card pokemon={mockPokemon} />);

      await waitFor(() => {
        expect(screen.getByText(mockPokemonDetails.name)).toBeInTheDocument();
      });

      expect(screen.getByText(/Height:/)).toBeInTheDocument();
      expect(screen.getByText(/Weight:/)).toBeInTheDocument();
      expect(screen.getByText(/grass/i)).toBeInTheDocument();
      expect(screen.getByText(/poison/i)).toBeInTheDocument();
    });

    it('displays pokemon image when available', async () => {
      vi.mocked(PokemonApi.getPokemonDetails).mockResolvedValue(
        mockPokemonDetails
      );

      render(<Card pokemon={mockPokemon} />);

      await waitFor(() => {
        const image = screen.getByAltText(mockPokemonDetails.name);
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute(
          'src',
          mockPokemonDetails.sprites.front_default
        );
      });
    });

    it('handles missing props gracefully', async () => {
      const pokemonWithMissingData: Pokemon = {
        name: '',
        url: '',
      };

      vi.mocked(PokemonApi.getPokemonDetails).mockRejectedValue(
        new Error('Invalid pokemon')
      );

      render(<Card pokemon={pokemonWithMissingData} />);

      await waitFor(() => {
        expect(screen.getByText(/Error:/)).toBeInTheDocument();
        expect(screen.getByText(/Invalid pokemon/)).toBeInTheDocument();
      });
    });
  });

  describe('API Integration Tests', () => {
    it('calls API with correct pokemon name', () => {
      vi.mocked(PokemonApi.getPokemonDetails).mockResolvedValue(
        mockPokemonDetails
      );

      render(<Card pokemon={mockPokemon} />);

      expect(PokemonApi.getPokemonDetails).toHaveBeenCalledWith(
        mockPokemon.name
      );
    });

    it('handles API success response correctly', async () => {
      vi.mocked(PokemonApi.getPokemonDetails).mockResolvedValue(
        mockPokemonDetails
      );

      render(<Card pokemon={mockPokemon} />);

      await waitFor(() => {
        expect(screen.getByText(mockPokemonDetails.name)).toBeInTheDocument();
      });

      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      expect(screen.queryByText(/Error:/)).not.toBeInTheDocument();
    });

    it('handles API error response correctly', async () => {
      const errorMessage = 'Failed to fetch pokemon details';
      vi.mocked(PokemonApi.getPokemonDetails).mockRejectedValue(
        new Error(errorMessage)
      );

      render(<Card pokemon={mockPokemon} />);

      await waitFor(() => {
        expect(screen.getByText(/Error:/)).toBeInTheDocument();
        expect(screen.getByText(new RegExp(errorMessage))).toBeInTheDocument();
      });

      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      // Note: Pokemon name appears in error title, so we check for successful data instead
      expect(screen.queryByText(/Height:/)).not.toBeInTheDocument();
    });

    it('handles network errors', async () => {
      vi.mocked(PokemonApi.getPokemonDetails).mockRejectedValue(
        new Error('Network error')
      );

      render(<Card pokemon={mockPokemon} />);

      await waitFor(() => {
        expect(screen.getByText(/Error:/)).toBeInTheDocument();
        expect(screen.getByText(/Network error/)).toBeInTheDocument();
      });
    });

    it('handles API call only once on mount', () => {
      vi.mocked(PokemonApi.getPokemonDetails).mockResolvedValue(
        mockPokemonDetails
      );

      render(<Card pokemon={mockPokemon} />);

      expect(PokemonApi.getPokemonDetails).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error Handling Tests', () => {
    it('displays error message when API call fails', async () => {
      vi.mocked(PokemonApi.getPokemonDetails).mockRejectedValue(
        new Error('API Error')
      );

      render(<Card pokemon={mockPokemon} />);

      await waitFor(() => {
        expect(screen.getByText(/Error:/)).toBeInTheDocument();
        expect(screen.getByText(/API Error/)).toBeInTheDocument();
      });
    });

    it('handles different types of errors gracefully', async () => {
      // Test with non-Error object
      vi.mocked(PokemonApi.getPokemonDetails).mockRejectedValue('String error');

      render(<Card pokemon={mockPokemon} />);

      await waitFor(() => {
        expect(screen.getByText(/Error:/)).toBeInTheDocument();
        expect(screen.getByText(/Unknown error/)).toBeInTheDocument();
      });
    });

    it('shows loading state before error state', () => {
      let rejectFunction: ((reason?: unknown) => void) | undefined;
      vi.mocked(PokemonApi.getPokemonDetails).mockImplementation(
        () =>
          new Promise((_, reject) => {
            rejectFunction = reject;
          })
      );

      render(<Card pokemon={mockPokemon} />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();

      // Trigger the rejection
      if (rejectFunction) {
        rejectFunction(new Error('Test error'));
      }
    });
  });
});
