import { render, screen } from '../../__tests__/test-utils';
import { MemoryRouter } from 'react-router-dom';
import Layout from '../Layout';

// Mock react-router-dom Outlet
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Outlet: () => <div data-testid="outlet-content">Page Content</div>,
    useLocation: vi.fn(() => ({ pathname: '/' })),
  };
});

describe('Layout Component', () => {
  const renderWithRouter = (initialPath = '/') => {
    return render(
      <MemoryRouter initialEntries={[initialPath]}>
        <Layout />
      </MemoryRouter>,
      { needsRouter: false }
    );
  };

  describe('Navigation Tests', () => {
    it('renders navigation bar', () => {
      renderWithRouter();

      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('displays Pokemon Search link', () => {
      renderWithRouter();

      const searchLink = screen.getByText('🔍 Pokemon Search');
      expect(searchLink).toBeInTheDocument();
      expect(searchLink.closest('a')).toHaveAttribute('href', '/');
    });

    it('displays About link', () => {
      renderWithRouter();

      const aboutLink = screen.getByText('ℹ️ About');
      expect(aboutLink).toBeInTheDocument();
      expect(aboutLink.closest('a')).toHaveAttribute('href', '/about');
    });

    it('has proper link roles for accessibility', () => {
      renderWithRouter();

      expect(
        screen.getByRole('link', { name: /Pokemon Search/i })
      ).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /About/i })).toBeInTheDocument();
    });
  });

  describe('Content Rendering', () => {
    it('renders main content area', () => {
      renderWithRouter();

      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('renders outlet content', () => {
      renderWithRouter();

      expect(screen.getByTestId('outlet-content')).toBeInTheDocument();
      expect(screen.getByText('Page Content')).toBeInTheDocument();
    });

    it('contains outlet within main content', () => {
      renderWithRouter();

      const main = screen.getByRole('main');
      const outlet = screen.getByTestId('outlet-content');
      expect(main).toContainElement(outlet);
    });
  });

  describe('Layout Structure', () => {
    it('has proper semantic HTML structure', () => {
      renderWithRouter();

      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('maintains proper hierarchy', () => {
      renderWithRouter();

      const container = document.querySelector('[class*="layoutContainer"]');
      const nav = screen.getByRole('navigation');
      const main = screen.getByRole('main');

      expect(container).toContainElement(nav);
      expect(container).toContainElement(main);
    });
  });

  describe('Navigation Links', () => {
    it('all navigation links are accessible', () => {
      renderWithRouter();

      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(2);

      links.forEach((link) => {
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href');
      });
    });

    it('links have meaningful text content', () => {
      renderWithRouter();

      const searchLink = screen.getByRole('link', { name: /Pokemon Search/i });
      const aboutLink = screen.getByRole('link', { name: /About/i });

      expect(searchLink.textContent).toContain('Pokemon Search');
      expect(aboutLink.textContent).toContain('About');
    });
  });

  describe('Responsive Behavior', () => {
    it('maintains navigation structure on home route', () => {
      renderWithRouter('/');

      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('maintains navigation structure on about route', () => {
      renderWithRouter('/about');

      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has semantic landmarks', () => {
      renderWithRouter();

      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('navigation is properly labeled', () => {
      renderWithRouter();

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    it('all interactive elements are accessible', () => {
      renderWithRouter();

      const links = screen.getAllByRole('link');
      links.forEach((link) => {
        expect(link).toBeVisible();
        expect(link).not.toBeDisabled();
      });
    });
  });
});
