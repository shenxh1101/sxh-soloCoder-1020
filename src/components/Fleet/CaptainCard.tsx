import React from 'react';
import { User, Zap, Package, Navigation, Wrench, X } from 'lucide-react';
import { PixelPanel } from '../shared/PixelPanel';
import { PixelButton } from '../shared/PixelButton';
import { ProgressBar } from '../shared/ProgressBar';
import { useGameStore } from '../../store/useGameStore';
import { useUIStore } from '../../store/useUIStore';
import { audioManager } from '../../utils/audio';
import type { Captain } from '../../types/game';

interface CaptainCardProps {
  captain: Captain;
  onAssign?: (captainId: string) => void;
  isAssigned?: boolean;
}

export const CaptainCard: React.FC<CaptainCardProps> = ({ captain, onAssign, isAssigned }) => {
  const { hireCaptain, fireCaptain, gold } = useGameStore();
  const { selectedShipId } = useUIStore();

  const skillIcons: Record<string, React.ReactNode> = {
    speed: <Zap className="w-4 h-4" />,
    cargo: <Package className="w-4 h-4" />,
    navigation: <Navigation className="w-4 h-4" />,
    maintenance: <Wrench className="w-4 h-4" />
  };

  const skillNames: Record<string, string> = {
    speed: '速度',
    cargo: '载货',
    navigation: '航海',
    maintenance: '维修'
  };

  const handleHire = () => {
    const success = hireCaptain(captain.id);
    if (success) {
      audioManager.playSuccess();
    }
  };

  const handleFire = () => {
    if (window.confirm(`确定要解雇 ${captain.name} 吗？`)) {
      fireCaptain(captain.id);
      audioManager.playClick();
    }
  };

  const handleAssign = () => {
    if (onAssign) {
      onAssign(captain.id);
      audioManager.playClick();
    }
  };

  const hireCost = captain.salary * 10;
  const canHire = gold >= hireCost;

  return (
    <PixelPanel
      variant={captain.hired ? 'wood' : 'dark'}
      className={isAssigned ? 'ring-2 ring-e8c170' : ''}
    >
      <div className="flex items-start gap-4">
        <div
          className="text-5xl p-3 flex-shrink-0"
          style={{
            backgroundColor: '#3a2412',
            border: '3px solid #5a3a1a',
            boxShadow: '2px 2px 0 #2a1505'
          }}
        >
          {captain.avatar}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-pixel text-sm text-f0e6d2 truncate">{captain.name}</h4>
            <div className="flex items-center gap-1 px-2 py-1" style={{ backgroundColor: '#1a2744', border: '2px solid #0a1724' }}>
              <span className="text-xs text-e8c170">Lv.{captain.level}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            <div
              className="flex items-center gap-1 px-2 py-1"
              style={{
                backgroundColor: captain.hired ? '#2a4734' : '#2a3754',
                border: `2px solid ${captain.hired ? '#3a6744' : '#3a4764'}`
              }}
            >
              {skillIcons[captain.skill]}
              <span className="font-pixel text-xs text-f0e6d2">
                {skillNames[captain.skill]} +{captain.skillLevel}
              </span>
            </div>
          </div>

          <ProgressBar
            value={captain.skillLevel}
            max={5}
            label="技能等级"
            size="sm"
            color="#e8c170"
          />
          
          <div className="flex items-center justify-between mt-3">
            <div className="font-pixel text-xs text-a0a0a0">
              日薪: <span className="text-e8c170">💰 {captain.salary}</span>
            </div>
            
            {!captain.hired ? (
              <PixelButton
                size="sm"
                variant={canHire ? 'success' : 'secondary'}
                disabled={!canHire}
                onClick={handleHire}
              >
                招募 💰{hireCost}
              </PixelButton>
            ) : selectedShipId && !captain.shipId ? (
              <PixelButton
                size="sm"
                variant="primary"
                onClick={handleAssign}
              >
                派遣
              </PixelButton>
            ) : (
              <button
                onClick={handleFire}
                className="p-1.5 transition-all hover:bg-red-900/50"
                style={{
                  backgroundColor: '#5a2a2a',
                  border: '2px solid #3a1a1a',
                  boxShadow: '1px 1px 0 #2a0a0a'
                }}
                title="解雇船长"
              >
                <X className="w-4 h-4 text-e06c75" />
              </button>
            )}
          </div>
          
          {captain.shipId && (
            <div className="mt-2 font-pixel text-xs text-6a8c5f">
              ✅ 已分配到船只
            </div>
          )}
        </div>
      </div>
    </PixelPanel>
  );
};
