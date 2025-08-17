import selectedItemsReducer, {
  addSelectedItem,
  removeSelectedItem,
  clearSelectedItems,
  updateItemDetails,
} from '../slices/selectedItemsSlice';
import type { SelectedPokemonItem } from '../slices/selectedItemsSlice';

const mockPokemonItem: SelectedPokemonItem = {
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
};

const mockSecondItem: SelectedPokemonItem = {
  pokemon: { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
};

describe('selectedItemsSlice', () => {
  describe('addSelectedItem', () => {
    it('adds new item to empty state', () => {
      const initialState = { items: [] };
      const action = addSelectedItem(mockPokemonItem);
      const state = selectedItemsReducer(initialState, action);

      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual(mockPokemonItem);
    });

    it('adds new item to existing items', () => {
      const initialState = { items: [mockPokemonItem] };
      const action = addSelectedItem(mockSecondItem);
      const state = selectedItemsReducer(initialState, action);

      expect(state.items).toHaveLength(2);
      expect(state.items[1]).toEqual(mockSecondItem);
    });

    it('does not add duplicate items', () => {
      const initialState = { items: [mockPokemonItem] };
      const action = addSelectedItem(mockPokemonItem);
      const state = selectedItemsReducer(initialState, action);

      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual(mockPokemonItem);
    });
  });

  describe('removeSelectedItem', () => {
    it('removes item by name', () => {
      const initialState = { items: [mockPokemonItem, mockSecondItem] };
      const action = removeSelectedItem('pikachu');
      const state = selectedItemsReducer(initialState, action);

      expect(state.items).toHaveLength(1);
      expect(state.items[0].pokemon.name).toBe('charmander');
    });

    it('does nothing when removing non-existent item', () => {
      const initialState = { items: [mockPokemonItem] };
      const action = removeSelectedItem('nonexistent');
      const state = selectedItemsReducer(initialState, action);

      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual(mockPokemonItem);
    });
  });

  describe('clearSelectedItems', () => {
    it('clears all items', () => {
      const initialState = { items: [mockPokemonItem, mockSecondItem] };
      const action = clearSelectedItems();
      const state = selectedItemsReducer(initialState, action);

      expect(state.items).toHaveLength(0);
    });

    it('does nothing when state is already empty', () => {
      const initialState = { items: [] };
      const action = clearSelectedItems();
      const state = selectedItemsReducer(initialState, action);

      expect(state.items).toHaveLength(0);
    });
  });

  describe('updateItemDetails', () => {
    it('updates details for existing item', () => {
      const initialState = { items: [{ pokemon: mockPokemonItem.pokemon }] };
      const newDetails = {
        id: 25,
        name: 'pikachu',
        height: 4,
        weight: 60,
        sprites: { front_default: 'new-image.png' },
        types: [{ type: { name: 'electric' } }],
      };
      const action = updateItemDetails({
        name: 'pikachu',
        details: newDetails,
        description: 'Updated description',
      });
      const state = selectedItemsReducer(initialState, action);

      expect(state.items[0].details).toEqual(newDetails);
      expect(state.items[0].description).toBe('Updated description');
    });

    it('does nothing when updating non-existent item', () => {
      const initialState = { items: [mockPokemonItem] };
      const details = mockPokemonItem.details;
      if (!details)
        throw new Error(
          'Test setup error: mockPokemonItem should have details'
        );

      const action = updateItemDetails({
        name: 'nonexistent',
        details,
        description: 'New description',
      });
      const state = selectedItemsReducer(initialState, action);

      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual(mockPokemonItem);
    });
  });
});
