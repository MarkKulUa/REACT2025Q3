import { configureStore } from '@reduxjs/toolkit';
import { rtkPokemonApi } from './rtkPokemonApi';
import selectedItemsReducer from './slices/selectedItemsSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      selectedItems: selectedItemsReducer,
      [rtkPokemonApi.reducerPath]: rtkPokemonApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(rtkPokemonApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
