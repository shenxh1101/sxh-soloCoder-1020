import type { GameState, BuildingConfig, ShipConfig } from '../types/game';

export const initialGameState: GameState = {
  gold: 5000,
  day: 1,
  weather: 'sunny',
  unlockedSections: ['section_a'],
  buildings: [
    { id: 'dock_1', type: 'dock', level: 1, position: { x: 2, y: 5 }, status: 'operational' },
    { id: 'warehouse_1', type: 'warehouse', level: 1, position: { x: 3, y: 3 }, status: 'operational' }
  ],
  captains: [
    { id: 'captain_pool_1', name: '老张', avatar: '👨‍✈️', level: 1, skill: 'navigation', skillLevel: 2, salary: 50, hired: false },
    { id: 'captain_pool_2', name: '李航海', avatar: '🧔', level: 2, skill: 'speed', skillLevel: 3, salary: 80, hired: false },
    { id: 'captain_pool_3', name: '王大副', avatar: '👨‍🦱', level: 1, skill: 'cargo', skillLevel: 2, salary: 60, hired: false },
    { id: 'captain_pool_4', name: '陈轮机', avatar: '👨‍🔧', level: 2, skill: 'maintenance', skillLevel: 3, salary: 70, hired: false }
  ],
  ships: [
    {
      id: 'ship_1', name: '海鸥号', type: 'small', capacity: 50, speed: 3,
      fuel: 100, maxFuel: 100, condition: 100, status: 'idle',
      position: { x: 2, y: 5 }, progress: 0,
      upgrades: { loading: 1, engine: 1, hull: 1 }
    }
  ],
  orders: [
    { id: 'order_1', cargo: { id: 'cargo_1', type: 'wood', name: '木材', weight: 30, value: 200, icon: '🪵' }, destination: '河口镇', distance: 5, reward: 300, status: 'available', difficulty: 'easy' },
    { id: 'order_2', cargo: { id: 'cargo_2', type: 'grain', name: '粮食', weight: 40, value: 300, icon: '🌾' }, destination: '山城', distance: 8, reward: 500, timeLimit: 120, deadline: 120, status: 'available', difficulty: 'medium' },
    { id: 'order_3', cargo: { id: 'cargo_3', type: 'coal', name: '煤炭', weight: 60, value: 450, icon: '⬛' }, destination: '工业区', distance: 10, reward: 700, status: 'available', difficulty: 'medium' },
    { id: 'order_4', cargo: { id: 'cargo_4', type: 'textiles', name: '纺织品', weight: 25, value: 600, icon: '🧵' }, destination: '丝绸镇', distance: 6, reward: 400, timeLimit: 90, deadline: 90, status: 'available', difficulty: 'easy' },
    { id: 'order_5', cargo: { id: 'cargo_5', type: 'machinery', name: '机械', weight: 80, value: 1200, icon: '⚙️' }, destination: '新城', distance: 15, reward: 1500, status: 'available', difficulty: 'hard' }
  ],
  cargo: [
    { id: 'stock_1', type: 'wood', name: '木材', weight: 100, value: 200, icon: '🪵' },
    { id: 'stock_2', type: 'coal', name: '煤炭', weight: 80, value: 350, icon: '⬛' },
    { id: 'stock_3', type: 'grain', name: '粮食', weight: 120, value: 300, icon: '🌾' }
  ],
  achievements: [
    { id: 'first_order', name: '首航成功', description: '完成第一笔订单', icon: '⭐', unlocked: false, reward: { type: 'gold', value: '500' }, condition: { type: 'orders', target: 1, current: 0 } },
    { id: 'ten_orders', name: '货运老手', description: '完成10笔订单', icon: '🏆', unlocked: false, reward: { type: 'music', value: 'sea_shanty' }, condition: { type: 'orders', target: 10, current: 0 } },
    { id: 'profit_10000', name: '小有积蓄', description: '累计利润达到10000', icon: '💰', unlocked: false, reward: { type: 'gold', value: '1000' }, condition: { type: 'profit', target: 10000, current: 0 } },
    { id: 'days_7', name: '经营一周', description: '连续经营7天', icon: '📅', unlocked: false, reward: { type: 'skin', value: 'captain_outfit' }, condition: { type: 'days', target: 7, current: 0 } },
    { id: 'ships_3', name: '船队初具', description: '拥有3艘船只', icon: '⛵', unlocked: false, reward: { type: 'decoration', value: 'lighthouse' }, condition: { type: 'ships', target: 3, current: 1 } },
    { id: 'buildings_5', name: '港口扩张', description: '建造5座建筑', icon: '🏗️', unlocked: false, reward: { type: 'gold', value: '2000' }, condition: { type: 'buildings', target: 5, current: 2 } },
    { id: 'fifty_orders', name: '航运大亨', description: '完成50笔订单', icon: '👑', unlocked: false, reward: { type: 'music', value: 'victory_march' }, condition: { type: 'orders', target: 50, current: 0 } },
    { id: 'profit_100000', name: '富甲一方', description: '累计利润达到100000', icon: '💎', unlocked: false, reward: { type: 'skin', value: 'admiral_uniform' }, condition: { type: 'profit', target: 100000, current: 0 } }
  ],
  dailyStats: []
};

export const buildingConfigs: BuildingConfig[] = [
  { type: 'dock', name: '码头', cost: 2000, description: '船只停泊和装卸货物的基础设施' },
  { type: 'warehouse', name: '仓库', cost: 1500, description: '存储货物，增加库存容量' },
  { type: 'decoration', name: '装饰', cost: 500, description: '美化小镇，提升居民幸福度' }
];

export const shipConfigs: ShipConfig[] = [
  { type: 'small', name: '小型货船', cost: 3000, capacity: 50, speed: 3, description: '灵活轻便，适合短程运输' },
  { type: 'medium', name: '中型货船', cost: 8000, capacity: 100, speed: 2, description: '容量适中，性价比之选' },
  { type: 'large', name: '大型货船', cost: 15000, capacity: 200, speed: 1, description: '载货量大，适合长途运输' }
];

export const sectionConfigs = [
  { id: 'section_a', name: 'A段河道', cost: 0, unlocked: true, description: '初始河段，连接附近小镇' },
  { id: 'section_b', name: 'B段河道', cost: 5000, unlocked: false, description: '通往工业区，订单报酬更高' },
  { id: 'section_c', name: 'C段河道', cost: 12000, unlocked: false, description: '远洋航线，稀有货物' }
];

export const upgradeCosts = {
  loading: [0, 500, 1500, 3000],
  engine: [0, 800, 2000, 4000],
  hull: [0, 600, 1800, 3500]
};

export const musicTracks = [
  { id: 'default', name: '港湾微风', unlocked: true },
  { id: 'sea_shanty', name: '水手号子', unlocked: false },
  { id: 'victory_march', name: '胜利进行曲', unlocked: false }
];

export const skins = [
  { id: 'default', name: '默认船长', unlocked: true },
  { id: 'captain_outfit', name: '经典船长服', unlocked: false },
  { id: 'admiral_uniform', name: '海军上将制服', unlocked: false }
];

export const decorations = [
  { id: 'default', name: '基础装饰', unlocked: true },
  { id: 'lighthouse', name: '灯塔', unlocked: false },
  { id: 'statue', name: '海神雕像', unlocked: false }
];

export const destinationPositions: Record<string, { x: number; y: number }> = {
  '河口镇': { x: 10, y: 2 },
  '山城': { x: 11, y: 6 },
  '工业区': { x: 9, y: 1 },
  '丝绸镇': { x: 8, y: 7 },
  '新城': { x: 11, y: 0 }
};
