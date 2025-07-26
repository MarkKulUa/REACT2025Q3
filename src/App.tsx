import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import PokemonSearch from './pages/PokemonSearch';
import PokemonDetails from './components/PokemonDetails';
import About from './pages/About';
import NotFound from './pages/NotFound';
import './App.css';

const router = createBrowserRouter([
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
]);

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
};

export default App;
