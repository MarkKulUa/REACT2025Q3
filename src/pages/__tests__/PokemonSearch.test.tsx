import { render, screen, fireEvent } from '../../__tests__/test-utils';
import { MemoryRouter } from 'react-router-dom';
import PokemonSearch from '../PokemonSearch';
import type { Pokemon } from '../../types/pokemon';

vi.mock('../../hooks/usePokemon', () => ({
  usePokemon: vi.fn(() => ({
    pokemon: [],
    isLoading: false,
    error: null,
    searchPokemon: vi.fn(),
    totalCount: 0,
  })),
}));

vi.mock('../../hooks/useLocalStorage', () => ({
  useLocalStorage: vi.fn(() => ['', vi.fn()]),
}));

vi.mock('../../components/Header', () => ({
  default: ({
    onSearch,
    isLoading,
  }: {
    onSearch: (term: string) => void;
    isLoading: boolean;
  }) => (
    <div data-testid="header-mock">
      <input data-testid="search-input" />
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

vi.mock('../../components/Main', () => ({
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
    <div data-testid="main-mock">
      {isLoading && <div>Main Loading</div>}
      {error && <div>Main Error: {error}</div>}
      {!isLoading && !error && <div>Main with {pokemon.length} pokemon</div>}
      {onCardClick && (
        <button
          data-testid="card-click-button"
          onClick={() => onCardClick({ name: 'test-pokemon', url: 'test-url' })}
        >
          Click Pokemon
        </button>
      )}
    </div>
  ),
}));

vi.mock('../../components/Pagination', () => ({
  default: ({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange,
  }: {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
  }) => (
    <div data-testid="pagination-mock">
      <span>
        Page {currentPage} of {Math.ceil(totalItems / itemsPerPage)}
      </span>
      <button onClick={() => onPageChange(currentPage + 1)}>Next Page</button>
    </div>
  ),
}));

// Mock react-router-dom hooks
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({}),
    useSearchParams: () => [new URLSearchParams(), vi.fn()],
    Outlet: () => <div data-testid="outlet-mock">Outlet Content</div>,
  };
});

describe('PokemonSearch Component', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<MemoryRouter>{component}</MemoryRouter>, {
      needsRouter: false,
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering Tests', () => {
    it('renders header component', () => {
      renderWithRouter(<PokemonSearch />);
      expect(screen.getByTestId('header-mock')).toBeInTheDocument();
    });

    it('renders main component', () => {
      renderWithRouter(<PokemonSearch />);
      expect(screen.getByTestId('main-mock')).toBeInTheDocument();
    });

    it('renders outlet for nested routes', () => {
      renderWithRouter(<PokemonSearch />);
      expect(screen.getByTestId('outlet-mock')).toBeInTheDocument();
    });
  });

  describe('Layout Structure', () => {
    it('has proper container structure', () => {
      renderWithRouter(<PokemonSearch />);
      expect(screen.getByTestId('header-mock')).toBeInTheDocument();
      expect(screen.getByTestId('main-mock')).toBeInTheDocument();
      expect(screen.getByTestId('outlet-mock')).toBeInTheDocument();
    });

    it('maintains proper component hierarchy', () => {
      renderWithRouter(<PokemonSearch />);
      expect(screen.getByTestId('header-mock')).toBeInTheDocument();
      expect(screen.getByTestId('main-mock')).toBeInTheDocument();
      expect(screen.getByTestId('outlet-mock')).toBeInTheDocument();
    });
  });

  describe('Click Outside Functionality', () => {
    it('closes PokemonDetails when clicking outside', () => {
      renderWithRouter(<PokemonSearch />);

      const detailsSection = screen.getByTestId('outlet-mock').parentElement;
      expect(detailsSection).toBeInTheDocument();

      if (detailsSection) {
        fireEvent.click(detailsSection);
      }

      expect(mockNavigate).toHaveBeenCalledWith('', { replace: true });
    });
  });
});
