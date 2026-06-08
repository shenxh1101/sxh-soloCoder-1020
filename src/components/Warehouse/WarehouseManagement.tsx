import React, { useState } from 'react';
import { Package, Warehouse, TrendingUp, TrendingDown, ArrowRight, Plus, Minus } from 'lucide-react';
import { PixelPanel } from '../shared/PixelPanel';
import { PixelButton } from '../shared/PixelButton';
import { TopBar } from '../shared/TopBar';
import { BottomNav } from '../shared/BottomNav';
import { ProgressBar } from '../shared/ProgressBar';
import { CargoCard } from './CargoCard';
import { WarehouseCard } from './WarehouseCard';
import { useGameStore } from '../../store/useGameStore';
import { audioManager } from '../../utils/audio';

type TabType = 'cargo' | 'warehouses';

export const WarehouseManagement: React.FC = () => {
  const { cargo, buildings, gold } = useGameStore();
  const [activeTab, setActiveTab] = useState<TabType>('cargo');

  const warehouses = buildings.filter(b => b.type === 'warehouse');
  const docks = buildings.filter(b => b.type === 'dock');

  const totalCapacity = warehouses.reduce((sum, w) => sum + w.level * 200, 0);
  const totalUsed = cargo.reduce((sum, c) => sum + c.weight, 0);
  const capacityPercent = totalCapacity > 0 ? Math.min(100, (totalUsed / totalCapacity) * 100) : 0;

  const cargoValue = cargo.reduce((sum, c) => sum + c.weight * c.value, 0);

  const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
    { key: 'cargo', label: '库存管理', icon: <Package className="w-4 h-4" /> },
    { key: 'warehouses', label: '仓库调度', icon: <Warehouse className="w-4 h-4" /> }
  ];

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    audioManager.playClick();
  };

  return (
    <div className="min-h-screen bg-#0f1729 pb-20">
      <TopBar />
      
      <div className="container mx-auto p-4 max-w-4xl">
        <PixelPanel variant="wood" className="mb-4">
          <div className="p-4">
            <h2 className="font-pixel text-lg text-f0e6d2 mb-4">🏭 仓库调度</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div
                className="p-3 text-center"
                style={{
                  backgroundColor: '#1a2744',
                  border: '2px solid #0a1724',
                  boxShadow: '2px 2px 0 #0a1724'
                }}
              >
                <div className="text-2xl mb-1">📦</div>
                <div className="font-pixel text-xs text-a0a0a0">仓库数量</div>
                <div className="font-pixel text-sm text-f0e6d2">{warehouses.length}</div>
              </div>
              <div
                className="p-3 text-center"
                style={{
                  backgroundColor: '#1a2744',
                  border: '2px solid #0a1724',
                  boxShadow: '2px 2px 0 #0a1724'
                }}
              >
                <div className="text-2xl mb-1">⚓</div>
                <div className="font-pixel text-xs text-a0a0a0">码头数量</div>
                <div className="font-pixel text-sm text-f0e6d2">{docks.length}</div>
              </div>
              <div
                className="p-3 text-center"
                style={{
                  backgroundColor: '#1a2744',
                  border: '2px solid #0a1724',
                  boxShadow: '2px 2px 0 #0a1724'
                }}
              >
                <div className="text-2xl mb-1">📊</div>
                <div className="font-pixel text-xs text-a0a0a0">库存总值</div>
                <div className="font-pixel text-sm text-e8c170">💰 {cargoValue}</div>
              </div>
              <div
                className="p-3 text-center"
                style={{
                  backgroundColor: '#1a2744',
                  border: '2px solid #0a1724',
                  boxShadow: '2px 2px 0 #0a1724'
                }}
              >
                <div className="text-2xl mb-1">🔒</div>
                <div className="font-pixel text-xs text-a0a0a0">可用容量</div>
                <div className="font-pixel text-sm text-6a8c5f">{totalCapacity - totalUsed} 吨</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-pixel text-xs text-a0a0a0">总存储容量</span>
                <span className="font-pixel text-xs text-f0e6d2">
                  {totalUsed} / {totalCapacity} 吨
                </span>
              </div>
              <ProgressBar
                value={totalUsed}
                max={totalCapacity}
                size="md"
                color={capacityPercent > 80 ? '#e06c75' : '#6a8c5f'}
              />
            </div>

            <div className="flex gap-2">
              {tabs.map(tab => (
                <PixelButton
                  key={tab.key}
                  size="sm"
                  variant={activeTab === tab.key ? 'primary' : 'secondary'}
                  onClick={() => handleTabChange(tab.key)}
                >
                  {tab.icon}
                  <span className="ml-1">{tab.label}</span>
                </PixelButton>
              ))}
            </div>
          </div>
        </PixelPanel>

        {activeTab === 'cargo' && (
          cargo.length > 0 ? (
            <div className="grid gap-4">
              {cargo.map(item => (
                <CargoCard key={item.id} cargo={item} warehouses={warehouses} />
              ))}
            </div>
          ) : (
            <PixelPanel variant="dark" className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="font-pixel text-sm text-a0a0a0">暂无库存</p>
              <p className="font-pixel text-xs text-a0a0a0 mt-2">完成订单后货物将自动入库</p>
            </PixelPanel>
          )
        )}

        {activeTab === 'warehouses' && (
          warehouses.length > 0 ? (
            <div className="grid gap-4">
              {warehouses.map(warehouse => (
                <WarehouseCard key={warehouse.id} warehouse={warehouse} />
              ))}
            </div>
          ) : (
            <PixelPanel variant="dark" className="text-center py-12">
              <div className="text-6xl mb-4">🏗️</div>
              <p className="font-pixel text-sm text-a0a0a0">暂无仓库</p>
              <p className="font-pixel text-xs text-a0a0a0 mt-2">前往港口地图建造仓库</p>
            </PixelPanel>
          )
        )}
      </div>

      <BottomNav />
    </div>
  );
};
