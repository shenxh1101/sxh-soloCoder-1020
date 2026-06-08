import { create } from 'zustand';
import type { UIState, GameEvent, Notification } from '../types/game';

interface UIStore extends UIState {
  setCurrentPage: (page: string) => void;
  showEvent: (event: GameEvent) => void;
  hideEvent: () => void;
  toggleSettings: () => void;
  setSelectedShipId: (shipId: string | null) => void;
  setSelectedCaptainId: (captainId: string | null) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  currentPage: 'main-menu',
  showEventPopup: false,
  currentEvent: null,
  showSettings: false,
  selectedShipId: null,
  selectedCaptainId: null,
  notifications: [],

  setCurrentPage: (page) => set({ currentPage: page }),

  showEvent: (event) => set({ showEventPopup: true, currentEvent: event }),

  hideEvent: () => set({ showEventPopup: false, currentEvent: null }),

  toggleSettings: () => set((state) => ({ showSettings: !state.showSettings })),

  setSelectedShipId: (shipId) => set({ selectedShipId: shipId }),

  setSelectedCaptainId: (captainId) => set({ selectedCaptainId: captainId }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { ...notification, id: `notif_${Date.now()}_${Math.random()}` }
      ]
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id)
    })),

  clearNotifications: () => set({ notifications: [] })
}));
