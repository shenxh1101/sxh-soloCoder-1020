export type Weather = 'sunny' | 'rainy' | 'stormy';
export type BuildingType = 'dock' | 'warehouse' | 'decoration';
export type BuildingStatus = 'building' | 'operational' | 'damaged';
export type SkillType = 'speed' | 'cargo' | 'navigation' | 'maintenance';
export type ShipType = 'small' | 'medium' | 'large';
export type ShipStatus = 'idle' | 'sailing' | 'loading' | 'repairing';
export type CargoType = 'wood' | 'coal' | 'grain' | 'textiles' | 'machinery' | 'luxury';
export type OrderStatus = 'available' | 'accepted' | 'completed' | 'failed';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type AchievementRewardType = 'music' | 'skin' | 'decoration' | 'gold';
export type AchievementConditionType = 'orders' | 'profit' | 'days' | 'ships' | 'buildings';
export type GameEventType = 'storm' | 'shoal' | 'breakdown' | 'new_order';

export interface Position {
  x: number;
  y: number;
}

export interface Building {
  id: string;
  type: BuildingType;
  level: 1 | 2 | 3;
  position: Position;
  status: BuildingStatus;
  buildProgress?: number;
}

export interface Captain {
  id: string;
  name: string;
  avatar: string;
  level: number;
  skill: SkillType;
  skillLevel: number;
  salary: number;
  shipId?: string;
  hired: boolean;
}

export interface ShipUpgrades {
  loading: number;
  engine: number;
  hull: number;
}

export interface Ship {
  id: string;
  name: string;
  type: ShipType;
  capacity: number;
  speed: number;
  fuel: number;
  maxFuel: number;
  condition: number;
  status: ShipStatus;
  position: Position;
  targetPosition?: Position;
  currentOrder?: string;
  progress: number;
  upgrades: ShipUpgrades;
}

export interface CargoItem {
  id: string;
  type: CargoType;
  name: string;
  weight: number;
  value: number;
  icon: string;
}

export interface Order {
  id: string;
  cargo: CargoItem;
  destination: string;
  distance: number;
  reward: number;
  timeLimit?: number;
  deadline?: number;
  status: OrderStatus;
  difficulty: Difficulty;
}

export interface AchievementCondition {
  type: AchievementConditionType;
  target: number;
  current: number;
}

export interface AchievementReward {
  type: AchievementRewardType;
  value: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  reward: AchievementReward;
  condition: AchievementCondition;
}

export interface DailyStat {
  day: number;
  income: number;
  expense: number;
  ordersCompleted: number;
  profit: number;
}

export interface GameState {
  gold: number;
  day: number;
  weather: Weather;
  unlockedSections: string[];
  buildings: Building[];
  captains: Captain[];
  ships: Ship[];
  orders: Order[];
  cargo: CargoItem[];
  achievements: Achievement[];
  dailyStats: DailyStat[];
}

export interface GameEvent {
  type: GameEventType;
  shipId?: string;
  damage?: number;
  delay?: number;
  repairCost?: number;
  order?: Order;
  message: string;
}

export interface UIState {
  currentPage: string;
  showEventPopup: boolean;
  currentEvent: GameEvent | null;
  showSettings: boolean;
  selectedShipId: string | null;
  selectedCaptainId: string | null;
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  message: string;
}

export interface BuildingConfig {
  type: BuildingType;
  name: string;
  cost: number;
  description: string;
}

export interface ShipConfig {
  type: ShipType;
  name: string;
  cost: number;
  capacity: number;
  speed: number;
  description: string;
}

export interface GameEngine {
  tick(deltaTime: number): void;
  handleEvent(event: GameEvent): void;
  completeOrder(orderId: string): void;
  failOrder(orderId: string): void;
}
