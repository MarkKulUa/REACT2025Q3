import { PokemonServerApi } from '@/lib/pokemon-server';
import PokemonSearchClient from '@/components/PokemonSearchClient';

interface SearchParams {
  page?: string;
  search?: string;
}

interface HomePageProps {
  searchParams: Promise<SearchParams>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams;

  const page = parseInt(resolvedSearchParams.page || '1', 10);
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
