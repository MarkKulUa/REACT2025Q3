import { render, screen, fireEvent, waitFor } from './test-utils';
import { act } from '@testing-library/react';
import App from '../App';
import { PokemonApi } from '../services/pokemonApi';
import type { PokemonResponse, Pokemon } from '../types/pokemon';
import { mockPokemonResponse, mockEmptyResults } from './mocks/pokemonApi';

// Mock the PokemonApi
vi.mock('../services/pokemonApi', () => ({
  PokemonApi: {
    searchPokemon: vi.fn(),
  },
}));

// Mock child components to isolate App testing
vi.mock('../components/Header', () => ({
  default: ({
    onSearch,
    isLoading,
  }: {
    onSearch: (term: string) => void;
    isLoading: boolean;
  }) => (
    <div data-testid="header-mock">
      <input
        data-testid="search-input"
        placeholder="Search Pokemon"
        onChange={() => {
          // Trigger search on Enter or button click simulation
        }}
      />
      <button
        data-testid="search-button"
        disabled={isLoading}
        onClick={() => onSearch('test-search')}
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </div>
  ),
}));

vi.mock('../components/Main', () => ({
  default: ({
    pokemon,
    isLoading,
    error,
    onError,
  }: {
    pokemon: Pokemon[];
    isLoading: boolean;
    error: string | null;
    onError: (error: Error | string) => void;
  }) => (
    <div data-testid="main-mock">
      {isLoading && <div>Main Loading</div>}
      {error && <div>Main Error: {error}</div>}
      {!isLoading && <div>Main with {pokemon.length} pokemon</div>}
      <button
        data-testid="trigger-error"
        onClick={() => onError('Test error from Main')}
      >
        Trigger Error
      </button>
      <button
        data-testid="trigger-error-object"
        onClick={() => onError(new Error('Error object from Main'))}
      >
        Trigger Error Object
      </button>
    </div>
  ),
}));

