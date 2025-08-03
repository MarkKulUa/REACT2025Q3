import { render, screen } from '../../__tests__/test-utils';
import { MemoryRouter } from 'react-router-dom';
import About from '../About';

describe('About Component', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<MemoryRouter>{component}</MemoryRouter>, {
      needsRouter: false,
    });
  };

  describe('Rendering Tests', () => {
    it('renders the main title correctly', () => {
      renderWithRouter(<About />);

      expect(screen.getByText('About This Pokemon App')).toBeInTheDocument();
    });

    it('displays author information section', () => {
      renderWithRouter(<About />);

      expect(screen.getByText('Author Information')).toBeInTheDocument();
      expect(
        screen.getByText(
          /This Pokemon search application was created as part of the React course assignment/
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Developed with React, TypeScript, and React Router/)
      ).toBeInTheDocument();
    });

    it('displays course information section', () => {
      renderWithRouter(<About />);

      expect(screen.getByText('Course Information')).toBeInTheDocument();
      expect(
        screen.getByText(
          /This project is part of the React course at RS School/
        )
      ).toBeInTheDocument();
    });

    it('displays features section', () => {
      renderWithRouter(<About />);

      expect(screen.getByText('Features')).toBeInTheDocument();
      expect(
        screen.getByText(/Search Pokemon by name with localStorage persistence/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Pagination with URL synchronization/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Master-detail view with route-based navigation/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Responsive design and error handling/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          /Built with modern React hooks and functional components/
        )
      ).toBeInTheDocument();
    });
  });

  describe('Navigation Links', () => {
    it('displays RS School course link with correct attributes', () => {
      renderWithRouter(<About />);

      const courseLink = screen.getByText('Visit RS School React Course');
      expect(courseLink).toBeInTheDocument();
      expect(courseLink).toHaveAttribute(
        'href',
        'https://rs.school/courses/reactjs'
      );
      expect(courseLink).toHaveAttribute('target', '_blank');
      expect(courseLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('displays back to home link', () => {
      renderWithRouter(<About />);

      const homeLink = screen.getByText('← Back to Pokemon Search');
      expect(homeLink).toBeInTheDocument();
      expect(homeLink.closest('a')).toHaveAttribute('href', '/');
    });
  });

  describe('Content Structure', () => {
    it('displays all main sections', () => {
      renderWithRouter(<About />);

      expect(screen.getByText('Author Information')).toBeInTheDocument();
      expect(screen.getByText('Course Information')).toBeInTheDocument();
      expect(screen.getByText('Features')).toBeInTheDocument();
    });

    it('displays feature list items', () => {
      renderWithRouter(<About />);

      const featureItems = screen.getAllByText(
        /Search Pokemon|Pagination|Master-detail|Responsive|Built with/
      );
      expect(featureItems.length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility', () => {
    it('uses proper heading hierarchy', () => {
      renderWithRouter(<About />);

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'About This Pokemon App'
      );
      expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(3);
    });

    it('has accessible link text', () => {
      renderWithRouter(<About />);

      const courseLink = screen.getByRole('link', {
        name: /Visit RS School React Course/i,
      });
      expect(courseLink).toBeInTheDocument();

      const homeLink = screen.getByRole('link', {
        name: /Back to Pokemon Search/i,
      });
      expect(homeLink).toBeInTheDocument();
    });

    it('displays theme selector', () => {
      renderWithRouter(<About />);

      expect(screen.getByText('Theme:')).toBeInTheDocument();
      expect(screen.getByLabelText('Light')).toBeInTheDocument();
      expect(screen.getByLabelText('Dark')).toBeInTheDocument();
    });
  });
});
