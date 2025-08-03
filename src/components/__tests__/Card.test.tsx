import { render, screen, waitFor } from '../../__tests__/test-utils';
import Card from '../Card';
import { PokemonApi } from '../../services/pokemonApi';
import type { Pokemon, PokemonDetails } from '../../types/pokemon';

vi.mock('../../services/pokemonApi', () => ({
  PokemonApi: {
    getPokemonDetails: vi.fn(),
  },
}));

const mockPokemon: Pokemon = {
  name: 'pikachu',
  url: 'https://pokeapi.co/api/v2/pokemon/25/',
};

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

describe('Card Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering Tests', () => {
    it('displays loading state initially', () => {
      vi.mocked(PokemonApi.getPokemonDetails).mockImplementation(
        () => new Promise(() => {})
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
        expect(screen.getByText('pikachu')).toBeInTheDocument();
        expect(
          screen.getByText(/Height: 0.4m, Weight: 6kg, Types: electric/)
        ).toBeInTheDocument();
      });
    });

    it('displays pokemon image when available', async () => {
      vi.mocked(PokemonApi.getPokemonDetails).mockResolvedValue(
        mockPokemonDetails
      );

      render(<Card pokemon={mockPokemon} />);

      await waitFor(() => {
        const image = screen.getByAltText('pikachu');
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute(
          'src',
          mockPokemonDetails.sprites.front_default
        );
      });
    });

    it('handles missing image gracefully', async () => {
      const detailsWithoutImage = {
        ...mockPokemonDetails,
        sprites: { front_default: null },
      };

      vi.mocked(PokemonApi.getPokemonDetails).mockResolvedValue(
        detailsWithoutImage
      );

      render(<Card pokemon={mockPokemon} />);

      await waitFor(() => {
        expect(screen.getByText('pikachu')).toBeInTheDocument();
        expect(screen.queryByAltText('pikachu')).not.toBeInTheDocument();
      });
    });
  });

  describe('API Integration Tests', () => {
    it('calls API with correct pokemon name', async () => {
      vi.mocked(PokemonApi.getPokemonDetails).mockResolvedValue(
        mockPokemonDetails
      );

      render(<Card pokemon={mockPokemon} />);

      expect(PokemonApi.getPokemonDetails).toHaveBeenCalledWith('pikachu');
    });

    it('handles API success response correctly', async () => {
      vi.mocked(PokemonApi.getPokemonDetails).mockResolvedValue(
        mockPokemonDetails
      );

      render(<Card pokemon={mockPokemon} />);

      await waitFor(() => {
        expect(screen.getByText('pikachu')).toBeInTheDocument();
        expect(screen.getByText(/electric/)).toBeInTheDocument();
      });
    });

    it('handles API error response correctly', async () => {
      vi.mocked(PokemonApi.getPokemonDetails).mockRejectedValue(
        new Error('Pokemon not found')
      );

      render(<Card pokemon={mockPokemon} />);

      await waitFor(() => {
        expect(screen.getByText('pikachu')).toBeInTheDocument();
        expect(
          screen.getByText('Error: Pokemon not found')
        ).toBeInTheDocument();
      });
    });

    it('handles network errors', async () => {
      vi.mocked(PokemonApi.getPokemonDetails).mockRejectedValue(
        new Error('Network error')
      );

      render(<Card pokemon={mockPokemon} />);

      await waitFor(() => {
        expect(screen.getByText('Error: Network error')).toBeInTheDocument();
      });
    });

    it('handles API call only once on mount', async () => {
      vi.mocked(PokemonApi.getPokemonDetails).mockResolvedValue(
        mockPokemonDetails
      );

      const { rerender } = render(<Card pokemon={mockPokemon} />);

      await waitFor(() => {
        expect(screen.getByText('pikachu')).toBeInTheDocument();
      });

      rerender(<Card pokemon={mockPokemon} />);

      expect(PokemonApi.getPokemonDetails).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error Handling Tests', () => {
    it('displays error message when API call fails', async () => {
      vi.mocked(PokemonApi.getPokemonDetails).mockRejectedValue(
        new Error('Service unavailable')
      );

      render(<Card pokemon={mockPokemon} />);

      await waitFor(() => {
        expect(
          screen.getByText(/Error: Service unavailable/)
        ).toBeInTheDocument();
      });
    });

    it('handles different types of errors gracefully', async () => {
      vi.mocked(PokemonApi.getPokemonDetails).mockRejectedValue('String error');

      render(<Card pokemon={mockPokemon} />);

      await waitFor(() => {
        expect(screen.getByText(/Error: Unknown error/)).toBeInTheDocument();
      });
    });

    it('shows loading state before error state', async () => {
      vi.mocked(PokemonApi.getPokemonDetails).mockRejectedValue(
        new Error('Failed to load')
      );

      render(<Card pokemon={mockPokemon} />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText(/Error: Failed to load/)).toBeInTheDocument();
      });
    });
  });

  describe('Click Handling', () => {
    it('calls onClick when provided and card is clicked', async () => {
      const mockOnClick = vi.fn();
      vi.mocked(PokemonApi.getPokemonDetails).mockResolvedValue(
        mockPokemonDetails
      );

      render(<Card pokemon={mockPokemon} onClick={mockOnClick} />);

      await waitFor(() => {
        expect(screen.getByText('pikachu')).toBeInTheDocument();
      });

      const card = screen.getByText('pikachu').closest('div');
      if (card) {
        card.click();
        expect(mockOnClick).toHaveBeenCalled();
      }
    });

    it('does not crash when no onClick is provided', async () => {
      vi.mocked(PokemonApi.getPokemonDetails).mockResolvedValue(
        mockPokemonDetails
      );

      render(<Card pokemon={mockPokemon} />);

      await waitFor(() => {
        expect(screen.getByText('pikachu')).toBeInTheDocument();
      });

      const card = screen.getByText('pikachu').closest('div');
      if (card) {
        expect(() => card.click()).not.toThrow();
      }
    });
  });
});
