import React from 'react';
import { Package, Gauge, Ship as ShipIcon, ArrowUp } from 'lucide-react';
import { PixelPanel } from '../shared/PixelPanel';
import { PixelButton } from '../shared/PixelButton';
import { ProgressBar } from '../shared/ProgressBar';
import { useGameStore } from '../../store/useGameStore';
import { useUIStore } from '../../store/useUIStore';
import { upgradeCosts } from '../../data/mockData';
import { audioManager } from '../../utils/audio';

export const UpgradePanel: React.FC = () => {
  const { ships, gold, updateShip } = useGameStore();
  const { selectedShipId } = useUIStore();

  const selectedShip = ships.find(s => s.id === selectedShipId);

  if (!selectedShip) {
    return (
      <PixelPanel title="船只升级" variant="wood">
        <div className="text-center py-8 font-pixel text-sm text-a0a0a0">
          请先选择一艘船只进行升级
        </div>
      </PixelPanel>
    );
  }

  const upgrades = [
    { key: 'loading', name: '装卸速度', icon: Package, description: '提升货物装卸效率' },
    { key: 'engine', name: '引擎强化', icon: Gauge, description: '提升航行速度' },
    { key: 'hull', name: '船体加固', icon: ShipIcon, description: '减少恶劣天气损伤' }
  ] as const;

  const handleUpgrade = (upgradeKey: 'loading' | 'engine' | 'hull') => {
    const currentLevel = selectedShip.upgrades[upgradeKey];
    if (currentLevel >= 3) return;
    
    const cost = upgradeCosts[upgradeKey][currentLevel + 1];
    if (gold < cost) {
      audioManager.playError();
      return;
    }

    updateShip(selectedShip.id, {
      upgrades: {
        ...selectedShip.upgrades,
        [upgradeKey]: currentLevel + 1
      }
    });
    audioManager.playSuccess();
  };

  return (
    <PixelPanel
      title="船只升级"
      variant="wood"
      headerActions={
        <span className="font-pixel text-xs text-e8c170">
          {selectedShip.name}
        </span>
      }
    >
      <div className="flex flex-col gap-4">
        {upgrades.map(({ key, name, icon: Icon, description }) => {
          const currentLevel = selectedShip.upgrades[key];
          const nextCost = currentLevel < 3 ? upgradeCosts[key][currentLevel + 1] : 0;
          const canUpgrade = currentLevel < 3 && gold >= nextCost;
          const isMaxLevel = currentLevel >= 3;

          return (
            <div
              key={key}
              className="p-3"
              style={{
                backgroundColor: '#3a2412',
                border: '3px solid #5a3a1a',
                boxShadow: '2px 2px 0 #2a1505'
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="p-2"
                  style={{
                    backgroundColor: '#8b5a2b',
                    border: '2px solid #5b3a1b',
                    boxShadow: '2px 2px 0 #4b2a0b'
                  }}
                >
                  <Icon className="w-5 h-5 text-f0e6d2" />
                </div>
                <div className="flex-1">
                  <div className="font-pixel text-sm text-f0e6d2">{name}</div>
                  <div className="font-pixel text-xs text-a0a0a0">{description}</div>
                </div>
              </div>
              
              <ProgressBar
                value={currentLevel}
                max={3}
                label="等级"
                showValue
                size="md"
                color="#e8c170"
                className="mb-3"
              />
              
              <div className="flex items-center justify-between">
                <div className="font-pixel text-xs text-a0a0a0">
                  当前效果: <span className="text-6a8c5f">+{currentLevel * 15}%</span>
                </div>
                
                {isMaxLevel ? (
                  <span
                    className="px-3 py-1 font-pixel text-xs"
                    style={{
                      backgroundColor: '#2a4734',
                      border: '2px solid #3a6744',
                      color: '#6a8c5f'
                    }}
                  >
                    已满级
                  </span>
                ) : (
                  <PixelButton
                    size="sm"
                    variant={canUpgrade ? 'success' : 'secondary'}
                    disabled={!canUpgrade}
                    onClick={() => handleUpgrade(key)}
                  >
                    <ArrowUp className="w-4 h-4 mr-1" />
                    升级 💰{nextCost}
                  </PixelButton>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </PixelPanel>
  );
};
