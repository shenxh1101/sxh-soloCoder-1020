import React from 'react';
import { Package, MapPin, Clock, Coins, Gauge, AlertTriangle } from 'lucide-react';
import { PixelPanel } from '../shared/PixelPanel';
import { PixelButton } from '../shared/PixelButton';
import { ProgressBar } from '../shared/ProgressBar';
import { useGameStore } from '../../store/useGameStore';
import { useUIStore } from '../../store/useUIStore';
import { audioManager } from '../../utils/audio';
import type { Order, Ship } from '../../types/game';

interface OrderCardProps {
  order: Order;
  availableShips: Ship[];
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, availableShips }) => {
  const { acceptOrder } = useGameStore();
  const { selectedShipId, setSelectedShipId } = useUIStore();

  const difficultyConfig = {
    easy: { label: '简单', color: '#6a8c5f', bg: '#2a4734' },
    medium: { label: '中等', color: '#e8c170', bg: '#4a3724' },
    hard: { label: '困难', color: '#e06c75', bg: '#4a2724' }
  };

  const difficulty = difficultyConfig[order.difficulty];
  const selectedShip = availableShips.find(s => s.id === selectedShipId);
  const canAccept = selectedShip && 
    selectedShip.capacity >= order.cargo.weight &&
    selectedShip.fuel >= order.distance * 2;

  const handleAccept = () => {
    if (selectedShipId) {
      acceptOrder(order.id, selectedShipId);
      setSelectedShipId(null);
    }
  };

  const matchedShip = availableShips.find(s => 
    s.capacity >= order.cargo.weight && 
    s.fuel >= order.distance * 2
  );

  const getWarningMessage = () => {
    if (!selectedShip) return '请先在船队中选择一艘空闲船只';
    if (selectedShip.capacity < order.cargo.weight) {
      return `船只载重不足 (需要 ${order.cargo.weight} 吨)`;
    }
    if (selectedShip.fuel < order.distance * 2) {
      return `燃料不足 (需要 ${order.distance * 2} 单位)`;
    }
    return '';
  };

  return (
    <PixelPanel variant="dark" className="relative overflow-hidden">
      {order.timeLimit && (
        <div className="absolute top-0 right-0 bg-e06c75 px-3 py-1 flex items-center gap-1">
          <Clock className="w-3 h-3 text-f0e6d2" />
          <span className="font-pixel text-xs text-f0e6d2">限时</span>
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className="text-4xl p-2"
              style={{
                backgroundColor: '#1a2744',
                border: '3px solid #0a1724',
                boxShadow: '2px 2px 0 #0a1724'
              }}
            >
              {order.cargo.icon}
            </div>
            <div>
              <h4 className="font-pixel text-sm text-f0e6d2">{order.cargo.name}</h4>
              <div className="font-pixel text-xs text-a0a0a0">
                {order.cargo.weight} 吨 · {order.destination}
              </div>
            </div>
          </div>
          
          <span
            className="px-2 py-1 font-pixel text-xs"
            style={{
              backgroundColor: difficulty.bg,
              border: `2px solid ${difficulty.color}`,
              color: difficulty.color
            }}
          >
            {difficulty.label}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-4a6fa5" />
            <span className="font-pixel text-xs text-a0a0a0">
              距离: <span className="text-f0e6d2">{order.distance} 海里</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-e8c170" />
            <span className="font-pixel text-xs text-a0a0a0">
              报酬: <span className="text-e8c170">💰 {order.reward}</span>
            </span>
          </div>
        </div>

        {order.timeLimit && (
          <div className="mb-3">
            <ProgressBar
              value={order.deadline || 0}
              max={order.timeLimit}
              label="剩余时间"
              showValue
              size="sm"
              color={(order.deadline || 0) < 30 ? '#e06c75' : '#4a6fa5'}
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-6a8c5f" />
            <span className="font-pixel text-xs text-a0a0a0">
              需求载重: <span className={matchedShip ? 'text-6a8c5f' : 'text-e06c75'}>
                {matchedShip ? '✅ 有匹配船只' : '⚠️ 无匹配船只'}
              </span>
            </span>
          </div>
          
          {order.status === 'available' && (
            <PixelButton
              size="sm"
              variant={canAccept ? 'success' : 'secondary'}
              disabled={!canAccept}
              onClick={handleAccept}
            >
              接单
            </PixelButton>
          )}
          
          {order.status === 'accepted' && (
            <span className="font-pixel text-xs text-4a6fa5">📦 运输中</span>
          )}
          
          {order.status === 'completed' && (
            <span className="font-pixel text-xs text-6a8c5f">✅ 已完成</span>
          )}
        </div>
        
        {order.status === 'available' && selectedShipId && !canAccept && (
          <div className="mt-2 p-2 text-xs font-pixel text-e06c75 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            {getWarningMessage()}
          </div>
        )}
      </div>
    </PixelPanel>
  );
};
