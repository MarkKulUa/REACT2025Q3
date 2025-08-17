import { render, screen, fireEvent } from '@testing-library/react';
import PokemonDetails from '../PokemonDetails';

vi.mock('../../hooks/usePokemonDetails', () => ({
  usePokemonDetails: vi.fn(() => ({
    details: null,
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  })),
}));

const mockOnClose = vi.fn();

describe('PokemonDetails Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderPokemonDetails = (
    pokemonName = 'pikachu',
    onClose = mockOnClose
  ) => {
    return render(
      <PokemonDetails pokemonName={pokemonName} onClose={onClose} />
    );
  };

  describe('Loading State', () => {
    it('displays loading state when data is being fetched', async () => {
      const { usePokemonDetails } = await import(
        '../../hooks/usePokemonDetails'
      );
      vi.mocked(usePokemonDetails).mockReturnValue({
        details: null,
        isLoading: true,
        error: null,
        refetch: vi.fn(),
      });

      renderPokemonDetails();

      expect(
        screen.getByText('Loading Pokemon details...')
      ).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('displays error message when there is an error', async () => {
      const { usePokemonDetails } = await import(
        '../../hooks/usePokemonDetails'
      );
      vi.mocked(usePokemonDetails).mockReturnValue({
        details: null,
        isLoading: false,
        error: 'Network error',
        refetch: vi.fn(),
      });

      renderPokemonDetails();

      expect(
        screen.getByText('Error loading Pokemon details')
      ).toBeInTheDocument();
      expect(screen.getByText('Network error')).toBeInTheDocument();
      expect(screen.getByText('↻ Refresh')).toBeInTheDocument();
    });

    it('calls refetch when refresh button is clicked', async () => {
      const mockRefetch = vi.fn();
      const { usePokemonDetails } = await import(
        '../../hooks/usePokemonDetails'
      );
      vi.mocked(usePokemonDetails).mockReturnValue({
        details: null,
        isLoading: false,
        error: 'Network error',
        refetch: mockRefetch,
      });

      renderPokemonDetails();

      const refreshButton = screen.getByText('↻ Refresh');
      fireEvent.click(refreshButton);

      expect(mockRefetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Success State', () => {
    const mockPokemonDetails = {
      id: 25,
      name: 'pikachu',
      height: 4,
      weight: 60,
      sprites: {
        front_default: 'https://example.com/pikachu.png',
      },
      types: [
        {
          type: {
            name: 'electric',
          },
        },
      ],
    };

    it('displays pokemon details when data is loaded', async () => {
      const { usePokemonDetails } = await import(
        '../../hooks/usePokemonDetails'
      );
      vi.mocked(usePokemonDetails).mockReturnValue({
        details: mockPokemonDetails,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      renderPokemonDetails();

      expect(screen.getByText('pikachu')).toBeInTheDocument();
      expect(screen.getByText('#25')).toBeInTheDocument();
      expect(screen.getByText('0.4m')).toBeInTheDocument();
      expect(screen.getByText('6kg')).toBeInTheDocument();
      expect(screen.getByText('electric')).toBeInTheDocument();
    });

    it('displays pokemon image when available', async () => {
      const { usePokemonDetails } = await import(
        '../../hooks/usePokemonDetails'
      );
      vi.mocked(usePokemonDetails).mockReturnValue({
        details: mockPokemonDetails,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      renderPokemonDetails();

      const image = screen.getByAltText('pikachu');
      expect(image).toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', async () => {
      const { usePokemonDetails } = await import(
        '../../hooks/usePokemonDetails'
      );
      vi.mocked(usePokemonDetails).mockReturnValue({
        details: mockPokemonDetails,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      renderPokemonDetails();

      const closeButton = screen.getByText('✕ Close');
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('No Data State', () => {
    it('renders not found message when no details and not loading', async () => {
      const { usePokemonDetails } = await import(
        '../../hooks/usePokemonDetails'
      );
      vi.mocked(usePokemonDetails).mockReturnValue({
        details: null,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      renderPokemonDetails();

      expect(screen.getByText('Pokemon not found')).toBeInTheDocument();
      expect(
        screen.getByText('No details available for this Pokemon.')
      ).toBeInTheDocument();
    });
  });
});
