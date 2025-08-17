import { createApi } from '@reduxjs/toolkit/query/react';
import type {
  Pokemon,
  PokemonDetails,
  PokemonResponse,
} from '../types/pokemon';
import { PokemonApi } from '../services/pokemonApi';

export interface SearchArgs {
  searchTerm: string;
  page: number;
  pageSize?: number;
}

export interface PagedPokemonResult {
  results: Pokemon[];
  totalCount: number;
}

const DEFAULT_PAGE_SIZE = 20;

export const rtkPokemonApi = createApi({
  reducerPath: 'rtkPokemonApi',
  baseQuery: async () => ({ data: {} as unknown as PokemonResponse }),
  tagTypes: ['PokemonList', 'PokemonDetails'],
  endpoints: (builder) => ({
    searchPokemon: builder.query<PagedPokemonResult, SearchArgs>({
      async queryFn(args) {
        const pageSize = args.pageSize ?? DEFAULT_PAGE_SIZE;
        const limit = pageSize * 10;
        try {
          const response = await PokemonApi.searchPokemon(
            args.searchTerm,
            limit
          );
          const totalCount = response.results.length;
          const startIndex = (args.page - 1) * pageSize;
          const endIndex = startIndex + pageSize;
          const results = response.results.slice(startIndex, endIndex);
          return { data: { results, totalCount } as PagedPokemonResult };
        } catch (e) {
          const message =
            e instanceof Error ? e.message : 'Unknown error occurred';
          return { error: { status: 'CUSTOM_ERROR', data: message } };
        }
      },
      providesTags: (_, __, args) => [
        { type: 'PokemonList', id: `${args.searchTerm}::${args.page}` },
        { type: 'PokemonList', id: 'LIST' },
      ],
    }),

    getPokemonDetails: builder.query<PokemonDetails, string>({
      async queryFn(name) {
        try {
          const data = await PokemonApi.getPokemonDetails(name);
          return { data };
        } catch (e) {
          const message =
            e instanceof Error ? e.message : 'Unknown error occurred';
          return { error: { status: 'CUSTOM_ERROR', data: message } };
        }
      },
      providesTags: (_, __, name) => [{ type: 'PokemonDetails', id: name }],
    }),
  }),
});

export const {
  useSearchPokemonQuery,
  useLazySearchPokemonQuery,
  useGetPokemonDetailsQuery,
  util: { invalidateTags, resetApiState },
} = rtkPokemonApi;
