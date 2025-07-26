import { render, screen } from '../../__tests__/test-utils';
import { MemoryRouter } from 'react-router-dom';
import NotFound from '../NotFound';

describe('NotFound Component', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<MemoryRouter>{component}</MemoryRouter>);
  };

  describe('Rendering Tests', () => {
    it('displays the 404 error code', () => {
      renderWithRouter(<NotFound />);

      expect(screen.getByText('404')).toBeInTheDocument();
    });

    it('displays the page not found title', () => {
      renderWithRouter(<NotFound />);

      expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    });

    it('displays the error message', () => {
      renderWithRouter(<NotFound />);

      expect(
        screen.getByText(/Oops! The page you're looking for doesn't exist/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          /It might have been moved, deleted, or you entered the wrong URL/
        )
      ).toBeInTheDocument();
    });

    it('displays the Pokemon-themed message', () => {
      renderWithRouter(<NotFound />);

      expect(screen.getByText('🔍 No Pokemon found here!')).toBeInTheDocument();
    });
  });

  describe('Navigation Links', () => {
    it('displays home navigation link', () => {
      renderWithRouter(<NotFound />);

      const homeLink = screen.getByText('🏠 Go to Home');
      expect(homeLink).toBeInTheDocument();
      expect(homeLink.closest('a')).toHaveAttribute('href', '/');
    });

    it('displays about page navigation link', () => {
      renderWithRouter(<NotFound />);

      const aboutLink = screen.getByText('ℹ️ About Page');
      expect(aboutLink).toBeInTheDocument();
      expect(aboutLink.closest('a')).toHaveAttribute('href', '/about');
    });

    it('has proper link roles for accessibility', () => {
      renderWithRouter(<NotFound />);

      expect(
        screen.getByRole('link', { name: /Go to Home/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: /About Page/i })
      ).toBeInTheDocument();
    });
  });

  describe('Layout and Structure', () => {
    it('displays error code as the largest heading', () => {
      renderWithRouter(<NotFound />);

      const errorCode = screen.getByText('404');
      expect(errorCode).toBeInTheDocument();
    });

    it('has proper heading hierarchy', () => {
      renderWithRouter(<NotFound />);

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        '404'
      );
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
        'Page Not Found'
      );
    });

    it('contains navigation section with both links', () => {
      renderWithRouter(<NotFound />);

      const homeLink = screen.getByRole('link', { name: /Go to Home/i });
      const aboutLink = screen.getByRole('link', { name: /About Page/i });

      expect(homeLink).toBeInTheDocument();
      expect(aboutLink).toBeInTheDocument();
    });
  });

  describe('Content Validation', () => {
    it('includes helpful error explanation', () => {
      renderWithRouter(<NotFound />);

      expect(
        screen.getByText(/moved, deleted, or you entered the wrong URL/)
      ).toBeInTheDocument();
    });

    it('maintains Pokemon app theme', () => {
      renderWithRouter(<NotFound />);

      expect(screen.getByText(/No Pokemon found here/)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has accessible heading structure', () => {
      renderWithRouter(<NotFound />);

      const headings = screen.getAllByRole('heading');
      expect(headings).toHaveLength(2);
      expect(headings[0]).toHaveTextContent('404');
      expect(headings[1]).toHaveTextContent('Page Not Found');
    });

    it('has meaningful link text', () => {
      renderWithRouter(<NotFound />);

      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(2);

      links.forEach((link) => {
        expect(link.textContent).toMatch(/Go to Home|About Page/);
      });
    });
  });
});
