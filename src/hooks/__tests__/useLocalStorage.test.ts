import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../useLocalStorage';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useLocalStorage Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial Value Handling', () => {
    it('returns initial value when localStorage is empty', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'default-value')
      );

      expect(result.current[0]).toBe('default-value');
      expect(localStorageMock.getItem).toHaveBeenCalledWith('test-key');
    });

    it('returns raw string value from localStorage when available', () => {
      localStorageMock.getItem.mockReturnValue('stored-value');

      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'default-value')
      );

      expect(result.current[0]).toBe('stored-value');
      expect(localStorageMock.getItem).toHaveBeenCalledWith('test-key');
    });

    it('handles complex objects from localStorage', () => {
      const storedObject = { name: 'pikachu', level: 25 };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(storedObject));

      const { result } = renderHook(() => useLocalStorage('pokemon-data', {}));

      expect(result.current[0]).toEqual(storedObject);
    });

    it('returns initial value and logs error when JSON parsing fails', () => {
      localStorageMock.getItem.mockReturnValue('invalid-json');
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const { result } = renderHook(() => useLocalStorage('test-key', {})); // Use object for JSON parsing

      expect(result.current[0]).toEqual({});
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error loading localStorage key "test-key":',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Value Setting', () => {
    it('updates state and localStorage when setValue is called with string', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'initial')
      );

      act(() => {
        result.current[1]('new-value');
      });

      expect(result.current[0]).toBe('new-value');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'test-key',
        'new-value' // Raw string, not JSON
      );
    });

    it('stores complex objects correctly with JSON', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useLocalStorage('pokemon-data', {}));

      const newPokemon = { name: 'charizard', type: 'fire' };

      act(() => {
        result.current[1](newPokemon);
      });

      expect(result.current[0]).toEqual(newPokemon);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'pokemon-data',
        JSON.stringify(newPokemon)
      );
    });

    it('handles localStorage errors gracefully when setting values', () => {
      localStorageMock.getItem.mockReturnValue(null);
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage full');
      });
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'initial')
      );

      act(() => {
        result.current[1]('new-value');
      });

      // State should still update even if localStorage fails
      expect(result.current[0]).toBe('new-value');
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error setting localStorage key "test-key":',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('TypeScript Generics', () => {
    it('works with string types', () => {
      localStorageMock.getItem.mockReturnValue('test-string');

      const { result } = renderHook(() =>
        useLocalStorage<string>('string-key', '')
      );

      expect(typeof result.current[0]).toBe('string');
      expect(result.current[0]).toBe('test-string');
    });

    it('works with number types', () => {
      localStorageMock.getItem.mockReturnValue('42');

      const { result } = renderHook(() =>
        useLocalStorage<number>('number-key', 0)
      );

      expect(typeof result.current[0]).toBe('number');
      expect(result.current[0]).toBe(42);
    });

    it('works with boolean types', () => {
      localStorageMock.getItem.mockReturnValue('true');

      const { result } = renderHook(() =>
        useLocalStorage<boolean>('boolean-key', false)
      );

      expect(typeof result.current[0]).toBe('boolean');
      expect(result.current[0]).toBe(true);
    });

    it('works with custom object types', () => {
      interface PokemonData {
        name: string;
        level: number;
      }

      const storedPokemon: PokemonData = { name: 'bulbasaur', level: 5 };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(storedPokemon));

      const { result } = renderHook(() =>
        useLocalStorage<PokemonData>('pokemon-key', { name: '', level: 0 })
      );

      expect(result.current[0]).toEqual(storedPokemon);
      expect(result.current[0].name).toBe('bulbasaur');
      expect(result.current[0].level).toBe(5);
    });
  });
});
