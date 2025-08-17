import { downloadSelectedItemsAsCSV } from '../downloadUtils';
import type { SelectedPokemonItem } from '../../store/slices/selectedItemsSlice';

const mockCreateElement = vi.fn();
const mockClick = vi.fn();
const mockAppendChild = vi.fn();
const mockRemoveChild = vi.fn();
const mockCreateObjectURL = vi.fn();
const mockRevokeObjectURL = vi.fn();

Object.defineProperty(document, 'createElement', {
  value: mockCreateElement,
});

Object.defineProperty(document, 'body', {
  value: {
    appendChild: mockAppendChild,
    removeChild: mockRemoveChild,
  },
});

Object.defineProperty(URL, 'createObjectURL', {
  value: mockCreateObjectURL,
});

Object.defineProperty(URL, 'revokeObjectURL', {
  value: mockRevokeObjectURL,
});

const mockLink = {
  download: '',
  setAttribute: vi.fn(),
  style: { visibility: '' },
  click: mockClick,
};

const mockSelectedItems: SelectedPokemonItem[] = [
  {
    pokemon: { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
    details: {
      id: 25,
      name: 'pikachu',
      height: 4,
      weight: 60,
      sprites: { front_default: 'image.png' },
      types: [{ type: { name: 'electric' } }],
    },
    description: 'Electric type pokemon',
  },
  {
    pokemon: {
      name: 'charmander',
      url: 'https://pokeapi.co/api/v2/pokemon/4/',
    },
    details: {
      id: 4,
      name: 'charmander',
      height: 6,
      weight: 85,
      sprites: { front_default: 'image2.png' },
      types: [{ type: { name: 'fire' } }],
    },
    description: 'Fire type pokemon',
  },
];

describe('downloadUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateElement.mockReturnValue(mockLink);
    mockCreateObjectURL.mockReturnValue('blob:mock-url');
  });

  describe('downloadSelectedItemsAsCSV', () => {
    it('does nothing when no items are provided', () => {
      downloadSelectedItemsAsCSV([]);

      expect(mockCreateElement).not.toHaveBeenCalled();
    });

    it('creates and downloads CSV file with correct data', () => {
      downloadSelectedItemsAsCSV(mockSelectedItems);

      expect(mockCreateElement).toHaveBeenCalledWith('a');
      expect(mockLink.setAttribute).toHaveBeenCalledWith(
        'href',
        'blob:mock-url'
      );
      expect(mockLink.setAttribute).toHaveBeenCalledWith(
        'download',
        '2_pokemon_items.csv'
      );
      expect(mockClick).toHaveBeenCalled();
      expect(mockAppendChild).toHaveBeenCalledWith(mockLink);
      expect(mockRemoveChild).toHaveBeenCalledWith(mockLink);
      expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    });

    it('handles items without details', () => {
      const itemsWithoutDetails: SelectedPokemonItem[] = [
        {
          pokemon: {
            name: 'unknown',
            url: 'https://pokeapi.co/api/v2/pokemon/1/',
          },
        },
      ];

      downloadSelectedItemsAsCSV(itemsWithoutDetails);

      expect(mockCreateElement).toHaveBeenCalled();
      expect(mockLink.setAttribute).toHaveBeenCalledWith(
        'download',
        '1_pokemon_items.csv'
      );
    });

    it('escapes CSV special characters correctly', () => {
      const itemsWithSpecialChars: SelectedPokemonItem[] = [
        {
          pokemon: { name: 'test,pokemon', url: 'https://example.com' },
          description: 'Description with "quotes" and, commas',
        },
      ];

      downloadSelectedItemsAsCSV(itemsWithSpecialChars);

      expect(mockCreateElement).toHaveBeenCalled();
    });

    it('handles missing download support', () => {
      const linkWithoutDownload = { ...mockLink };
      delete (linkWithoutDownload as { download?: string }).download;
      mockCreateElement.mockReturnValue(linkWithoutDownload);

      downloadSelectedItemsAsCSV(mockSelectedItems);

      expect(mockClick).not.toHaveBeenCalled();
    });
  });
});
