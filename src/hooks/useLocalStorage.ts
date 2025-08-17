import { useState } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return initialValue;

      if (typeof initialValue === 'string') {
        return item as T;
      }

      return JSON.parse(item);
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);

      if (typeof value === 'string') {
        localStorage.setItem(key, value as string);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
