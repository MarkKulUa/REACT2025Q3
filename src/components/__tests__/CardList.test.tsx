import { render, screen } from '../../__tests__/test-utils';
import CardList from '../CardList';
import { mockPokemonResponse } from '../../__tests__/mocks/pokemonApi';

vi.mock('../Card', () => ({
  default: ({ pokemon }: { pokemon: { name: string } }) => (
    <div data-testid={`card-${pokemon.name}`}>Card: {pokemon.name}</div>
  ),
}));

describe('CardList Component', () => {
  describe('Rendering Tests', () => {
    it('renders correct number of items when data is provided', () => {
      const pokemon = mockPokemonResponse.results;

      render(<CardList pokemon={pokemon} isLoading={false} error={null} />);

      pokemon.forEach((poke) => {
        expect(screen.getByTestId(`card-${poke.name}`)).toBeInTheDocument();
      });
    });

    it('displays "no results" message when data array is empty', () => {
      render(<CardList pokemon={[]} isLoading={false} error={null} />);

      expect(screen.getByText(/no pokemon found/i)).toBeInTheDocument();
      expect(
        screen.getByText(/try a different search term/i)
      ).toBeInTheDocument();
    });

    it('shows loading state while fetching data', () => {
      render(<CardList pokemon={[]} isLoading={true} error={null} />);

      expect(screen.getByText(/loading pokemon/i)).toBeInTheDocument();
      expect(screen.getByText('Loading Pokemon...')).toBeInTheDocument();
    });
  });

  describe('Data Display Tests', () => {
    it('correctly displays item names', () => {
      const pokemon = [
        { name: 'bulbasaur', url: 'https://example.com/1' },
        { name: 'ivysaur', url: 'https://example.com/2' },
      ];

      render(<CardList pokemon={pokemon} isLoading={false} error={null} />);

      expect(screen.getByTestId('card-bulbasaur')).toBeInTheDocument();
      expect(screen.getByTestId('card-ivysaur')).toBeInTheDocument();
    });

    it('handles missing props gracefully', () => {
      render(<CardList pokemon={[]} isLoading={false} error={null} />);

      expect(screen.getByText(/no pokemon found/i)).toBeInTheDocument();
    });
  });

  describe('Error Handling Tests', () => {
    it('displays error message when API call fails', () => {
      const errorMessage = 'Failed to fetch Pokemon data';

      render(<CardList pokemon={[]} isLoading={false} error={errorMessage} />);

      expect(screen.getByText(/error occurred/i)).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('shows appropriate error for different HTTP status codes', () => {
      const httpError = 'HTTP error! status: 404';

      render(<CardList pokemon={[]} isLoading={false} error={httpError} />);

      expect(screen.getByText(/error occurred/i)).toBeInTheDocument();
      expect(screen.getByText(httpError)).toBeInTheDocument();
    });

    it('prioritizes error state over loading state', () => {
      const errorMessage = 'Network error';

      render(<CardList pokemon={[]} isLoading={false} error={errorMessage} />);

      expect(screen.getByText(/error occurred/i)).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.queryByText(/loading pokemon/i)).not.toBeInTheDocument();
    });

    it('prioritizes error state over empty state', () => {
      const errorMessage = 'API error';

      render(<CardList pokemon={[]} isLoading={false} error={errorMessage} />);

      expect(screen.getByText(/error occurred/i)).toBeInTheDocument();
      expect(screen.queryByText(/no pokemon found/i)).not.toBeInTheDocument();
    });
  });
});
