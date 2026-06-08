import React from 'react';
import { Anchor, Warehouse, Flower2, ArrowRight } from 'lucide-react';
import { PixelPanel } from '../shared/PixelPanel';
import { PixelButton } from '../shared/PixelButton';
import { useGameStore } from '../../store/useGameStore';
import { buildingConfigs, sectionConfigs } from '../../data/mockData';
import { audioManager } from '../../utils/audio';
import type { BuildingType } from '../../types/game';

interface BuildPanelProps {
  selectedBuildType: BuildingType | null;
  onSelectBuildType: (type: BuildingType | null) => void;
}

export const BuildPanel: React.FC<BuildPanelProps> = ({ selectedBuildType, onSelectBuildType }) => {
  const { gold, unlockedSections, unlockSection, buildings } = useGameStore();

  const buildIcons: Record<string, React.ReactNode> = {
    dock: <Anchor className="w-6 h-6" />,
    warehouse: <Warehouse className="w-6 h-6" />,
    decoration: <Flower2 className="w-6 h-6" />
  };

  const handleBuild = (type: BuildingType) => {
    if (selectedBuildType === type) {
      onSelectBuildType(null);
    } else {
      audioManager.playClick();
      onSelectBuildType(type);
    }
  };

  const handleUnlockSection = (sectionId: string) => {
    audioManager.playClick();
    unlockSection(sectionId);
  };

  const buildingCount = buildings.filter(b => b.type === 'dock').length;

  return (
    <div className="flex flex-col gap-4">
      <PixelPanel title="建造菜单" variant="wood">
        <div className="flex flex-col gap-3">
          {buildingConfigs.map((config) => {
            const isSelected = selectedBuildType === config.type;
            const canAfford = gold >= config.cost;
            
            return (
              <button
                key={config.type}
                onClick={() => handleBuild(config.type as BuildingType)}
                disabled={!canAfford}
                className={`
                  flex items-center gap-3 p-3 transition-all
                  ${isSelected ? 'scale-105' : 'hover:scale-102'}
                  ${!canAfford ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
                style={{
                  backgroundColor: isSelected ? '#4a6fa5' : '#5a3a1a',
                  border: `3px solid ${isSelected ? '#6a8fc5' : '#3a2010'}`,
                  boxShadow: isSelected ? '0 0 10px rgba(74, 111, 165, 0.5)' : '2px 2px 0 #2a1505'
                }}
              >
                <div
                  className="p-2"
                  style={{
                    backgroundColor: isSelected ? '#6a8fc5' : '#8b5a2b',
                    border: `2px solid ${isSelected ? '#8aafc5' : '#5b3a1b'}`
                  }}
                >
                  {buildIcons[config.type]}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-pixel text-sm text-f0e6d2">{config.name}</div>
                  <div className="font-pixel text-xs text-a0a0a0 mt-1">{config.description}</div>
                </div>
                <div className="text-right">
                  <div className="font-pixel text-sm text-e8c170">💰 {config.cost}</div>
                  {isSelected && (
                    <div className="font-pixel text-xs text-6a8c5f mt-1">点击地图放置</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </PixelPanel>

      <PixelPanel title="河段解锁" variant="dark">
        <div className="flex flex-col gap-3">
          {sectionConfigs.map((section) => {
            const isUnlocked = unlockedSections.includes(section.id);
            const canAfford = gold >= section.cost;
            
            return (
              <div
                key={section.id}
                className="flex items-center gap-3 p-3"
                style={{
                  backgroundColor: isUnlocked ? '#2a4734' : '#2a2a34',
                  border: `3px solid ${isUnlocked ? '#3a6744' : '#3a3a44'}`,
                  opacity: isUnlocked || canAfford ? 1 : 0.5
                }}
              >
                <div className="text-2xl">{isUnlocked ? '✅' : '🔒'}</div>
                <div className="flex-1">
                  <div className="font-pixel text-sm text-f0e6d2">{section.name}</div>
                  <div className="font-pixel text-xs text-a0a0a0 mt-1">{section.description}</div>
                </div>
                {!isUnlocked && (
                  <PixelButton
                    size="sm"
                    variant={canAfford ? 'success' : 'secondary'}
                    disabled={!canAfford}
                    onClick={() => handleUnlockSection(section.id)}
                  >
                    <div className="flex items-center gap-1">
                      <span>💰 {section.cost}</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </PixelButton>
                )}
              </div>
            );
          })}
        </div>
      </PixelPanel>

      <PixelPanel title="港口信息" variant="light">
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-1a2744">码头数量:</span>
            <span className="font-pixel text-8b5a2b">{buildingCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-1a2744">仓库数量:</span>
            <span className="font-pixel text-8b5a2b">{buildings.filter(b => b.type === 'warehouse').length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-1a2744">已解锁河段:</span>
            <span className="font-pixel text-4a6fa5">{unlockedSections.length}/3</span>
          </div>
        </div>
      </PixelPanel>
    </div>
  );
};
