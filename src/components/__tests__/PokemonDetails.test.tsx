import { render, screen, fireEvent } from '../../__tests__/test-utils';
import { MemoryRouter } from 'react-router-dom';
import PokemonDetails from '../PokemonDetails';

// Mock the usePokemonDetails hook
vi.mock('../../hooks/usePokemonDetails', () => ({
  usePokemonDetails: vi.fn(() => ({
    details: null,
    isLoading: false,
    error: null,
  })),
}));

// Mock react-router-dom hooks
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn(() => ({ pokemonName: 'pikachu' })),
    useNavigate: () => vi.fn(),
  };
});

describe('PokemonDetails Component', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<MemoryRouter>{component}</MemoryRouter>);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders the component', () => {
      renderWithRouter(<PokemonDetails />);
      expect(screen.getByText('✕ Close')).toBeInTheDocument();
    });

    it('displays close button', () => {
      renderWithRouter(<PokemonDetails />);
      const closeButton = screen.getByText('✕ Close');
      expect(closeButton).toBeInTheDocument();
    });
  });

  describe('Close Functionality', () => {
    it('close button is clickable', () => {
      renderWithRouter(<PokemonDetails />);
      const closeButton = screen.getByText('✕ Close');
      expect(closeButton).toBeInTheDocument();

      // Just check that close button exists and is clickable
      fireEvent.click(closeButton);
    });
  });

  describe('Accessibility', () => {
    it('has accessible button text', () => {
      renderWithRouter(<PokemonDetails />);
      expect(
        screen.getByRole('button', { name: /close/i })
      ).toBeInTheDocument();
    });
  });
});
