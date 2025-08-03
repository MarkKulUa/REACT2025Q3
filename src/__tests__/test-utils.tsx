import React from 'react';
import type { ReactElement } from 'react';
import { render as originalRender } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import selectedItemsReducer from '../store/slices/selectedItemsSlice';
import type { RootState } from '../store/store';
import { ThemeProvider } from '../contexts/ThemeContext';

export const createTestStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: {
      selectedItems: selectedItemsReducer,
    },
    preloadedState: preloadedState as RootState | undefined,
  });
};

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Partial<RootState>;
  store?: ReturnType<typeof createTestStore>;
  initialEntries?: string[];
  needsProviders?: boolean;
  needsRouter?: boolean;
}

const customRender = (
  ui: ReactElement,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    initialEntries = ['/'],
    needsProviders = true,
    needsRouter = true,
    ...renderOptions
  }: CustomRenderOptions = {}
) => {
  if (!needsProviders) {
    return originalRender(ui, renderOptions);
  }

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    const content = (
      <Provider store={store}>
        <ThemeProvider>{children}</ThemeProvider>
      </Provider>
    );

    if (needsRouter) {
      return (
        <MemoryRouter initialEntries={initialEntries}>{content}</MemoryRouter>
      );
    }

    return content;
  };

  return {
    store,
    ...originalRender(ui, { wrapper: Wrapper, ...renderOptions }),
  };
};

export const renderWithRedux = (
  ui: ReactElement,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  return {
    store,
    ...originalRender(ui, { wrapper: Wrapper, ...renderOptions }),
  };
};

// For components that only need Theme
export const renderWithTheme = (ui: ReactElement, renderOptions = {}) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>{children}</ThemeProvider>
  );

  return originalRender(ui, { wrapper: Wrapper, ...renderOptions });
};

export {
  screen,
  fireEvent,
  waitFor,
  waitForElementToBeRemoved,
  within,
  getByText,
  getByRole,
  queryByText,
  queryByRole,
  findByText,
  findByRole,
} from '@testing-library/react';

export { customRender as render };
