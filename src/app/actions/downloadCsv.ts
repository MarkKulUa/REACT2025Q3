'use server';

import type { SelectedPokemonItem } from '@/store/slices/selectedItemsSlice';

export async function downloadCsv(items: SelectedPokemonItem[]) {
  if (items.length === 0) {
    throw new Error('No items to download');
  }

  const headers = [
    'Name',
    'Description',
    'Details URL',
    'Height (m)',
    'Weight (kg)',
    'Types',
    'ID',
  ];

  const csvRows = items.map((item) => {
    const pokemon = item.pokemon;
    const details = item.details;
    const description = item.description || 'No description available';

    const height = details ? (details.height / 10).toString() : 'N/A';
    const weight = details ? (details.weight / 10).toString() : 'N/A';
    const types = details
      ? details.types.map((t) => t.type.name).join('; ')
      : 'N/A';
    const id = details ? details.id.toString() : 'N/A';

    const escapeCSV = (value: string): string => {
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    return [
      escapeCSV(pokemon.name),
      escapeCSV(description),
      escapeCSV(pokemon.url),
      escapeCSV(height),
      escapeCSV(weight),
      escapeCSV(types),
      escapeCSV(id),
    ].join(',');
  });

  const csvContent = [headers.join(','), ...csvRows].join('\n');

  return {
    content: csvContent,
    filename: `${items.length}_pokemon_items.csv`,
    contentType: 'text/csv;charset=utf-8;',
  };
}
