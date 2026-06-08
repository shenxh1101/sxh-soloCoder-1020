import type { GameState } from '../types/game';

const STORAGE_KEY = 'harbor_years_save';

export const saveGame = (state: GameState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save game:', error);
  }
};

export const loadGame = (): GameState | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error('Failed to load game:', error);
    return null;
  }
};

export const hasSavedGame = (): boolean => {
  return localStorage.getItem(STORAGE_KEY) !== null;
};

export const clearSave = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

let saveTimeout: ReturnType<typeof setTimeout> | null = null;

export const throttledSave = (state: GameState, delay: number = 2000): void => {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  saveTimeout = setTimeout(() => {
    saveGame(state);
  }, delay);
};
