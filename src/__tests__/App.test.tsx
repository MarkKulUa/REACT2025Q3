import { render, screen } from './test-utils';
import App from '../App';

vi.mock('../pages/PokemonSearch', () => ({
  default: () => (
    <div data-testid="pokemon-search-page">Pokemon Search Page</div>
  ),
}));

vi.mock('../pages/About', () => ({
  default: () => <div data-testid="about-page">About Page</div>,
}));

vi.mock('../pages/NotFound', () => ({
  default: () => <div data-testid="not-found-page">404 Not Found Page</div>,
}));

vi.mock('../components/Layout', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout-mock">
      <nav data-testid="navigation">Mock Navigation</nav>
      <main data-testid="main-content">{children}</main>
    </div>
  ),
}));

vi.mock('../components/ErrorBoundary', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="error-boundary-mock">{children}</div>
  ),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    createBrowserRouter: vi.fn(() => ({
      routes: [],
    })),
    RouterProvider: () => (
      <div data-testid="router-provider-mock">
        <div data-testid="layout-mock">
          <nav data-testid="navigation">Mock Navigation</nav>
          <main data-testid="main-content">
            <div data-testid="pokemon-search-page">Pokemon Search Page</div>
          </main>
        </div>
      </div>
    ),
  };
});

describe('App Component with Routing', () => {
  describe('Route Rendering', () => {
    it('renders with router provider and error boundary', () => {
      render(<App />);

      expect(screen.getByTestId('error-boundary-mock')).toBeInTheDocument();
      expect(screen.getByTestId('router-provider-mock')).toBeInTheDocument();
    });

    it('includes basic app structure', () => {
      render(<App />);

      expect(screen.getByTestId('error-boundary-mock')).toBeInTheDocument();
      expect(screen.getByTestId('layout-mock')).toBeInTheDocument();
      expect(screen.getByTestId('navigation')).toBeInTheDocument();
      expect(screen.getByTestId('main-content')).toBeInTheDocument();
    });
  });

  describe('Error Boundary Integration', () => {
    it('wraps the entire app in ErrorBoundary', () => {
      render(<App />);

      expect(screen.getByTestId('error-boundary-mock')).toBeInTheDocument();

      const errorBoundary = screen.getByTestId('error-boundary-mock');
      expect(errorBoundary).toContainElement(
        screen.getByTestId('router-provider-mock')
      );
    });
  });

  describe('Router Integration', () => {
    it('uses RouterProvider for routing', () => {
      render(<App />);

      expect(screen.getByTestId('router-provider-mock')).toBeInTheDocument();
    });
  });
});
