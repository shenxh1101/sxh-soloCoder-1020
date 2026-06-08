import { create } from 'zustand';
import type { GameState, Building, Captain, Ship, Order, Achievement, DailyStat, CargoItem, GameEvent } from '../types/game';
import { initialGameState } from '../data/mockData';
import { loadGame, throttledSave } from '../utils/storage';
import { audioManager } from '../utils/audio';

interface GameStore extends GameState {
  setGameState: (state: Partial<GameState>) => void;
  resetGame: () => void;
  loadSavedGame: () => boolean;
  addGold: (amount: number) => void;
  spendGold: (amount: number) => boolean;
  addBuilding: (building: Building) => void;
  upgradeBuilding: (buildingId: string) => void;
  hireCaptain: (captainId: string) => boolean;
  fireCaptain: (captainId: string) => void;
  assignCaptainToShip: (captainId: string, shipId: string) => void;
  addShip: (ship: Ship, cost: number) => boolean;
  updateShip: (shipId: string, updates: Partial<Ship>) => void;
  upgradeShip: (shipId: string, upgradeKey: 'loading' | 'engine' | 'hull', cost: number) => boolean;
  acceptOrder: (orderId: string, shipId: string) => boolean;
  completeOrder: (orderId: string) => void;
  failOrder: (orderId: string) => void;
  addCargo: (cargo: CargoItem, cost: number) => boolean;
  removeCargo: (cargoId: string, weight: number, cost: number) => boolean;
  unlockAchievement: (achievementId: string) => void;
  updateAchievementProgress: (type: string, value: number) => void;
  addDailyStat: (stat: DailyStat) => void;
  unlockSection: (sectionId: string) => boolean;
  handleEvent: (event: GameEvent) => void;
  advanceDay: () => void;
  setWeather: (weather: GameState['weather']) => void;
}

