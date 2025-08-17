'use client';

import React, { useEffect, useCallback, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePokemon } from '../hooks/usePokemon';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAppSelector } from '../store/hooks';
import { downloadCsv } from '../app/actions/downloadCsv';
import { useRouter } from '@/lib/navigation';
import Header from './Header';
import Main from './Main';
import Pagination from './Pagination';
import SelectedItemsFlyout from './SelectedItemsFlyout';
import type { Pokemon, PokemonResponse } from '../types/pokemon';
import styles from './PokemonSearchClient.module.css';

const ITEMS_PER_PAGE = 20;

interface PokemonSearchClientProps {
  initialData: PokemonResponse;
  initialPage: number;
  initialSearchTerm: string;
}

const PokemonSearchClient: React.FC<PokemonSearchClientProps> = ({
  initialData,
  initialPage,
  initialSearchTerm,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { pokemon, isLoading, error, searchPokemon, totalCount, refetch } =
    usePokemon();
  const [, setSearchTerm] = useLocalStorage(
    'pokemon-search-term',
    initialSearchTerm
  );
  const selectedItems = useAppSelector((state) => state.selectedItems.items);
  const hasInitialized = useRef(false);
  const [pokemonData, setPokemonData] = useState(initialData.results);

  const currentPage = searchParams?.get('page')
    ? parseInt(searchParams.get('page') || '1', 10)
    : initialPage;

  // Use initial data on first load
  useEffect(() => {
    if (!hasInitialized.current) {
      setPokemonData(initialData.results);
      hasInitialized.current = true;
    }
  }, [initialData.results]);

  const handleSearch = useCallback(
    async (term: string) => {
      setSearchTerm(term);

      // Update URL with search parameters
      if (term.trim()) {
        router.replace(`/?search=${encodeURIComponent(term)}`);
      } else {
        router.replace('/');
      }

      // Use client-side fetch for dynamic searches
      await searchPokemon(term, 1);
    },
    [searchPokemon, setSearchTerm, router]
  );

  const handleRefresh = useCallback(() => {
    // Force a re-fetch from the server bypassing cache
    refetch();
  }, [refetch]);

  const handlePageChange = useCallback(
    (page: number) => {
      const searchParam = searchParams?.get('search');
      if (page === 1) {
        if (searchParam) {
          router.replace(`/?search=${searchParam}`);
        } else {
          router.replace('/');
        }
      } else {
        if (searchParam) {
          router.replace(`/?search=${searchParam}&page=${page}`);
        } else {
          router.replace(`/?page=${page}`);
        }
      }
    },
    [router, searchParams]
  );

  const handleCardClick = useCallback((pokemon: Pokemon) => {
    // For now, we'll handle Pokémon details via a modal or overlay
    // since we're removing the nested routing structure
    console.log('Pokemon clicked:', pokemon.name);
  }, []);

  const handleDownload = useCallback(async () => {
    try {
      const result = await downloadCsv(selectedItems);

      // Create a download link
      const blob = new Blob([result.content], { type: result.contentType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading CSV:', error);
    }
  }, [selectedItems]);

  // Use client-side data when available, otherwise use initial data
  const displayedPokemon = pokemon.length > 0 ? pokemon : pokemonData;
  const displayedTotalCount =
    pokemon.length > 0
      ? totalCount
      : initialData.count || initialData.results.length;

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchSection}>
        <Header
          onSearch={handleSearch}
          isLoading={isLoading}
          onRefresh={handleRefresh}
        />
        <Main
          pokemon={displayedPokemon}
          isLoading={isLoading}
          error={error}
          onCardClick={handleCardClick}
        />
        {displayedTotalCount > ITEMS_PER_PAGE && (
          <Pagination
            currentPage={currentPage}
            totalItems={displayedTotalCount}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      <SelectedItemsFlyout onDownload={handleDownload} />
    </div>
  );
};

export default PokemonSearchClient;
