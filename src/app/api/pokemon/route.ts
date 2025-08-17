import { NextRequest, NextResponse } from 'next/server';
import { PokemonServerApi } from '@/lib/pokemon-server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const offset = (page - 1) * limit;

    const data = await PokemonServerApi.searchPokemon(
      searchTerm,
      limit,
      offset
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in Pokemon API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Pokemon data' },
      { status: 500 }
    );
  }
}
