import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import Layout from '../Layout';

// Mock next-intl navigation
vi.mock('@/lib/navigation', () => ({
  Link: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
  usePathname: vi.fn(() => '/'),
}));

// Mock next-intl useTranslations
vi.mock('next-intl', async () => {
  const actual = await vi.importActual('next-intl');
  return {
    ...actual,
    useTranslations: vi.fn(() => (key: string) => {
      const translations: Record<string, string> = {
        pokemon: 'Pokemon Search',
        about: 'About',
      };
      return translations[key] || key;
    }),
  };
});

const messages = {
  header: {
    pokemon: 'Pokemon Search',
    about: 'About',
  },
};

describe('Layout Component', () => {
  const renderLayout = (children = <div>Test Content</div>) => {
    return render(
      <NextIntlClientProvider messages={messages} locale="en">
        <Layout>{children}</Layout>
      </NextIntlClientProvider>
    );
  };

  describe('Navigation Tests', () => {
    it('renders navigation bar', () => {
      renderLayout();

      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('displays Pokemon Search link', () => {
      renderLayout();

      const searchLink = screen.getByText('🔍 Pokemon Search');
      expect(searchLink).toBeInTheDocument();
      expect(searchLink.closest('a')).toHaveAttribute('href', '/');
    });

    it('displays About link', () => {
      renderLayout();

      const aboutLink = screen.getByText('ℹ️ About');
      expect(aboutLink).toBeInTheDocument();
      expect(aboutLink.closest('a')).toHaveAttribute('href', '/about');
    });

    it('has proper link roles for accessibility', () => {
      renderLayout();

      expect(
        screen.getByRole('link', { name: /Pokemon Search/i })
      ).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /About/i })).toBeInTheDocument();
    });
  });

  describe('Content Rendering', () => {
    it('renders main content area', () => {
      renderLayout();

      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('renders children content', () => {
      renderLayout(<div data-testid="test-content">Custom Content</div>);

      expect(screen.getByTestId('test-content')).toBeInTheDocument();
      expect(screen.getByText('Custom Content')).toBeInTheDocument();
    });

    it('contains children within main content', () => {
      renderLayout(<div data-testid="test-content">Custom Content</div>);

      const main = screen.getByRole('main');
      const content = screen.getByTestId('test-content');
      expect(main).toContainElement(content);
    });
  });

  describe('Layout Structure', () => {
    it('has proper semantic HTML structure', () => {
      renderLayout();

      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('maintains proper hierarchy', () => {
      renderLayout();

      const container = document.querySelector('[class*="layoutContainer"]');
      const nav = screen.getByRole('navigation');
      const main = screen.getByRole('main');

      expect(container).toContainElement(nav);
      expect(container).toContainElement(main);
    });
  });

  describe('Navigation Links', () => {
    it('all navigation links are accessible', () => {
      renderLayout();

      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(2);

      links.forEach((link) => {
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href');
      });
    });

    it('links have meaningful text content', () => {
      renderLayout();

      const searchLink = screen.getByRole('link', { name: /Pokemon Search/i });
      const aboutLink = screen.getByRole('link', { name: /About/i });

      expect(searchLink.textContent).toContain('Pokemon Search');
      expect(aboutLink.textContent).toContain('About');
    });
  });

  describe('Accessibility', () => {
    it('has semantic landmarks', () => {
      renderLayout();

      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('navigation is properly labeled', () => {
      renderLayout();

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    it('all interactive elements are accessible', () => {
      renderLayout();

      const links = screen.getAllByRole('link');
      links.forEach((link) => {
        expect(link).toBeVisible();
        expect(link).not.toBeDisabled();
      });
    });
  });
});
