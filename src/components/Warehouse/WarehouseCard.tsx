import React from 'react';
import { Warehouse, ArrowUp, Users, Package } from 'lucide-react';
import { PixelPanel } from '../shared/PixelPanel';
import { PixelButton } from '../shared/PixelButton';
import { ProgressBar } from '../shared/ProgressBar';
import { useGameStore } from '../../store/useGameStore';
import { audioManager } from '../../utils/audio';
import type { Building } from '../../types/game';

interface WarehouseCardProps {
  warehouse: Building;
}

export const WarehouseCard: React.FC<WarehouseCardProps> = ({ warehouse }) => {
  const { upgradeBuilding, gold } = useGameStore();

  const upgradeCost = [0, 3000, 8000, 15000][warehouse.level];
  const canUpgrade = warehouse.level < 3 && gold >= upgradeCost;
  const capacity = warehouse.level * 200;
  const usedCapacity = Math.floor(capacity * 0.4);

  const handleUpgrade = () => {
    if (canUpgrade) {
      upgradeBuilding(warehouse.id);
      audioManager.playSuccess();
    }
  };

  const levelLabels = {
    1: '小型仓库',
    2: '中型仓库',
    3: '大型仓库'
  };

  return (
    <PixelPanel variant={warehouse.status === 'operational' ? 'wood' : 'dark'}>
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className="text-4xl p-3"
              style={{
                backgroundColor: '#3a2412',
                border: '3px solid #5a3a1a',
                boxShadow: '2px 2px 0 #2a1505'
              }}
            >
              🏭
            </div>
            <div>
              <h4 className="font-pixel text-sm text-f0e6d2">
                {levelLabels[warehouse.level]} Lv.{warehouse.level}
              </h4>
              <div className="font-pixel text-xs text-a0a0a0">
                位置: ({warehouse.position.x}, {warehouse.position.y})
              </div>
            </div>
          </div>

          <span
            className={`px-2 py-1 font-pixel text-xs ${
              warehouse.status === 'operational' ? 'text-6a8c5f' : 'text-e06c75'
            }`}
            style={{
              backgroundColor: warehouse.status === 'operational' ? '#2a4734' : '#4a2724',
              border: `2px solid ${warehouse.status === 'operational' ? '#6a8c5f' : '#e06c75'}`
            }}
          >
            {warehouse.status === 'operational' ? '运行中' : '损坏'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-4a6fa5" />
            <span className="font-pixel text-xs text-a0a0a0">
              容量: <span className="text-f0e6d2">{capacity} 吨</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-e8c170" />
            <span className="font-pixel text-xs text-a0a0a0">
              装卸: <span className="text-f0e6d2">{warehouse.level * 10} 吨/小时</span>
            </span>
          </div>
        </div>

        <ProgressBar
          value={usedCapacity}
          max={capacity}
          label="存储使用"
          showValue
          size="sm"
          color={usedCapacity > capacity * 0.8 ? '#e06c75' : '#6a8c5f'}
          className="mb-3"
        />

        {warehouse.level < 3 && (
          <div className="flex items-center justify-between">
            <div className="font-pixel text-xs text-a0a0a0">
              升级费用: <span className="text-e8c170">💰 {upgradeCost}</span>
            </div>
            <PixelButton
              size="sm"
              variant={canUpgrade ? 'success' : 'secondary'}
              disabled={!canUpgrade}
              onClick={handleUpgrade}
            >
              <ArrowUp className="w-4 h-4 mr-1" />
              升级
            </PixelButton>
          </div>
        )}

        {warehouse.level >= 3 && (
          <div className="text-center font-pixel text-xs text-6a8c5f">
            ⭐ 已达到最高等级
          </div>
        )}
      </div>
    </PixelPanel>
  );
};
