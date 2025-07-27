import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import PokemonSearch from './pages/PokemonSearch';
import PokemonDetails from './components/PokemonDetails';
import About from './pages/About';
import NotFound from './pages/NotFound';
import './App.css';

// Function to determine base path
const getBasename = (): string => {
  // For local development
  if (import.meta.env.DEV) {
    return '';
  }

  // For GitHub Pages
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
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
};

export default App;
