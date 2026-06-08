import React, { useState } from 'react';
import { TopBar } from '../shared/TopBar';
import { BottomNav } from '../shared/BottomNav';
import { CaptainCard } from './CaptainCard';
import { ShipCard } from './ShipCard';
import { UpgradePanel } from './UpgradePanel';
import { PixelPanel } from '../shared/PixelPanel';
import { PixelButton } from '../shared/PixelButton';
import { useGameStore } from '../../store/useGameStore';
import { useUIStore } from '../../store/useUIStore';
import { shipConfigs } from '../../data/mockData';
import { audioManager } from '../../utils/audio';
import { UserPlus, Plus } from 'lucide-react';

export const FleetManagement: React.FC = () => {
  const { captains, ships, gold, addShip, assignCaptainToShip } = useGameStore();
  const { selectedShipId, setSelectedShipId } = useUIStore();
  const [activeTab, setActiveTab] = useState<'captains' | 'ships'>('captains');

  const hiredCaptains = captains.filter(c => c.hired);
  const availableCaptains = captains.filter(c => !c.hired);

  const handleBuyShip = (shipType: 'small' | 'medium' | 'large') => {
    const config = shipConfigs.find(c => c.type === shipType);
    if (!config || gold < config.cost) {
      audioManager.playError();
      return;
    }

    const newShip = {
      id: `ship_${Date.now()}`,
      name: `${config.name}${ships.length + 1}号`,
      type: shipType,
      capacity: config.capacity,
      speed: config.speed,
      fuel: config.capacity * 2,
      maxFuel: config.capacity * 2,
      condition: 100,
      status: 'idle' as const,
      position: { x: 2, y: 5 },
      progress: 0,
      upgrades: { loading: 1, engine: 1, hull: 1 }
    };

    addShip(newShip);
    audioManager.playSuccess();
  };

  const handleAssignCaptain = (captainId: string) => {
    if (selectedShipId) {
      assignCaptainToShip(captainId, selectedShipId);
      setSelectedShipId(null);
      audioManager.playSuccess();
    }
  };

  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: '#0a1724' }}>
      <TopBar />
      
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="flex gap-4 mb-4">
            <PixelButton
              variant={activeTab === 'captains' ? 'primary' : 'secondary'}
              onClick={() => { setActiveTab('captains'); audioManager.playClick(); }}
              className="flex-1"
            >
              <UserPlus className="w-5 h-5 inline mr-2" />
              船长管理 ({hiredCaptains.length}/{captains.length})
            </PixelButton>
            <PixelButton
              variant={activeTab === 'ships' ? 'primary' : 'secondary'}
              onClick={() => { setActiveTab('ships'); audioManager.playClick(); }}
              className="flex-1"
            >
              <Plus className="w-5 h-5 inline mr-2" />
              船只管理 ({ships.length})
            </PixelButton>
          </div>

          {activeTab === 'captains' ? (
            <div className="space-y-4">
              <PixelPanel title="在任船长" variant="dark">
                {hiredCaptains.length > 0 ? (
                  <div className="grid gap-4">
                    {hiredCaptains.map(captain => (
                      <CaptainCard
                        key={captain.id}
                        captain={captain}
                        onAssign={selectedShipId ? handleAssignCaptain : undefined}
                        isAssigned={captain.shipId === selectedShipId}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 font-pixel text-sm text-a0a0a0">
                    暂无在任船长，请从下方招募
                  </div>
                )}
              </PixelPanel>

              <PixelPanel title="可招募船长" variant="wood">
                <div className="grid gap-4">
                  {availableCaptains.map(captain => (
                    <CaptainCard key={captain.id} captain={captain} />
                  ))}
                </div>
              </PixelPanel>
            </div>
          ) : (
            <div className="space-y-4">
              <PixelPanel title="我的船队" variant="dark">
                {selectedShipId && (
                  <div className="mb-4 p-3" style={{ backgroundColor: '#e8c17020', border: '2px solid #e8c170' }}>
                    <div className="font-pixel text-sm text-e8c170">
                      🎯 已选择船只，请在船长管理中派遣船长，或使用右侧面板升级船只
                    </div>
                  </div>
                )}
                <div className="grid gap-4">
                  {ships.map(ship => (
                    <ShipCard key={ship.id} ship={ship} />
                  ))}
                </div>
              </PixelPanel>

              <PixelPanel title="购买新船" variant="wood">
                <div className="grid grid-cols-3 gap-4">
                  {shipConfigs.map(config => {
                    const canAfford = gold >= config.cost;
                    return (
                      <div
                        key={config.type}
                        className="p-4 text-center"
                        style={{
                          backgroundColor: '#3a2412',
                          border: '3px solid #5a3a1a',
                          boxShadow: '2px 2px 0 #2a1505'
                        }}
                      >
                        <div className="text-4xl mb-2">
                          {config.type === 'small' ? '⛵' : config.type === 'medium' ? '🚢' : '🛳️'}
                        </div>
                        <div className="font-pixel text-sm text-f0e6d2 mb-1">{config.name}</div>
                        <div className="font-pixel text-xs text-a0a0a0 mb-2">
                          载重 {config.capacity}吨 · 速度 {config.speed}节
                        </div>
                        <div className="font-pixel text-xs text-a0a0a0 mb-3">{config.description}</div>
                        <PixelButton
                          size="sm"
                          variant={canAfford ? 'success' : 'secondary'}
                          disabled={!canAfford}
                          onClick={() => handleBuyShip(config.type as 'small' | 'medium' | 'large')}
                          className="w-full"
                        >
                          购买 💰{config.cost}
                        </PixelButton>
                      </div>
                    );
                  })}
                </div>
              </PixelPanel>
            </div>
          )}
        </div>
        
        <div className="w-80 p-4 overflow-y-auto" style={{ backgroundColor: '#1a2744' }}>
          <UpgradePanel />
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};
