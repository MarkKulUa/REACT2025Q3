import type { SelectedPokemonItem } from '../store/slices/selectedItemsSlice';

export const downloadSelectedItemsAsCSV = (
  items: SelectedPokemonItem[]
): void => {
  if (items.length === 0) {
    return;
  }

  // CSV headers
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

    // Escape CSV values (handle commas, quotes, newlines)
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

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${items.length}_pokemon_items.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
