import { PokemonServerApi } from '@/lib/pokemon-server';
import PokemonSearchClient from '@/components/PokemonSearchClient';

interface SearchParams {
  search?: string;
}

interface PageProps {
  params: Promise<{
    locale: string;
    page: string;
  }>;
  searchParams: Promise<SearchParams>;
}

export default async function PageNumber({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const page = parseInt(resolvedParams.page, 10);
  const searchTerm = resolvedSearchParams.search || '';
  const limit = 20;
  const offset = (page - 1) * limit;

  // Fetch initial data on the server
  const initialData = await PokemonServerApi.searchPokemon(
    searchTerm,
    limit,
    offset
  );

  return (
    <PokemonSearchClient
      initialData={initialData}
      initialPage={page}
      initialSearchTerm={searchTerm}
    />
  );
}
