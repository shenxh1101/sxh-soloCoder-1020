import React, { useState } from 'react';
import { RefreshCw, Filter, Clock, Package, CheckCircle, XCircle } from 'lucide-react';
import { PixelPanel } from '../shared/PixelPanel';
import { PixelButton } from '../shared/PixelButton';
import { TopBar } from '../shared/TopBar';
import { BottomNav } from '../shared/BottomNav';
import { OrderCard } from './OrderCard';
import { useGameStore } from '../../store/useGameStore';
import { useUIStore } from '../../store/useUIStore';
import { audioManager } from '../../utils/audio';
import type { OrderStatus } from '../../types/game';

type OrderFilter = 'all' | 'available' | 'accepted' | 'completed';

export const OrderHall: React.FC = () => {
  const { orders, ships } = useGameStore();
  const { selectedShipId } = useUIStore();
  const [filter, setFilter] = useState<OrderFilter>('all');

  const availableShips = ships.filter(s => s.status === 'idle');
  const selectedShip = ships.find(s => s.id === selectedShipId);

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const stats = {
    all: orders.length,
    available: orders.filter(o => o.status === 'available').length,
    accepted: orders.filter(o => o.status === 'accepted').length,
    completed: orders.filter(o => o.status === 'completed').length
  };

  const filterConfig: { key: OrderFilter; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: '全部', icon: <Package className="w-4 h-4" /> },
    { key: 'available', label: '可接', icon: <Clock className="w-4 h-4" /> },
    { key: 'accepted', label: '进行中', icon: <RefreshCw className="w-4 h-4" /> },
    { key: 'completed', label: '已完成', icon: <CheckCircle className="w-4 h-4" /> }
  ];

  const handleFilterChange = (newFilter: OrderFilter) => {
    setFilter(newFilter);
    audioManager.playClick();
  };

  return (
    <div className="min-h-screen bg-#0f1729 pb-20">
      <TopBar />
      
      <div className="container mx-auto p-4 max-w-4xl">
        <PixelPanel variant="wood" className="mb-4">
          <div className="p-4">
            <h2 className="font-pixel text-lg text-f0e6d2 mb-4">📋 订单大厅</h2>
            
            {selectedShip && (
              <div className="mb-4 p-3 flex items-center justify-between" style={{ backgroundColor: '#1a2744', border: '2px solid #4a6fa5' }}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedShip.type === 'small' ? '⛵' : selectedShip.type === 'medium' ? '🚢' : '🛳️'}</span>
                  <span className="font-pixel text-sm text-f0e6d2">
                    已选择: {selectedShip.name} ({selectedShip.type === 'small' ? '小型' : selectedShip.type === 'medium' ? '中型' : '大型'} · 载重 {selectedShip.capacity} 吨
                  </span>
                </div>
                <span className="font-pixel text-xs text-a0a0a0">
                  燃料: {selectedShip.fuel}/{selectedShip.maxFuel}
                </span>
              </div>
            )}

            {!selectedShip && (
              <div className="mb-4 p-3 flex items-center gap-2" style={{ backgroundColor: '#2a2724', border: '2px solid #e8c170' }}>
                <span className="text-xl">💡</span>
                <span className="font-pixel text-xs text-e8c170">
                  提示：前往船队管理选择一艘空闲船只，然后返回此处接单
                </span>
              </div>
            )}

            <div className="flex flex-wrap gap-2 mb-4">
              {filterConfig.map(({ key, label, icon }) => (
                <PixelButton
                  key={key}
                  size="sm"
                  variant={filter === key ? 'primary' : 'secondary'}
                  onClick={() => handleFilterChange(key)}
                >
                  {icon}
                  <span className="ml-1">{label} ({stats[key]})</span>
                </PixelButton>
              ))}
            </div>
          </div>
        </PixelPanel>

        {filteredOrders.length === 0 ? (
          <PixelPanel variant="dark" className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <p className="font-pixel text-sm text-a0a0a0">暂无订单</p>
          </PixelPanel>
        ) : (
          <div className="grid gap-4">
            {filteredOrders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                availableShips={availableShips}
              />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};
