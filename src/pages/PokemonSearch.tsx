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
  const { pokemon, isLoading, error, searchPokemon, totalCount, refetch } =
    usePokemon();
  const [searchTerm, setSearchTerm] = useLocalStorage(
    'pokemon-search-term',
    ''
  );
  const selectedItems = useAppSelector((state) => state.selectedItems.items);
  const hasInitialized = useRef(false);

  const pageFromParams = params.page ? parseInt(params.page, 10) : null;
  const pageFromSearch = searchParams.get('page')
    ? parseInt(searchParams.get('page') || '1', 10)
    : null;
  const currentPage = pageFromParams || pageFromSearch || 1;

  const handleSearch = useCallback(
    async (term: string) => {
      setSearchTerm(term);
      await searchPokemon(term, 1);

      navigate('/', { replace: true });
    },
    [searchPokemon, setSearchTerm, navigate]
  );

  const handleRefresh = useCallback(() => {
    // Force a re-fetch from the server bypassing cache
    refetch();
  }, [refetch]);

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

  const handleCardClick = useCallback(
    (pokemon: Pokemon) => {
      const basePath = currentPage === 1 ? '' : `/${currentPage}`;
      navigate(`${basePath}/pokemon/${pokemon.name}`, { replace: false });
    },
    [navigate, currentPage]
  );

  const handleDownload = useCallback(() => {
    downloadSelectedItemsAsCSV(selectedItems);
  }, [selectedItems]);

  const handleDetailsSectionClick = useCallback(
    (event: React.MouseEvent) => {
      if (event.target === event.currentTarget) {
        const basePath = currentPage === 1 ? '' : `/${currentPage}`;
        navigate(basePath, { replace: true });
      }
    },
    [navigate, currentPage]
  );

  useEffect(() => {
    if (searchTerm) {
      searchPokemon(searchTerm, currentPage);
    } else {
      searchPokemon('', currentPage);
    }
    hasInitialized.current = true;
  }, [searchTerm, currentPage, searchPokemon]);

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchSection}>
        <Header
          onSearch={handleSearch}
          isLoading={isLoading}
          onRefresh={handleRefresh}
        />
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

      <div
        className={styles.detailsSection}
        onClick={handleDetailsSectionClick}
      >
        <Outlet />
      </div>

      <SelectedItemsFlyout onDownload={handleDownload} />
    </div>
  );
};

export default PokemonSearch;
