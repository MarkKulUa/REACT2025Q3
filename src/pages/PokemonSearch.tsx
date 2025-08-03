import React, { useEffect, useCallback, useRef } from 'react';
import {
  Outlet,
  useNavigate,
  useSearchParams,
  useParams,
} from 'react-router-dom';
import { usePokemon } from '../hooks/usePokemon';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAppSelector } from '../store/hooks';
import { downloadSelectedItemsAsCSV } from '../utils/downloadUtils';
import Header from '../components/Header';
import Main from '../components/Main';
import Pagination from '../components/Pagination';
import SelectedItemsFlyout from '../components/SelectedItemsFlyout';
import type { Pokemon } from '../types/pokemon';
import styles from './PokemonSearch.module.css';

const ITEMS_PER_PAGE = 20;

const PokemonSearch: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const { pokemon, isLoading, error, searchPokemon, totalCount } = usePokemon();
  const [searchTerm, setSearchTerm] = useLocalStorage(
    'pokemon-search-term',
    ''
  );
  const selectedItems = useAppSelector((state) => state.selectedItems.items);
  const hasInitialized = useRef(false);

  // Get current page from URL params or search params, default to 1
  const pageFromParams = params.page ? parseInt(params.page, 10) : null;
  const pageFromSearch = searchParams.get('page')
    ? parseInt(searchParams.get('page') || '1', 10)
    : null;
  const currentPage = pageFromParams || pageFromSearch || 1;

  // Handle search functionality
  const handleSearch = useCallback(
    async (term: string) => {
      setSearchTerm(term);
      await searchPokemon(term, 1); // Reset to page 1 on new search

      // Navigate to home page with new search
      navigate('/', { replace: true });
    },
    [searchPokemon, setSearchTerm, navigate]
  );

  // Handle page changes
  const handlePageChange = useCallback(
    (page: number) => {
      if (page === 1) {
        navigate('/', { replace: true });
      } else {
        navigate(`/${page}`, { replace: true });
      }
    },
    [navigate]
  );

  // Handle card click to show details
  const handleCardClick = useCallback(
    (pokemon: Pokemon) => {
      const basePath = currentPage === 1 ? '' : `/${currentPage}`;
      navigate(`${basePath}/pokemon/${pokemon.name}`, { replace: false });
    },
    [navigate, currentPage]
  );

  // Handle download of selected items
  const handleDownload = useCallback(() => {
    downloadSelectedItemsAsCSV(selectedItems);
  }, [selectedItems]);

  // Load data when search term or page changes
  useEffect(() => {
    if (searchTerm) {
      searchPokemon(searchTerm, currentPage);
    } else {
      // Load all Pokemon when there's no search term
      searchPokemon('', currentPage);
    }
    hasInitialized.current = true;
  }, [searchTerm, currentPage, searchPokemon]);

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchSection}>
        <Header onSearch={handleSearch} isLoading={isLoading} />
        <Main
          pokemon={pokemon}
          isLoading={isLoading}
          error={error}
          onCardClick={handleCardClick}
        />
        {totalCount > ITEMS_PER_PAGE && (
          <Pagination
            currentPage={currentPage}
            totalItems={totalCount}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      <div className={styles.detailsSection}>
        <Outlet />
      </div>

      <SelectedItemsFlyout onDownload={handleDownload} />
    </div>
  );
};

export default PokemonSearch;