vi.mock('../components/ErrorBoundary', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="error-boundary-mock">{children}</div>
  ),
}));

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('renders with initial state correctly', () => {
      render(<App />);

      expect(screen.getByTestId('error-boundary-mock')).toBeInTheDocument();
      expect(screen.getByTestId('header-mock')).toBeInTheDocument();
      expect(screen.getByTestId('main-mock')).toBeInTheDocument();

      // Initial state: no loading, no error, empty pokemon list
      expect(screen.getByText('Main with 0 pokemon')).toBeInTheDocument();
      expect(screen.getByText('Search')).toBeInTheDocument(); // Not "Searching..."
      expect(screen.queryByText(/Main Error/)).not.toBeInTheDocument();
    });

    it('has correct initial state values', () => {
      render(<App />);

      // Check that search button is not disabled (not loading)
      const searchButton = screen.getByTestId('search-button');
      expect(searchButton).not.toBeDisabled();

      // Check that Main shows 0 pokemon (empty initial state)
      expect(screen.getByText('Main with 0 pokemon')).toBeInTheDocument();
    });
  });

  describe('handleSearch - Success Cases', () => {
    it('handles successful search correctly', async () => {
      vi.mocked(PokemonApi.searchPokemon).mockResolvedValue(
        mockPokemonResponse
      );

      render(<App />);

      const searchButton = screen.getByTestId('search-button');

      // Trigger search
      await act(async () => {
        fireEvent.click(searchButton);
      });

      // Check API was called
      expect(PokemonApi.searchPokemon).toHaveBeenCalledWith('test-search', 20);

      // Wait for state updates
      await waitFor(() => {
        expect(screen.getByText('Main with 20 pokemon')).toBeInTheDocument();
      });

      // Ensure loading state is finished and no errors
      expect(screen.getByText('Search')).toBeInTheDocument(); // Not "Searching..."
      expect(screen.queryByText(/Main Error/)).not.toBeInTheDocument();
    });

    it('shows loading state during search', async () => {
      // Create a promise that we can control
      let resolveSearch: (value: PokemonResponse) => void = () => {};
      const searchPromise = new Promise<PokemonResponse>((resolve) => {
        resolveSearch = resolve;
      });

      vi.mocked(PokemonApi.searchPokemon).mockReturnValue(searchPromise);

      render(<App />);

      const searchButton = screen.getByTestId('search-button');

      // Start search
      fireEvent.click(searchButton);

      // Check loading state
      await waitFor(() => {
        expect(screen.getByText('Searching...')).toBeInTheDocument();
        expect(screen.getByText('Main Loading')).toBeInTheDocument();
        expect(searchButton).toBeDisabled();
      });

      // Complete the search
      await act(async () => {
        resolveSearch(mockPokemonResponse);
      });

      // Check final state
      await waitFor(() => {
        expect(screen.getByText('Search')).toBeInTheDocument();
        expect(screen.getByText('Main with 20 pokemon')).toBeInTheDocument();
      });
    });

    it('handles empty search results', async () => {
      vi.mocked(PokemonApi.searchPokemon).mockResolvedValue(mockEmptyResults);

      render(<App />);

      const searchButton = screen.getByTestId('search-button');

      await act(async () => {
        fireEvent.click(searchButton);
      });

      await waitFor(() => {
        expect(screen.getByText('Main with 0 pokemon')).toBeInTheDocument();
      });

      expect(screen.queryByText(/Main Error/)).not.toBeInTheDocument();
    });

    it('clears previous errors on successful search', async () => {
      // First, trigger an error
      vi.mocked(PokemonApi.searchPokemon).mockRejectedValueOnce(
        new Error('First error')
      );

      render(<App />);

      const searchButton = screen.getByTestId('search-button');

      // Trigger error
      await act(async () => {
        fireEvent.click(searchButton);
      });

      await waitFor(() => {
        expect(screen.getByText('Main Error: First error')).toBeInTheDocument();
      });

      // Now make a successful search
      vi.mocked(PokemonApi.searchPokemon).mockResolvedValue(
        mockPokemonResponse
      );

      await act(async () => {
        fireEvent.click(searchButton);
      });

      // Error should be cleared
      await waitFor(() => {
        expect(screen.queryByText(/Main Error/)).not.toBeInTheDocument();
        expect(screen.getByText('Main with 20 pokemon')).toBeInTheDocument();
      });
    });
  });

  describe('handleSearch - Error Cases', () => {
    it('handles API errors correctly', async () => {
      const errorMessage = 'Failed to fetch pokemon';
      vi.mocked(PokemonApi.searchPokemon).mockRejectedValue(
        new Error(errorMessage)
      );

      render(<App />);

      const searchButton = screen.getByTestId('search-button');

      await act(async () => {
        fireEvent.click(searchButton);
      });

      await waitFor(() => {
        expect(
          screen.getByText(`Main Error: ${errorMessage}`)
        ).toBeInTheDocument();
      });

      // Check that pokemon list is cleared and loading is finished
      expect(screen.getByText('Main with 0 pokemon')).toBeInTheDocument();
      expect(screen.getByText('Search')).toBeInTheDocument(); // Not loading
    });

    it('handles unknown errors correctly', async () => {
      vi.mocked(PokemonApi.searchPokemon).mockRejectedValue('String error');

      render(<App />);

      const searchButton = screen.getByTestId('search-button');

      await act(async () => {
        fireEvent.click(searchButton);
      });

      await waitFor(() => {
        expect(
          screen.getByText('Main Error: Unknown error occurred')
        ).toBeInTheDocument();
      });
    });

    it('handles network errors', async () => {
      vi.mocked(PokemonApi.searchPokemon).mockRejectedValue(
        new Error('Network error')
      );

      render(<App />);

      const searchButton = screen.getByTestId('search-button');

      await act(async () => {
        fireEvent.click(searchButton);
      });

      await waitFor(() => {
        expect(
          screen.getByText('Main Error: Network error')
        ).toBeInTheDocument();
      });
    });
  });

  describe('handleError Method', () => {
    it('handles error from Main component', async () => {
      render(<App />);

      const triggerErrorButton = screen.getByTestId('trigger-error');

      await act(async () => {
        fireEvent.click(triggerErrorButton);
      });

      expect(
        screen.getByText('Main Error: Test error from Main')
      ).toBeInTheDocument();
    });

    it('handles Error object from Main component', async () => {
      render(<App />);

      const triggerErrorButton = screen.getByTestId('trigger-error-object');

      await act(async () => {
        fireEvent.click(triggerErrorButton);
      });

      expect(
        screen.getByText('Main Error: Error object from Main')
      ).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('passes correct props to Header component', () => {
      render(<App />);

      // Header should receive isLoading=false initially
      expect(screen.getByText('Search')).toBeInTheDocument(); // Not "Searching..."

      const searchButton = screen.getByTestId('search-button');
      expect(searchButton).not.toBeDisabled();
    });

    it('passes correct props to Main component', () => {
      render(<App />);

      // Main should receive empty pokemon array, no loading, no error initially
      expect(screen.getByText('Main with 0 pokemon')).toBeInTheDocument();
      expect(screen.queryByText('Main Loading')).not.toBeInTheDocument();
      expect(screen.queryByText(/Main Error/)).not.toBeInTheDocument();
    });

    it('updates Header loading state during search', async () => {
      let resolveSearch: (value: PokemonResponse) => void = () => {};
      const searchPromise = new Promise<PokemonResponse>((resolve) => {
        resolveSearch = resolve;
      });

      vi.mocked(PokemonApi.searchPokemon).mockReturnValue(searchPromise);

      render(<App />);

      const searchButton = screen.getByTestId('search-button');

      // Start search
      fireEvent.click(searchButton);

      // Header should show loading state
      await waitFor(() => {
        expect(screen.getByText('Searching...')).toBeInTheDocument();
        expect(searchButton).toBeDisabled();
      });

      // Complete search
      await act(async () => {
        resolveSearch(mockPokemonResponse);
      });

      // Header should return to normal state
      await waitFor(() => {
        expect(screen.getByText('Search')).toBeInTheDocument();
        expect(searchButton).not.toBeDisabled();
      });
    });
  });

  describe('ErrorBoundary Integration', () => {
    it('wraps the app in ErrorBoundary', () => {
      render(<App />);

      expect(screen.getByTestId('error-boundary-mock')).toBeInTheDocument();

      // Check that app content is inside ErrorBoundary
      const errorBoundary = screen.getByTestId('error-boundary-mock');
      expect(errorBoundary).toContainElement(screen.getByTestId('header-mock'));
      expect(errorBoundary).toContainElement(screen.getByTestId('main-mock'));
    });
  });
});