export const useGameStore = create<GameStore>((set, get) => {
  const saveAndNotify = () => {
    const state = get();
    throttledSave({
      gold: state.gold,
      day: state.day,
      weather: state.weather,
      unlockedSections: state.unlockedSections,
      buildings: state.buildings,
      captains: state.captains,
      ships: state.ships,
      orders: state.orders,
      cargo: state.cargo,
      achievements: state.achievements,
      dailyStats: state.dailyStats
    });
  };

  return {
    ...initialGameState,

    setGameState: (state) => {
      set(state);
      saveAndNotify();
    },

    resetGame: () => {
      set(initialGameState);
      saveAndNotify();
    },

    loadSavedGame: () => {
      const saved = loadGame();
      if (saved) {
        set(saved);
        return true;
      }
      return false;
    },

    addGold: (amount) => {
      set((state) => ({ gold: state.gold + amount }));
      audioManager.playCoin();
      saveAndNotify();
    },

    spendGold: (amount) => {
      const state = get();
      if (state.gold >= amount) {
        set((s) => ({ gold: s.gold - amount }));
        saveAndNotify();
        return true;
      }
      audioManager.playError();
      return false;
    },

    addBuilding: (building) => {
      set((state) => ({ buildings: [...state.buildings, building] }));
      get().updateAchievementProgress('buildings', get().buildings.length);
      audioManager.playSuccess();
      saveAndNotify();
    },

    upgradeBuilding: (buildingId) => {
      set((state) => ({
        buildings: state.buildings.map((b) =>
          b.id === buildingId && b.level < 3
            ? { ...b, level: (b.level + 1) as 1 | 2 | 3 }
            : b
        )
      }));
      audioManager.playSuccess();
      saveAndNotify();
    },

    hireCaptain: (captainId) => {
      const state = get();
      const captain = state.captains.find((c) => c.id === captainId);
      if (!captain || captain.hired) return false;
      
      const hireCost = captain.salary * 10;
      if (state.gold < hireCost) {
        audioManager.playError();
        return false;
      }

      set((s) => ({
        gold: s.gold - hireCost,
        captains: s.captains.map((c) =>
          c.id === captainId ? { ...c, hired: true } : c
        )
      }));
      audioManager.playSuccess();
      saveAndNotify();
      return true;
    },

    fireCaptain: (captainId) => {
      set((state) => ({
        captains: state.captains.map((c) =>
          c.id === captainId ? { ...c, hired: false, shipId: undefined } : c
        )
      }));
      saveAndNotify();
    },

    assignCaptainToShip: (captainId, shipId) => {
      set((state) => ({
        captains: state.captains.map((c) =>
          c.id === captainId ? { ...c, shipId } : c
        )
      }));
      audioManager.playClick();
      saveAndNotify();
    },

    addShip: (ship, cost) => {
      const state = get();
      if (state.gold < cost) {
        audioManager.playError();
        return false;
      }

      set((s) => ({
        gold: s.gold - cost,
        ships: [...s.ships, ship]
      }));
      get().updateAchievementProgress('ships', get().ships.length);
      audioManager.playSuccess();
      saveAndNotify();
      return true;
    },

    updateShip: (shipId, updates) => {
      set((state) => ({
        ships: state.ships.map((s) =>
          s.id === shipId ? { ...s, ...updates } : s
        )
      }));
      saveAndNotify();
    },

    upgradeShip: (shipId, upgradeKey, cost) => {
      const state = get();
      const ship = state.ships.find(s => s.id === shipId);
      
      if (!ship || state.gold < cost) {
        audioManager.playError();
        return false;
      }

      const currentLevel = ship.upgrades[upgradeKey];
      if (currentLevel >= 3) {
        audioManager.playError();
        return false;
      }

      set((s) => ({
        gold: s.gold - cost,
        ships: s.ships.map((s) =>
          s.id === shipId
            ? {
                ...s,
                upgrades: {
                  ...s.upgrades,
                  [upgradeKey]: currentLevel + 1
                }
              }
            : s
        )
      }));
      audioManager.playSuccess();
      saveAndNotify();
      return true;
    },

    acceptOrder: (orderId, shipId) => {
      const state = get();
      const order = state.orders.find((o) => o.id === orderId);
      const ship = state.ships.find((s) => s.id === shipId);
      
      if (!order || !ship || order.status !== 'available' || ship.status !== 'idle') {
        audioManager.playError();
        return false;
      }
      
      if (ship.capacity < order.cargo.weight) {
        audioManager.playError();
        return false;
      }

      const fuelCost = Math.floor(order.distance * 2);
      if (ship.fuel < fuelCost) {
        audioManager.playError();
        return false;
      }

      set((s) => ({
        orders: s.orders.map((o) =>
          o.id === orderId ? { ...o, status: 'accepted' as const } : o
        ),
        ships: s.ships.map((s) =>
          s.id === shipId
            ? { ...s, status: 'loading' as const, currentOrder: orderId, fuel: s.fuel - fuelCost }
            : s
        )
      }));
      audioManager.playClick();
      saveAndNotify();
      return true;
    },

    completeOrder: (orderId) => {
      const state = get();
      const order = state.orders.find((o) => o.id === orderId);
      if (!order) return;

      const currentDay = state.day;
      
      set((s) => ({
        orders: s.orders.map((o) =>
          o.id === orderId ? { ...o, status: 'completed' as const, completedDay: currentDay } : o
        ),
        ships: s.ships.map((s) =>
          s.currentOrder === orderId
            ? { ...s, status: 'idle' as const, currentOrder: undefined, progress: 0 }
            : s
        ),
        gold: s.gold + order.reward
      }));

      get().updateAchievementProgress('orders', 1);
      get().updateAchievementProgress('profit', order.reward);
      audioManager.playSuccess();
      saveAndNotify();
    },

    failOrder: (orderId) => {
      set((state) => ({
        orders: state.orders.map((o) =>
          o.id === orderId ? { ...o, status: 'failed' as const } : o
        ),
        ships: state.ships.map((s) =>
          s.currentOrder === orderId
            ? { ...s, status: 'idle' as const, currentOrder: undefined, progress: 0 }
            : s
        )
      }));
      audioManager.playError();
      saveAndNotify();
    },

    addCargo: (cargo, cost) => {
      const state = get();
      if (state.gold < cost) {
        audioManager.playError();
        return false;
      }

      set((s) => ({
        gold: s.gold - cost,
        cargo: [...s.cargo, cargo]
      }));
      audioManager.playSuccess();
      saveAndNotify();
      return true;
    },

    removeCargo: (cargoId, weight, cost) => {
      const state = get();
      const cargo = state.cargo.find(c => c.id === cargoId);
      
      if (!cargo || cargo.weight < weight || state.gold < cost) {
        audioManager.playError();
        return false;
      }

      set((s) => ({
        gold: s.gold - cost,
        cargo: s.cargo
          .map((c) =>
            c.id === cargoId ? { ...c, weight: c.weight - weight } : c
          )
          .filter((c) => c.weight > 0)
      }));
      audioManager.playClick();
      saveAndNotify();
      return true;
    },

    unlockAchievement: (achievementId) => {
      const state = get();
      const achievement = state.achievements.find((a) => a.id === achievementId);
      if (!achievement || achievement.unlocked) return;

      set((s) => ({
        achievements: s.achievements.map((a) =>
          a.id === achievementId ? { ...a, unlocked: true } : a
        )
      }));

      if (achievement.reward.type === 'gold') {
        set((s) => ({ gold: s.gold + parseInt(achievement.reward.value) }));
      }

      audioManager.playAchievement();
      saveAndNotify();
    },

    updateAchievementProgress: (type, value) => {
      const state = get();
      state.achievements.forEach((achievement) => {
        if (achievement.condition.type === type && !achievement.unlocked) {
          const newCurrent = achievement.condition.current + value;
          if (newCurrent >= achievement.condition.target) {
            get().unlockAchievement(achievement.id);
          } else {
            set((s) => ({
              achievements: s.achievements.map((a) =>
                a.id === achievement.id
                  ? { ...a, condition: { ...a.condition, current: newCurrent } }
                  : a
              )
            }));
          }
        }
      });
    },

    addDailyStat: (stat) => {
      set((state) => ({ dailyStats: [...state.dailyStats, stat] }));
      saveAndNotify();
    },

    unlockSection: (sectionId) => {
      const costs: Record<string, number> = {
        section_b: 5000,
        section_c: 12000
      };
      const cost = costs[sectionId];
      
      if (!cost || get().gold < cost) {
        audioManager.playError();
        return false;
      }

      set((state) => ({
        gold: state.gold - cost,
        unlockedSections: [...state.unlockedSections, sectionId]
      }));
      audioManager.playSuccess();
      saveAndNotify();
      return true;
    },

    handleEvent: (event) => {
      if (event.type === 'storm' && event.shipId) {
        get().updateShip(event.shipId, {
          condition: Math.max(0, get().ships.find(s => s.id === event.shipId)!.condition - (event.damage || 10))
        });
      } else if (event.type === 'breakdown' && event.shipId && event.repairCost) {
        if (get().spendGold(event.repairCost)) {
          get().updateShip(event.shipId, { status: 'repairing' });
        }
      } else if (event.type === 'new_order' && event.order) {
        set((state) => ({ orders: [...state.orders, event.order!] }));
      }
      saveAndNotify();
    },

    advanceDay: () => {
      const state = get();
      const currentDay = state.day;
      
      const dailyExpense = state.captains
        .filter((c) => c.hired)
        .reduce((sum, c) => sum + c.salary, 0);
      
      const todaysCompletedOrders = state.orders.filter(
        (o) => o.status === 'completed' && o.completedDay === currentDay
      );
      
      const dailyIncome = todaysCompletedOrders.reduce((sum, o) => sum + o.reward, 0);
      const todaysOrdersCount = todaysCompletedOrders.length;

      const newDay = currentDay + 1;
      const profit = dailyIncome - dailyExpense;

      get().addDailyStat({
        day: currentDay,
        income: dailyIncome,
        expense: dailyExpense,
        ordersCompleted: todaysOrdersCount,
        profit
      });

      set((s) => ({
        day: newDay,
        gold: s.gold - dailyExpense,
        weather: ['sunny', 'rainy', 'stormy'][Math.floor(Math.random() * 3)] as GameState['weather']
      }));

      get().updateAchievementProgress('days', 1);
      audioManager.playWave();
      saveAndNotify();
    },

    setWeather: (weather) => {
      set({ weather });
      saveAndNotify();
    }
  };
});
