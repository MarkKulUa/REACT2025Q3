import { render, screen, fireEvent } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import Header from '../Header';

// Mock next-intl
vi.mock('next-intl', async () => {
  const actual = await vi.importActual('next-intl');
  return {
    ...actual,
    useTranslations: vi.fn(() => (key: string) => {
      const translations: Record<string, string> = {
        title: 'Pokémon Search',
        placeholder: 'Search Pokémon...',
        button: 'Search',
        loading: 'Loading...',
      };
      return translations[key] || key;
    }),
  };
});

// Mock ThemeSelector
vi.mock('../ThemeSelector', () => ({
  default: () => <div data-testid="theme-selector">Theme Selector</div>,
}));

// Mock LanguageSelector
vi.mock('../LanguageSelector', () => ({
  default: () => <div data-testid="language-selector">Language Selector</div>,
}));

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

const messages = {
  search: {
    title: 'Pokémon Search',
    placeholder: 'Search Pokémon...',
    button: 'Search',
    loading: 'Loading...',
  },
};

describe('Header Component', () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  const renderHeader = (isLoading = false, onRefresh?: () => void) => {
    return render(
      <NextIntlClientProvider messages={messages} locale="en">
        <Header
          onSearch={mockOnSearch}
          isLoading={isLoading}
          onRefresh={onRefresh}
        />
      </NextIntlClientProvider>
    );
  };

  describe('Rendering', () => {
    it('renders header with title', () => {
      renderHeader();

      expect(screen.getByText('Pokémon Search')).toBeInTheDocument();
    });

    it('renders search input with placeholder', () => {
      renderHeader();

      expect(
        screen.getByPlaceholderText('Search Pokémon...')
      ).toBeInTheDocument();
    });

    it('renders search button', () => {
      renderHeader();

      expect(
        screen.getByRole('button', { name: 'Search' })
      ).toBeInTheDocument();
    });

    it('renders theme selector', () => {
      renderHeader();

      expect(screen.getByTestId('theme-selector')).toBeInTheDocument();
    });

    it('renders language selector', () => {
      renderHeader();

      expect(screen.getByTestId('language-selector')).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('calls onSearch when search button is clicked', () => {
      renderHeader();

      const searchInput = screen.getByPlaceholderText('Search Pokémon...');
      const searchButton = screen.getByRole('button', { name: 'Search' });

      fireEvent.change(searchInput, { target: { value: 'pikachu' } });
      fireEvent.click(searchButton);

      expect(mockOnSearch).toHaveBeenCalledWith('pikachu');
    });

    it('calls onSearch when Enter key is pressed', () => {
      renderHeader();

      const searchInput = screen.getByPlaceholderText('Search Pokémon...');

      fireEvent.change(searchInput, { target: { value: 'charizard' } });
      fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });

      expect(mockOnSearch).toHaveBeenCalledWith('charizard');
    });

    it('trims search term before calling onSearch', () => {
      renderHeader();

      const searchInput = screen.getByPlaceholderText('Search Pokémon...');
      const searchButton = screen.getByRole('button', { name: 'Search' });

      fireEvent.change(searchInput, { target: { value: '  pikachu  ' } });
      fireEvent.click(searchButton);

      expect(mockOnSearch).toHaveBeenCalledWith('pikachu');
    });
  });

  describe('Loading State', () => {
    it('disables input and button when loading', () => {
      renderHeader(true);

      const searchInput = screen.getByPlaceholderText('Search Pokémon...');
      const searchButton = screen.getByRole('button', { name: 'Loading...' });

      expect(searchInput).toBeDisabled();
      expect(searchButton).toBeDisabled();
    });

    it('shows loading text on button when loading', () => {
      renderHeader(true);

      expect(
        screen.getByRole('button', { name: 'Loading...' })
      ).toBeInTheDocument();
    });
  });

  describe('Refresh Button', () => {
    it('renders refresh button when onRefresh is provided', () => {
      const mockOnRefresh = vi.fn();
      renderHeader(false, mockOnRefresh);

      expect(
        screen.getByRole('button', { name: 'Refresh results' })
      ).toBeInTheDocument();
    });

    it('does not render refresh button when onRefresh is not provided', () => {
      renderHeader();

      expect(
        screen.queryByRole('button', { name: 'Refresh results' })
      ).not.toBeInTheDocument();
    });

    it('calls onRefresh when refresh button is clicked', () => {
      const mockOnRefresh = vi.fn();
      renderHeader(false, mockOnRefresh);

      const refreshButton = screen.getByRole('button', {
        name: 'Refresh results',
      });
      fireEvent.click(refreshButton);

      expect(mockOnRefresh).toHaveBeenCalledTimes(1);
    });

    it('disables refresh button when loading', () => {
      const mockOnRefresh = vi.fn();
      renderHeader(true, mockOnRefresh);

      const refreshButton = screen.getByRole('button', {
        name: 'Refresh results',
      });
      expect(refreshButton).toBeDisabled();
    });
  });

  describe('Local Storage Integration', () => {
    it('loads initial search term from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('stored-pokemon');
      renderHeader();

      const searchInput = screen.getByPlaceholderText('Search Pokémon...');
      expect(searchInput).toHaveValue('stored-pokemon');
    });

    it('saves search term to localStorage when searching', () => {
      renderHeader();

      const searchInput = screen.getByPlaceholderText('Search Pokémon...');
      const searchButton = screen.getByRole('button', { name: 'Search' });

      fireEvent.change(searchInput, { target: { value: 'bulbasaur' } });
      fireEvent.click(searchButton);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'pokemon-search-term',
        'bulbasaur'
      );
    });
  });
});
