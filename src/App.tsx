import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import PokemonSearch from './pages/PokemonSearch';
import PokemonDetails from './components/PokemonDetails';
import About from './pages/About';
import NotFound from './pages/NotFound';
import './App.css';

const getBasename = (): string => {
  if (import.meta.env.DEV) {
    return '';
  }

  if (window.location.hostname === 'markkulua.github.io') {
    return '/REACT2025Q3';
  }

  return '';
};

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      errorElement: <NotFound />,
      children: [
        {
          path: '',
          element: <PokemonSearch />,
          children: [
            {
              path: 'pokemon/:pokemonName',
              element: <PokemonDetails />,
            },
          ],
        },
        {
          path: ':page',
          element: <PokemonSearch />,
          children: [
            {
              path: 'pokemon/:pokemonName',
              element: <PokemonDetails />,
            },
          ],
        },
        {
          path: 'about',
          element: <About />,
        },
        {
          path: '*',
          element: <NotFound />,
        },
      ],
    },
  ],
  {
    basename: getBasename(),
  }
);

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <ErrorBoundary>
          <RouterProvider router={router} />
        </ErrorBoundary>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
