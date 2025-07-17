import { render, screen, fireEvent } from '../../__tests__/test-utils';
import Main from '../Main';
import { mockPokemonResponse } from '../../__tests__/mocks/pokemonApi';
import type { Pokemon } from '../../types/pokemon';

// Mock CardList component to isolate Main component testing
vi.mock('../CardList', () => ({
  default: ({
    pokemon,
    isLoading,
    error,
  }: {
    pokemon: Pokemon[];
    isLoading: boolean;
    error: string | null;
  }) => (
    <div data-testid="cardlist-mock">
      {isLoading && <div>CardList Loading</div>}
      {error && <div>CardList Error: {error}</div>}
      {!isLoading && !error && (
        <div>CardList with {pokemon.length} pokemon</div>
      )}
    </div>
  ),
}));

describe('Main Component', () => {
  const mockOnError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering Tests', () => {
    it('renders CardList component with correct props', () => {
      const pokemon = mockPokemonResponse.results;

      render(
        <Main
          pokemon={pokemon}
          isLoading={false}
          error={null}
          onError={mockOnError}
        />
      );

      expect(screen.getByTestId('cardlist-mock')).toBeInTheDocument();
      expect(
        screen.getByText(`CardList with ${pokemon.length} pokemon`)
      ).toBeInTheDocument();
    });

    it('renders test error button', () => {
      render(
        <Main
          pokemon={[]}
          isLoading={false}
          error={null}
          onError={mockOnError}
        />
      );

      expect(
        screen.getByRole('button', { name: /test error/i })
      ).toBeInTheDocument();
    });

    it('passes loading state to CardList', () => {
      render(
        <Main
          pokemon={[]}
          isLoading={true}
          error={null}
          onError={mockOnError}
        />
      );

      expect(screen.getByText('CardList Loading')).toBeInTheDocument();
    });

    it('passes error state to CardList', () => {
      const errorMessage = 'Test error message';

      render(
        <Main
          pokemon={[]}
          isLoading={false}
          error={errorMessage}
          onError={mockOnError}
        />
      );

      expect(
        screen.getByText(`CardList Error: ${errorMessage}`)
      ).toBeInTheDocument();
    });
  });

  describe('Error Button Tests', () => {
    it('calls onError when test error button is clicked', () => {
      render(
        <Main
          pokemon={[]}
          isLoading={false}
          error={null}
          onError={mockOnError}
        />
      );

      const errorButton = screen.getByRole('button', { name: /test error/i });
      fireEvent.click(errorButton);

      expect(mockOnError).toHaveBeenCalledTimes(1);
      expect(mockOnError).toHaveBeenCalledWith(expect.any(Error));

      const calledError = mockOnError.mock.calls[0][0] as Error;
      expect(calledError.message).toBe('Test error for ErrorBoundary!');
    });

    it('creates new Error instance on each click', () => {
      render(
        <Main
          pokemon={[]}
          isLoading={false}
          error={null}
          onError={mockOnError}
        />
      );

      const errorButton = screen.getByRole('button', { name: /test error/i });

      fireEvent.click(errorButton);
      fireEvent.click(errorButton);

      expect(mockOnError).toHaveBeenCalledTimes(2);

      const firstError = mockOnError.mock.calls[0][0] as Error;
      const secondError = mockOnError.mock.calls[1][0] as Error;

      expect(firstError).not.toBe(secondError); // Different instances
      expect(firstError.message).toBe(secondError.message); // Same message
    });

    it('triggers error even when component has existing error', () => {
      render(
        <Main
          pokemon={[]}
          isLoading={false}
          error="Existing error"
          onError={mockOnError}
        />
      );

      const errorButton = screen.getByRole('button', { name: /test error/i });
      fireEvent.click(errorButton);

      expect(mockOnError).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('Props Integration Tests', () => {
    it('passes all pokemon data correctly to CardList', () => {
      const pokemon = [
        { name: 'pikachu', url: 'https://example.com/25' },
        { name: 'charizard', url: 'https://example.com/6' },
      ];

      render(
        <Main
          pokemon={pokemon}
          isLoading={false}
          error={null}
          onError={mockOnError}
        />
      );

      expect(
        screen.getByText(`CardList with ${pokemon.length} pokemon`)
      ).toBeInTheDocument();
    });

    it('handles empty pokemon array', () => {
      render(
        <Main
          pokemon={[]}
          isLoading={false}
          error={null}
          onError={mockOnError}
        />
      );

      expect(screen.getByText('CardList with 0 pokemon')).toBeInTheDocument();
    });

    it('correctly manages multiple state combinations', () => {
      const { rerender } = render(
        <Main
          pokemon={[]}
          isLoading={true}
          error={null}
          onError={mockOnError}
        />
      );

      expect(screen.getByText('CardList Loading')).toBeInTheDocument();

      // Change to error state
      rerender(
        <Main
          pokemon={[]}
          isLoading={false}
          error="API Error"
          onError={mockOnError}
        />
      );

      expect(screen.getByText('CardList Error: API Error')).toBeInTheDocument();
      expect(screen.queryByText('CardList Loading')).not.toBeInTheDocument();

      // Change to success state
      const pokemon = mockPokemonResponse.results;
      rerender(
        <Main
          pokemon={pokemon}
          isLoading={false}
          error={null}
          onError={mockOnError}
        />
      );

      expect(
        screen.getByText(`CardList with ${pokemon.length} pokemon`)
      ).toBeInTheDocument();
      expect(screen.queryByText(/CardList Error/)).not.toBeInTheDocument();
    });
  });
});
