import React from 'react';
import { Ship as ShipIcon, Fuel, Gauge, Wrench, ArrowUp } from 'lucide-react';
import { PixelPanel } from '../shared/PixelPanel';
import { PixelButton } from '../shared/PixelButton';
import { ProgressBar } from '../shared/ProgressBar';
import { useGameStore } from '../../store/useGameStore';
import { useUIStore } from '../../store/useUIStore';
import { audioManager } from '../../utils/audio';
import type { Ship } from '../../types/game';

interface ShipCardProps {
  ship: Ship;
}

export const ShipCard: React.FC<ShipCardProps> = ({ ship }) => {
  const { updateShip, spendGold, gold } = useGameStore();
  const { selectedShipId, setSelectedShipId } = useUIStore();
  
  const isSelected = selectedShipId === ship.id;

  const shipColors: Record<string, string> = {
    small: '#4a6fa5',
    medium: '#6a8fc5',
    large: '#8ba8d5'
  };

  const shipTypeNames: Record<string, string> = {
    small: '小型货船',
    medium: '中型货船',
    large: '大型货船'
  };

  const statusLabels: Record<string, { text: string; color: string }> = {
    idle: { text: '空闲', color: '#6a8c5f' },
    sailing: { text: '航行中', color: '#4a6fa5' },
    loading: { text: '装载中', color: '#e8c170' },
    repairing: { text: '维修中', color: '#e06c75' }
  };

  const status = statusLabels[ship.status];
  const canInteract = ship.status === 'idle';

  const handleSelect = () => {
    audioManager.playClick();
    setSelectedShipId(isSelected ? null : ship.id);
  };

  const handleRepair = () => {
    const repairCost = Math.floor((100 - ship.condition) * 10);
    if (spendGold(repairCost)) {
      updateShip(ship.id, { status: 'repairing', progress: 0 });
      audioManager.playSuccess();
    }
  };

  const handleRefuel = () => {
    const fuelNeeded = ship.maxFuel - ship.fuel;
    const fuelCost = fuelNeeded * 2;
    if (fuelNeeded > 0 && spendGold(fuelCost)) {
      updateShip(ship.id, { fuel: ship.maxFuel });
      audioManager.playSuccess();
    }
  };

  const repairCost = Math.floor((100 - ship.condition) * 10);
  const refuelCost = (ship.maxFuel - ship.fuel) * 2;

  return (
    <div
      onClick={handleSelect}
      className={`cursor-pointer transition-all ${isSelected ? 'scale-[1.02]' : 'hover:scale-[1.01]'}`}
    >
      <PixelPanel
        variant={isSelected ? 'wood' : 'dark'}
        className={isSelected ? 'ring-2 ring-e8c170' : ''}
      >
        <div className="flex items-start gap-4">
          <div
            className="p-4 flex-shrink-0"
            style={{
              backgroundColor: '#1a2744',
              border: '3px solid #0a1724',
              boxShadow: '2px 2px 0 #0a1724'
            }}
          >
            <div className="text-4xl">
              {ship.type === 'small' ? '⛵' : ship.type === 'medium' ? '🚢' : '🛳️'}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-pixel text-sm text-f0e6d2 truncate">{ship.name}</h4>
              <span
                className="px-2 py-1 font-pixel text-xs"
                style={{
                  backgroundColor: `${status.color}30`,
                  border: `2px solid ${status.color}`,
                  color: status.color
                }}
              >
                {status.text}
              </span>
            </div>
            
            <div className="font-pixel text-xs text-a0a0a0 mb-3">
              {shipTypeNames[ship.type]} · 载重 {ship.capacity} 吨 · 速度 {ship.speed} 节
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <ProgressBar
                value={ship.fuel}
                max={ship.maxFuel}
                label="燃料"
                showValue
                size="sm"
                color="#e8c170"
              />
              <ProgressBar
                value={ship.condition}
                max={100}
                label="耐久"
                showValue
                size="sm"
                color={ship.condition > 50 ? '#6a8c5f' : '#e06c75'}
              />
            </div>

            {ship.status === 'sailing' && (
              <ProgressBar
                value={ship.progress}
                max={1}
                label="航行进度"
                size="sm"
                color="#4a6fa5"
                className="mb-3"
              />
            )}

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <span
                  className="px-2 py-1 font-pixel text-xs"
                  style={{
                    backgroundColor: '#2a3754',
                    border: '2px solid #1a2744',
                    color: '#a0a0a0'
                  }}
                >
                  <Wrench className="w-3 h-3 inline mr-1" />
                  Lv.{ship.upgrades.loading}
                </span>
                <span
                  className="px-2 py-1 font-pixel text-xs"
                  style={{
                    backgroundColor: '#2a3754',
                    border: '2px solid #1a2744',
                    color: '#a0a0a0'
                  }}
                >
                  <Gauge className="w-3 h-3 inline mr-1" />
                  Lv.{ship.upgrades.engine}
                </span>
                <span
                  className="px-2 py-1 font-pixel text-xs"
                  style={{
                    backgroundColor: '#2a3754',
                    border: '2px solid #1a2744',
                    color: '#a0a0a0'
                  }}
                >
                  <ShipIcon className="w-3 h-3 inline mr-1" />
                  Lv.{ship.upgrades.hull}
                </span>
              </div>
              
              {canInteract && (
                <div className="flex gap-2">
                  {ship.condition < 100 && (
                    <PixelButton
                      size="sm"
                      variant="secondary"
                      disabled={gold < repairCost}
                      onClick={(e) => { e.stopPropagation(); handleRepair(); }}
                    >
                      <Wrench className="w-4 h-4 mr-1" />
                      维修 💰{repairCost}
                    </PixelButton>
                  )}
                  {ship.fuel < ship.maxFuel && (
                    <PixelButton
                      size="sm"
                      variant="primary"
                      disabled={gold < refuelCost}
                      onClick={(e) => { e.stopPropagation(); handleRefuel(); }}
                    >
                      <Fuel className="w-4 h-4 mr-1" />
                      加油 💰{refuelCost}
                    </PixelButton>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </PixelPanel>
    </div>
  );
};
