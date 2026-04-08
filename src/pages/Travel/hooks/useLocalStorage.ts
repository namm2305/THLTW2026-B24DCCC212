import { useEffect, useState } from 'react';

export default function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }

    try {
      const stored = window.localStorage.getItem(key);
      if (stored) {
        setValue(JSON.parse(stored));
      }
    } catch (error) {
      console.warn(`useLocalStorage failed to read key ${key}:`, error);
    }
  }, [key]);

  const setStoredValue = (newValue: any) => {
    setValue(newValue);
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.warn(`useLocalStorage failed to write key ${key}:`, error);
    }
  };

  return [value, setStoredValue] as const;
}