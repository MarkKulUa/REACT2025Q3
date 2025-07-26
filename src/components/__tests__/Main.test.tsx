import { render, screen } from '../../__tests__/test-utils';
import Main from '../Main';
import type { Pokemon } from '../../types/pokemon';

// Mock CardList component
vi.mock('../CardList', () => ({
  default: ({
    pokemon,
    isLoading,
    error,
    onCardClick,
  }: {
    pokemon: Pokemon[];
    isLoading: boolean;
    error: string | null;
    onCardClick?: (pokemon: Pokemon) => void;
  }) => (
    <div data-testid="cardlist-mock">
      {isLoading && <div>CardList Loading</div>}
      {error && <div>CardList Error: {error}</div>}
      {!isLoading && !error && (
        <div>CardList with {pokemon.length} pokemon</div>
      )}
      {onCardClick && (
        <button onClick={() => onCardClick({ name: 'test', url: 'test' })}>
          Test Card Click
        </button>
      )}
    </div>
  ),
}));

describe('Main Component', () => {
  const mockOnCardClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering Tests', () => {
    it('renders CardList component with correct props', () => {
      const mockPokemon: Pokemon[] = [
        { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
        { name: 'charizard', url: 'https://pokeapi.co/api/v2/pokemon/6/' },
      ];

      render(
        <Main
          pokemon={mockPokemon}
          isLoading={false}
          error={null}
          onCardClick={mockOnCardClick}
        />
      );

      expect(screen.getByTestId('cardlist-mock')).toBeInTheDocument();
      expect(screen.getByText('CardList with 2 pokemon')).toBeInTheDocument();
    });

    it('passes loading state to CardList', () => {
      render(
        <Main
          pokemon={[]}
          isLoading={true}
          error={null}
          onCardClick={mockOnCardClick}
        />
      );

      expect(screen.getByText('CardList Loading')).toBeInTheDocument();
    });

    it('passes error state to CardList', () => {
      render(
        <Main
          pokemon={[]}
          isLoading={false}
          error="Test error message"
          onCardClick={mockOnCardClick}
        />
      );

      expect(
        screen.getByText('CardList Error: Test error message')
      ).toBeInTheDocument();
    });
  });

  describe('Card Click Handling', () => {
    it('passes onCardClick to CardList', () => {
      render(
        <Main
          pokemon={[]}
          isLoading={false}
          error={null}
          onCardClick={mockOnCardClick}
        />
      );

      const cardClickButton = screen.getByText('Test Card Click');
      cardClickButton.click();

      expect(mockOnCardClick).toHaveBeenCalledWith({
        name: 'test',
        url: 'test',
      });
    });

    it('works without onCardClick prop', () => {
      render(<Main pokemon={[]} isLoading={false} error={null} />);

      expect(screen.getByTestId('cardlist-mock')).toBeInTheDocument();
      expect(screen.queryByText('Test Card Click')).not.toBeInTheDocument();
    });
  });

  describe('Props Integration Tests', () => {
    it('passes all pokemon data correctly to CardList', () => {
      const mockPokemon: Pokemon[] = [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
        { name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon/3/' },
      ];

      render(
        <Main
          pokemon={mockPokemon}
          isLoading={false}
          error={null}
          onCardClick={mockOnCardClick}
        />
      );

      expect(screen.getByText('CardList with 3 pokemon')).toBeInTheDocument();
    });

    it('handles empty pokemon array', () => {
      render(
        <Main
          pokemon={[]}
          isLoading={false}
          error={null}
          onCardClick={mockOnCardClick}
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
          onCardClick={mockOnCardClick}
        />
      );

      expect(screen.getByText('CardList Loading')).toBeInTheDocument();

      rerender(
        <Main
          pokemon={[]}
          isLoading={false}
          error="Network error"
          onCardClick={mockOnCardClick}
        />
      );

      expect(
        screen.getByText('CardList Error: Network error')
      ).toBeInTheDocument();
    });
  });
});
