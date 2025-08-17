import { NextRequest, NextResponse } from 'next/server';
import { PokemonServerApi } from '@/lib/pokemon-server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const data = await PokemonServerApi.getPokemonDetails(name);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in Pokemon Details API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Pokemon details' },
      { status: 500 }
    );
  }
}
