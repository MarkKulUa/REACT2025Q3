import { render, screen, fireEvent } from '../../__tests__/test-utils';
import Pagination from '../Pagination';

describe('Pagination Component', () => {
  const mockOnPageChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering Tests', () => {
    it('renders pagination controls correctly', () => {
      render(
        <Pagination
          currentPage={2}
          totalItems={100}
          itemsPerPage={20}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByText('← Previous')).toBeInTheDocument();
      expect(screen.getByText('Next →')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText(/Showing page 2 of 5/)).toBeInTheDocument();
      expect(screen.getByText(/100 total items/)).toBeInTheDocument();
    });

    it('does not render when there is only one page or less', () => {
      const { container } = render(
        <Pagination
          currentPage={1}
          totalItems={10}
          itemsPerPage={20}
          onPageChange={mockOnPageChange}
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it('does not render when there are no items', () => {
      const { container } = render(
        <Pagination
          currentPage={1}
          totalItems={0}
          itemsPerPage={20}
          onPageChange={mockOnPageChange}
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it('highlights current page correctly', () => {
      render(
        <Pagination
          currentPage={3}
          totalItems={100}
          itemsPerPage={20}
          onPageChange={mockOnPageChange}
        />
      );

      const currentPageButton = screen.getByRole('button', { name: '3' });
      expect(currentPageButton.className).toMatch(/active/);
    });
  });

  describe('Navigation Controls', () => {
    it('disables Previous button on first page', () => {
      render(
        <Pagination
          currentPage={1}
          totalItems={100}
          itemsPerPage={20}
          onPageChange={mockOnPageChange}
        />
      );

      const previousButton = screen.getByText('← Previous');
      expect(previousButton).toBeDisabled();
    });

    it('disables Next button on last page', () => {
      render(
        <Pagination
          currentPage={5}
          totalItems={100}
          itemsPerPage={20}
          onPageChange={mockOnPageChange}
        />
      );

      const nextButton = screen.getByText('Next →');
      expect(nextButton).toBeDisabled();
    });

    it('enables both buttons on middle pages', () => {
      render(
        <Pagination
          currentPage={3}
          totalItems={100}
          itemsPerPage={20}
          onPageChange={mockOnPageChange}
        />
      );

      const previousButton = screen.getByText('← Previous');
      const nextButton = screen.getByText('Next →');

      expect(previousButton).not.toBeDisabled();
      expect(nextButton).not.toBeDisabled();
    });
  });

  describe('User Interactions', () => {
    it('calls onPageChange when Previous button is clicked', () => {
      render(
        <Pagination
          currentPage={3}
          totalItems={100}
          itemsPerPage={20}
          onPageChange={mockOnPageChange}
        />
      );

      const previousButton = screen.getByText('← Previous');
      fireEvent.click(previousButton);

      expect(mockOnPageChange).toHaveBeenCalledWith(2);
    });

    it('calls onPageChange when Next button is clicked', () => {
      render(
        <Pagination
          currentPage={2}
          totalItems={100}
          itemsPerPage={20}
          onPageChange={mockOnPageChange}
        />
      );

      const nextButton = screen.getByText('Next →');
      fireEvent.click(nextButton);

      expect(mockOnPageChange).toHaveBeenCalledWith(3);
    });

    it('calls onPageChange when page number is clicked', () => {
      render(
        <Pagination
          currentPage={2}
          totalItems={100}
          itemsPerPage={20}
          onPageChange={mockOnPageChange}
        />
      );

      const pageButton = screen.getByRole('button', { name: '4' });
      fireEvent.click(pageButton);

      expect(mockOnPageChange).toHaveBeenCalledWith(4);
    });

    it('does not call onPageChange when current page is clicked', () => {
      render(
        <Pagination
          currentPage={3}
          totalItems={100}
          itemsPerPage={20}
          onPageChange={mockOnPageChange}
        />
      );

      const currentPageButton = screen.getByRole('button', { name: '3' });
      fireEvent.click(currentPageButton);

      expect(mockOnPageChange).toHaveBeenCalledWith(3);
    });
  });

  describe('Page Number Display', () => {
    it('shows all pages when total pages is 5 or less', () => {
      render(
        <Pagination
          currentPage={2}
          totalItems={80}
          itemsPerPage={20}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '4' })).toBeInTheDocument();
    });

    it('shows ellipsis for many pages', () => {
      render(
        <Pagination
          currentPage={5}
          totalItems={200}
          itemsPerPage={20}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
      expect(screen.getAllByText('...')).toHaveLength(2);
      expect(screen.getByRole('button', { name: '10' })).toBeInTheDocument();
    });

    it('shows correct pages around current page', () => {
      render(
        <Pagination
          currentPage={5}
          totalItems={200}
          itemsPerPage={20}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByRole('button', { name: '4' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '6' })).toBeInTheDocument();
    });
  });

  describe('Information Display', () => {
    it('displays correct page information', () => {
      render(
        <Pagination
          currentPage={3}
          totalItems={47}
          itemsPerPage={10}
          onPageChange={mockOnPageChange}
        />
      );

      expect(
        screen.getByText('Showing page 3 of 5 (47 total items)')
      ).toBeInTheDocument();
    });

    it('handles exact page divisions correctly', () => {
      render(
        <Pagination
          currentPage={2}
          totalItems={40}
          itemsPerPage={20}
          onPageChange={mockOnPageChange}
        />
      );

      expect(
        screen.getByText('Showing page 2 of 2 (40 total items)')
      ).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles single item correctly', () => {
      render(
        <Pagination
          currentPage={1}
          totalItems={25}
          itemsPerPage={20}
          onPageChange={mockOnPageChange}
        />
      );

      expect(
        screen.getByText('Showing page 1 of 2 (25 total items)')
      ).toBeInTheDocument();
    });

    it('handles large numbers correctly', () => {
      render(
        <Pagination
          currentPage={50}
          totalItems={10000}
          itemsPerPage={20}
          onPageChange={mockOnPageChange}
        />
      );

      expect(
        screen.getByText('Showing page 50 of 500 (10000 total items)')
      ).toBeInTheDocument();
    });
  });
});
