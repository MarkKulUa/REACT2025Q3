import React from 'react';
import { render, screen, fireEvent } from '../../__tests__/test-utils';
import { ThemeProvider } from '../ThemeContext';
import { useTheme } from '../../hooks/useTheme';

const TestComponent: React.FC = () => {
  const { theme, setTheme, toggleTheme } = useTheme();

  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <button onClick={() => setTheme('dark')}>Set Dark</button>
      <button onClick={() => setTheme('light')}>Set Light</button>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
};

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('ThemeContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);

    Object.defineProperty(document, 'documentElement', {
      value: {
        setAttribute: vi.fn(),
        className: '',
      },
      writable: true,
    });
  });

  it('provides default light theme', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
      { needsProviders: false }
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
  });

  it('loads saved theme from localStorage', () => {
    localStorageMock.getItem.mockReturnValue('dark');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
      { needsProviders: false }
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
  });

  it('sets theme and saves to localStorage', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
      { needsProviders: false }
    );

    fireEvent.click(screen.getByText('Set Dark'));

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'pokemon-app-theme',
      'dark'
    );
  });

  it('toggles between light and dark themes', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
      { needsProviders: false }
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');

    fireEvent.click(screen.getByText('Toggle'));
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');

    fireEvent.click(screen.getByText('Toggle'));
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
  });

  it('applies theme to document element', () => {
    const mockSetAttribute = vi.fn();
    Object.defineProperty(document, 'documentElement', {
      value: {
        setAttribute: mockSetAttribute,
        className: '',
      },
      writable: true,
    });

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
      { needsProviders: false }
    );

    fireEvent.click(screen.getByText('Set Dark'));

    expect(mockSetAttribute).toHaveBeenCalledWith('data-theme', 'dark');
    expect(document.documentElement.className).toBe('dark');
  });

  it('throws error when useTheme is used outside ThemeProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />, { needsProviders: false });
    }).toThrow('useTheme must be used within a ThemeProvider');

    consoleSpy.mockRestore();
  });
});
