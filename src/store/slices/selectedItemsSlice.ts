import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Pokemon, PokemonDetails } from '../../types/pokemon';

export interface SelectedPokemonItem {
  pokemon: Pokemon;
  details?: PokemonDetails;
  description?: string;
}

export interface SelectedItemsState {
  items: SelectedPokemonItem[];
}

const initialState: SelectedItemsState = {
  items: [],
};

const selectedItemsSlice = createSlice({
  name: 'selectedItems',
  initialState,
  reducers: {
    addSelectedItem: (state, action: PayloadAction<SelectedPokemonItem>) => {
      const exists = state.items.some(
        (item) => item.pokemon.name === action.payload.pokemon.name
      );
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    removeSelectedItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.pokemon.name !== action.payload
      );
    },
    clearSelectedItems: (state) => {
      state.items = [];
    },
    updateItemDetails: (
      state,
      action: PayloadAction<{
        name: string;
        details: PokemonDetails;
        description: string;
      }>
    ) => {
      const item = state.items.find(
        (item) => item.pokemon.name === action.payload.name
      );
      if (item) {
        item.details = action.payload.details;
        item.description = action.payload.description;
      }
    },
  },
});

export const {
  addSelectedItem,
  removeSelectedItem,
  clearSelectedItems,
  updateItemDetails,
} = selectedItemsSlice.actions;

export default selectedItemsSlice.reducer;
