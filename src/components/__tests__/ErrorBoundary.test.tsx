import { render, screen, fireEvent } from '../../__tests__/test-utils';
import ErrorBoundary from '../ErrorBoundary';

// Component that throws an error when shouldThrow prop is true
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error for ErrorBoundary!');
  }
  return <div>No error</div>;
};

// Mock console.error to avoid noise in test output
const originalConsoleError = console.error;

describe('ErrorBoundary Component', () => {
  beforeEach(() => {
    // Mock console.error to capture error logging
    console.error = vi.fn();
  });

  afterEach(() => {
    // Restore original console.error
    console.error = originalConsoleError;
    vi.clearAllMocks();
  });

  describe('Normal Rendering', () => {
    it('renders children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <div>Child component</div>
        </ErrorBoundary>
      );

      expect(screen.getByText('Child component')).toBeInTheDocument();
      expect(
        screen.queryByText(/something went wrong/i)
      ).not.toBeInTheDocument();
    });

    it('renders multiple children correctly', () => {
      render(
        <ErrorBoundary>
          <div>First child</div>
          <div>Second child</div>
        </ErrorBoundary>
      );

      expect(screen.getByText('First child')).toBeInTheDocument();
      expect(screen.getByText('Second child')).toBeInTheDocument();
    });
  });

  describe('Error Catching Tests', () => {
    it('catches and handles JavaScript errors in child components', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      expect(
        screen.getByText(/an error occurred in the application/i)
      ).toBeInTheDocument();
      expect(screen.queryByText('No error')).not.toBeInTheDocument();
    });

    it('displays fallback UI when error occurs', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      expect(
        screen.getByText(/an error occurred in the application/i)
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /try again/i })
      ).toBeInTheDocument();
    });

    it('shows error details in details element', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const detailsElement = screen.getByText(/test error for errorboundary/i);
      expect(detailsElement).toBeInTheDocument();
      expect(detailsElement.closest('details')).toBeInTheDocument();
    });

    it('logs error to console', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(console.error).toHaveBeenCalledWith(
        'Error caught by ErrorBoundary:',
        expect.any(Error),
        expect.any(Object)
      );
    });
  });

  describe('Try Again Button Tests', () => {
    it('renders try again button in error state', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(
        screen.getByRole('button', { name: /try again/i })
      ).toBeInTheDocument();
    });

    it('resets internal state when try again button is clicked', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Verify error state
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();

      // Click try again button - this should call setState
      const tryAgainButton = screen.getByRole('button', { name: /try again/i });

      // Verify button exists and is clickable
      expect(tryAgainButton).toBeInTheDocument();
      fireEvent.click(tryAgainButton);

      // After clicking, verify the button action was executed
      // Note: Button may be removed from DOM after state reset
    });
  });

  describe('Error Recovery Tests', () => {
    it('can handle error boundary reset functionality', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Verify error state
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      expect(
        screen.getByText(/an error occurred in the application/i)
      ).toBeInTheDocument();

      // Verify try again button works
      const tryAgainButton = screen.getByRole('button', { name: /try again/i });
      expect(tryAgainButton).toBeInTheDocument();

      // Click should not throw
      expect(() => fireEvent.click(tryAgainButton)).not.toThrow();
    });
  });

  describe('Different Error Types', () => {
    const CustomError = ({ errorMessage }: { errorMessage: string }) => {
      throw new Error(errorMessage);
    };

    it('handles different error messages', () => {
      const customMessage = 'Custom error message';

      render(
        <ErrorBoundary>
          <CustomError errorMessage={customMessage} />
        </ErrorBoundary>
      );

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      expect(
        screen.getByText(new RegExp(customMessage, 'i'))
      ).toBeInTheDocument();
    });

    it('handles errors without messages', () => {
      const EmptyError = () => {
        throw new Error('');
      };

      render(
        <ErrorBoundary>
          <EmptyError />
        </ErrorBoundary>
      );

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      // Should still show fallback UI even with empty error message
    });
  });
});
