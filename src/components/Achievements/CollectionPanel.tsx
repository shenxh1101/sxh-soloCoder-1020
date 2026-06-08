import React from 'react';
import { Music, Shirt, Home, Lock, Unlock } from 'lucide-react';
import { PixelPanel } from '../shared/PixelPanel';
import { audioManager } from '../../utils/audio';
import { musicTracks, skins, decorations } from '../../data/mockData';
import { useGameStore } from '../../store/useGameStore';

interface CollectionItem {
  id: string;
  name: string;
  unlocked: boolean;
  icon: string;
}

interface CollectionPanelProps {
  title: string;
  icon: React.ReactNode;
  items: CollectionItem[];
  itemIcons: Record<string, string>;
}

const CollectionPanel: React.FC<CollectionPanelProps> = ({ title, icon, items, itemIcons }) => {
  const unlockedCount = items.filter(i => i.unlocked).length;

  return (
    <PixelPanel variant="dark">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {icon}
            <h4 className="font-pixel text-sm text-f0e6d2">{title}</h4>
          </div>
          <span className="font-pixel text-xs text-e8c170">
            {unlockedCount} / {items.length}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {items.map(item => (
            <div
              key={item.id}
              className={`p-3 text-center transition-all ${
                item.unlocked ? 'cursor-pointer hover:scale-105' : 'opacity-50'
              }`}
              style={{
                backgroundColor: item.unlocked ? '#2a3754' : '#1a2744',
                border: `2px solid ${item.unlocked ? '#4a6fa5' : '#0a1724'}`,
                boxShadow: item.unlocked ? '2px 2px 0 #4a6fa580' : '2px 2px 0 #0a1724'
              }}
              onClick={() => item.unlocked && audioManager.playClick()}
            >
              <div className="text-3xl mb-2">
                {item.unlocked ? itemIcons[item.id] : '🔒'}
              </div>
              <div className={`font-pixel text-xs ${item.unlocked ? 'text-f0e6d2' : 'text-a0a0a0'}`}>
                {item.unlocked ? item.name : '???'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PixelPanel>
  );
};

export const CollectionPanelWrapper: React.FC = () => {
  const { achievements } = useGameStore();

  const unlockedAchievements = achievements.filter(a => a.unlocked);

  const musicItems = musicTracks.map(track => ({
    ...track,
    unlocked: track.unlocked || unlockedAchievements.some(a => a.reward.type === 'music' && a.reward.value === track.id),
    icon: '🎵'
  }));

  const skinItems = skins.map(skin => ({
    ...skin,
    unlocked: skin.unlocked || unlockedAchievements.some(a => a.reward.type === 'skin' && a.reward.value === skin.id),
    icon: '👔'
  }));

  const decorationItems = decorations.map(deco => ({
    ...deco,
    unlocked: deco.unlocked || unlockedAchievements.some(a => a.reward.type === 'decoration' && a.reward.value === deco.id),
    icon: '🏠'
  }));

  const musicIcons: Record<string, string> = {
    default: '🎵',
    sea_shanty: '⚓',
    victory_march: '🎺'
  };

  const skinIcons: Record<string, string> = {
    default: '👨‍✈️',
    captain_outfit: '🧥',
    admiral_uniform: '🎖️'
  };

  const decorationIcons: Record<string, string> = {
    default: '🏠',
    lighthouse: '🗼',
    statue: '🗿'
  };

  return (
    <div className="space-y-4">
      <CollectionPanel
        title="复古音乐"
        icon={<Music className="w-4 h-4 text-e8c170" />}
        items={musicItems}
        itemIcons={musicIcons}
      />
      <CollectionPanel
        title="角色皮肤"
        icon={<Shirt className="w-4 h-4 text-4a6fa5" />}
        items={skinItems}
        itemIcons={skinIcons}
      />
      <CollectionPanel
        title="小镇装饰"
        icon={<Home className="w-4 h-4 text-6a8c5f" />}
        items={decorationItems}
        itemIcons={decorationIcons}
      />
    </div>
  );
};
