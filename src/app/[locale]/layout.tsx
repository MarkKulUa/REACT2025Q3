import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import StoreProvider from '@/store/StoreProvider';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import Layout from '@/components/Layout';
import '@/index.css';

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <StoreProvider>
            <ThemeProvider>
              <ErrorBoundary>
                <Layout>{children}</Layout>
              </ErrorBoundary>
            </ThemeProvider>
          </StoreProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
