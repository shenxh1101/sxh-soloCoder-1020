import type { GameEvent, Ship } from '../types/game';

type EventCallback = (event: GameEvent) => void;

class EventSystem {
  private listeners: EventCallback[] = [];
  private eventProbabilities: Record<string, number> = {
    storm: 0.05,
    shoal: 0.08,
    breakdown: 0.03,
    new_order: 0.1
  };

  subscribe(callback: EventCallback): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  emit(event: GameEvent): void {
    this.listeners.forEach((listener) => listener(event));
  }

  checkRandomEvents(ships: Ship[], weather: string): GameEvent | null {
    const sailingShips = ships.filter((s) => s.status === 'sailing');
    
    for (const ship of sailingShips) {
      if (weather === 'stormy' && Math.random() < this.eventProbabilities.storm * 2) {
        return {
          type: 'storm',
          shipId: ship.id,
          damage: Math.floor(Math.random() * 20) + 10,
          message: `${ship.name} 遭遇暴风雨袭击，船体受损！`
        };
      }

      if (Math.random() < this.eventProbabilities.shoal) {
        return {
          type: 'shoal',
          shipId: ship.id,
          delay: Math.floor(Math.random() * 30) + 10,
          message: `${ship.name} 搁浅在浅滩，需要等待脱困！`
        };
      }

      if (ship.condition < 50 && Math.random() < this.eventProbabilities.breakdown * 2) {
        return {
          type: 'breakdown',
          shipId: ship.id,
          repairCost: Math.floor(Math.random() * 500) + 200,
          message: `${ship.name} 引擎故障，需要紧急维修！`
        };
      }
    }

    if (Math.random() < this.eventProbabilities.new_order) {
      return null;
    }

    return null;
  }

  setEventProbability(eventType: string, probability: number): void {
    this.eventProbabilities[eventType] = probability;
  }
}

export const eventSystem = new EventSystem();
