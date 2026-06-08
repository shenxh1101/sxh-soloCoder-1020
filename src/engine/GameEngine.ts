import type { GameState, Ship, Order } from '../types/game';
import { destinationPositions } from '../data/mockData';
import { lerpPosition } from '../utils/animation';
import { eventSystem } from './EventSystem';

export class GameEngine {
  private gameState: GameState;
  private onStateChange: (state: Partial<GameState>) => void;
  private dayTimer: number = 0;
  private readonly DAY_DURATION: number = 60000;

  constructor(
    initialState: GameState,
    onStateChange: (state: Partial<GameState>) => void
  ) {
    this.gameState = initialState;
    this.onStateChange = onStateChange;
  }

  updateState(newState: Partial<GameState>): void {
    this.gameState = { ...this.gameState, ...newState };
  }

  tick(deltaTime: number): void {
    this.dayTimer += deltaTime;
    
    if (this.dayTimer >= this.DAY_DURATION) {
      this.dayTimer = 0;
    }

    this.updateShips(deltaTime);
    this.updateOrders(deltaTime);
    this.checkEvents();
  }

  private updateShips(deltaTime: number): void {
    const updatedShips: Ship[] = this.gameState.ships.map((ship) => {
      if (ship.status === 'sailing' && ship.targetPosition) {
        const shipCopy = { ...ship };
        const speedFactor = ship.speed * (ship.upgrades.engine / 100 + 1);
        const movement = (deltaTime / 1000) * speedFactor * 0.5;
        
        shipCopy.progress = Math.min(1, shipCopy.progress + movement / 10);
        
        if (shipCopy.progress >= 1) {
          shipCopy.position = { ...shipCopy.targetPosition! };
          shipCopy.status = 'idle';
          shipCopy.targetPosition = undefined;
        } else {
          const dock = this.gameState.buildings.find(
            (b) => b.type === 'dock' && b.status === 'operational'
          );
          const startPos = dock ? { x: dock.position.x, y: dock.position.y } : ship.position;
          
          shipCopy.position = lerpPosition(
            startPos,
            shipCopy.targetPosition!,
            shipCopy.progress
          );
        }
        
        return shipCopy;
      }
      
      if (ship.status === 'loading') {
        const shipCopy = { ...ship };
        const loadSpeed = (ship.upgrades.loading / 100 + 1) * 0.5;
        shipCopy.progress = Math.min(1, shipCopy.progress + (deltaTime / 1000) * loadSpeed);
        
        if (shipCopy.progress >= 1) {
          const order = this.gameState.orders.find(
            (o) => o.id === shipCopy.currentOrder
          );
          if (order) {
            const targetPos = destinationPositions[order.destination];
            if (targetPos) {
              shipCopy.status = 'sailing';
              shipCopy.targetPosition = targetPos;
              shipCopy.progress = 0;
            }
          }
        }
        
        return shipCopy;
      }

      if (ship.status === 'repairing') {
        const shipCopy = { ...ship };
        shipCopy.progress = Math.min(1, shipCopy.progress + (deltaTime / 1000) * 0.3);
        
        if (shipCopy.progress >= 1) {
          shipCopy.status = 'idle';
          shipCopy.progress = 0;
          shipCopy.condition = Math.min(100, shipCopy.condition + 30);
        }
        
        return shipCopy;
      }
      
      return ship;
    });

    this.onStateChange({ ships: updatedShips });
    this.gameState.ships = updatedShips;
  }

  private updateOrders(deltaTime: number): void {
    const updatedOrders: Order[] = this.gameState.orders.map((order) => {
      if (order.status === 'accepted' && order.deadline !== undefined) {
        const newDeadline = order.deadline - deltaTime / 1000;
        if (newDeadline <= 0) {
          return { ...order, deadline: 0, status: 'failed' as const };
        }
        return { ...order, deadline: newDeadline };
      }
      return order;
    });

    const failedOrders = updatedOrders.filter(
      (o, i) => o.status === 'failed' && this.gameState.orders[i]?.status !== 'failed'
    );

    if (failedOrders.length > 0) {
      failedOrders.forEach((order) => {
        const ship = this.gameState.ships.find((s) => s.currentOrder === order.id);
        if (ship) {
          const updatedShips = this.gameState.ships.map((s) =>
            s.id === ship.id
              ? { ...s, status: 'idle' as const, currentOrder: undefined, progress: 0 }
              : s
          );
          this.onStateChange({ ships: updatedShips });
          this.gameState.ships = updatedShips;
        }
      });
    }

    this.onStateChange({ orders: updatedOrders });
    this.gameState.orders = updatedOrders;
  }

  private checkEvents(): void {
    const event = eventSystem.checkRandomEvents(
      this.gameState.ships,
      this.gameState.weather
    );
    
    if (event) {
      eventSystem.emit(event);
    }
  }

  getDayProgress(): number {
    return this.dayTimer / this.DAY_DURATION;
  }

  startShipSailing(shipId: string, orderId: string): boolean {
    const ship = this.gameState.ships.find((s) => s.id === shipId);
    const order = this.gameState.orders.find((o) => o.id === orderId);
    
    if (!ship || !order || ship.status !== 'idle') return false;
    
    const targetPos = destinationPositions[order.destination];
    if (!targetPos) return false;

    const updatedShips = this.gameState.ships.map((s) =>
      s.id === shipId
        ? {
            ...s,
            status: 'loading' as const,
            currentOrder: orderId,
            progress: 0
          }
        : s
    );

    const updatedOrders = this.gameState.orders.map((o) =>
      o.id === orderId ? { ...o, status: 'accepted' as const } : o
    );

    this.onStateChange({ ships: updatedShips, orders: updatedOrders });
    this.gameState.ships = updatedShips;
    this.gameState.orders = updatedOrders;
    
    return true;
  }

  repairShip(shipId: string): boolean {
    const ship = this.gameState.ships.find((s) => s.id === shipId);
    if (!ship || ship.condition >= 100) return false;

    const repairCost = Math.floor((100 - ship.condition) * 10);
    
    const updatedShips = this.gameState.ships.map((s) =>
      s.id === shipId ? { ...s, status: 'repairing' as const, progress: 0 } : s
    );

    this.onStateChange({ ships: updatedShips });
    this.gameState.ships = updatedShips;
    
    return true;
  }

  refuelShip(shipId: string, amount: number): boolean {
    const ship = this.gameState.ships.find((s) => s.id === shipId);
    if (!ship || ship.fuel >= ship.maxFuel) return false;

    const fuelCost = amount * 2;
    
    const updatedShips = this.gameState.ships.map((s) =>
      s.id === shipId
        ? { ...s, fuel: Math.min(s.maxFuel, s.fuel + amount) }
        : s
    );

    this.onStateChange({ ships: updatedShips });
    this.gameState.ships = updatedShips;
    
    return true;
  }
}
