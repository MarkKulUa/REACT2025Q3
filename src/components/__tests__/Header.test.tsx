import { render, screen, fireEvent, waitFor } from '../../__tests__/test-utils';
import Header from '../Header';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Header Component', () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('Rendering Tests', () => {
    it('renders search input and search button', () => {
      render(<Header onSearch={mockOnSearch} isLoading={false} />);

      expect(
        screen.getByPlaceholderText(/search pokemon/i)
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /search/i })
      ).toBeInTheDocument();
    });

    it('displays previously saved search term from localStorage on mount', () => {
      const savedTerm = 'pikachu';
      localStorageMock.getItem.mockReturnValue(savedTerm);

      render(<Header onSearch={mockOnSearch} isLoading={false} />);

      expect(screen.getByDisplayValue(savedTerm)).toBeInTheDocument();
    });

    it('shows empty input when no saved term exists', () => {
      localStorageMock.getItem.mockReturnValue(null);

      render(<Header onSearch={mockOnSearch} isLoading={false} />);

      const input = screen.getByPlaceholderText(/search pokemon/i);
      expect(input).toHaveValue('');
    });
  });

  describe('User Interaction Tests', () => {
    it('updates input value when user types', () => {
      render(<Header onSearch={mockOnSearch} isLoading={false} />);

      const input = screen.getByPlaceholderText(/search pokemon/i);
      fireEvent.change(input, { target: { value: 'bulbasaur' } });

      expect(input).toHaveValue('bulbasaur');
    });

    it('saves search term to localStorage when search button is clicked', () => {
      render(<Header onSearch={mockOnSearch} isLoading={false} />);

      const input = screen.getByPlaceholderText(/search pokemon/i);
      const searchButton = screen.getByRole('button', { name: /search/i });

      fireEvent.change(input, { target: { value: 'charizard' } });
      fireEvent.click(searchButton);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'pokemon-search-term',
        'charizard'
      );
    });

    it('trims whitespace from search input before saving', () => {
      render(<Header onSearch={mockOnSearch} isLoading={false} />);

      const input = screen.getByPlaceholderText(/search pokemon/i);
      const searchButton = screen.getByRole('button', { name: /search/i });

      fireEvent.change(input, { target: { value: '  pikachu  ' } });
      fireEvent.click(searchButton);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'pokemon-search-term',
        'pikachu'
      );
    });

    it('triggers search callback with correct parameters', () => {
      render(<Header onSearch={mockOnSearch} isLoading={false} />);

      const input = screen.getByPlaceholderText(/search pokemon/i);
      const searchButton = screen.getByRole('button', { name: /search/i });

      fireEvent.change(input, { target: { value: 'squirtle' } });
      fireEvent.click(searchButton);

      expect(mockOnSearch).toHaveBeenCalledWith('squirtle');
    });
  });

  describe('LocalStorage Integration', () => {
    it('retrieves saved search term on component mount', () => {
      const savedTerm = 'mewtwo';
      localStorageMock.getItem.mockReturnValue(savedTerm);

      render(<Header onSearch={mockOnSearch} isLoading={false} />);

      expect(localStorageMock.getItem).toHaveBeenCalledWith(
        'pokemon-search-term'
      );
    });

    it('triggers initial search with saved term on mount', async () => {
      const savedTerm = 'mew';
      localStorageMock.getItem.mockReturnValue(savedTerm);

      render(<Header onSearch={mockOnSearch} isLoading={false} />);

      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledWith(savedTerm);
      });
    });

    it('overwrites existing localStorage value when new search is performed', () => {
      localStorageMock.getItem.mockReturnValue('old-search');

      render(<Header onSearch={mockOnSearch} isLoading={false} />);

      const input = screen.getByPlaceholderText(/search pokemon/i);
      const searchButton = screen.getByRole('button', { name: /search/i });

      fireEvent.change(input, { target: { value: 'new-search' } });
      fireEvent.click(searchButton);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'pokemon-search-term',
        'new-search'
      );
    });
  });
});
