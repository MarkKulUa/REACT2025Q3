import React from 'react';
import { render, screen, fireEvent } from '../../__tests__/test-utils';
import SelectedItemsFlyout from '../SelectedItemsFlyout';
import type { SelectedPokemonItem } from '../../store/slices/selectedItemsSlice';

const mockOnDownload = vi.fn();

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

describe('SelectedItemsFlyout Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when no items are selected', () => {
    const { container } = render(
      <SelectedItemsFlyout onDownload={mockOnDownload} />,
      {
        preloadedState: {
          selectedItems: { items: [] },
        },
      }
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders flyout when items are selected', () => {
    render(<SelectedItemsFlyout onDownload={mockOnDownload} />, {
      preloadedState: {
        selectedItems: { items: mockSelectedItems },
      },
    });

    expect(screen.getByText('2 items selected')).toBeInTheDocument();
    expect(screen.getByText('Unselect all')).toBeInTheDocument();
    expect(screen.getByText('Download')).toBeInTheDocument();
  });

  it('displays correct count for single item', () => {
    render(<SelectedItemsFlyout onDownload={mockOnDownload} />, {
      preloadedState: {
        selectedItems: { items: [mockSelectedItems[0]] },
      },
    });

    expect(screen.getByText('1 item selected')).toBeInTheDocument();
  });

  it('calls onDownload when download button is clicked', () => {
    render(<SelectedItemsFlyout onDownload={mockOnDownload} />, {
      preloadedState: {
        selectedItems: { items: mockSelectedItems },
      },
    });

    fireEvent.click(screen.getByText('Download'));

    expect(mockOnDownload).toHaveBeenCalledTimes(1);
  });

  it('clears selected items when unselect all button is clicked', () => {
    const renderResult = render(
      <SelectedItemsFlyout onDownload={mockOnDownload} />,
      {
        preloadedState: {
          selectedItems: { items: mockSelectedItems },
        },
      }
    );

    fireEvent.click(screen.getByText('Unselect all'));

    if ('store' in renderResult) {
      expect(renderResult.store.getState().selectedItems.items).toHaveLength(0);
    }
  });
});
