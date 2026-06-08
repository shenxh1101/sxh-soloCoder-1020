import React from 'react';
import { Coins, Calendar, Cloud, Bell, Settings } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { useUIStore } from '../../store/useUIStore';
import { audioManager } from '../../utils/audio';

export const TopBar: React.FC = () => {
  const { gold, day, weather } = useGameStore();
  const { toggleSettings } = useUIStore();

  const weatherIcons: Record<string, string> = {
    sunny: '☀️',
    rainy: '🌧️',
    stormy: '⛈️'
  };

  const weatherLabels: Record<string, string> = {
    sunny: '晴朗',
    rainy: '雨天',
    stormy: '暴风雨'
  };

  const handleSettings = () => {
    audioManager.playClick();
    toggleSettings();
  };

  return (
    <div
      className="flex items-center justify-between px-6 py-3"
      style={{
        backgroundColor: '#1a2744',
        borderBottom: '4px solid #0a1724',
        boxShadow: '0 4px 0 rgba(0,0,0,0.3)'
      }}
    >
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div
            className="p-2"
            style={{
              backgroundColor: '#e8c170',
              border: '2px solid #b89020',
              boxShadow: '2px 2px 0 #8b6914'
            }}
          >
            <Coins className="w-5 h-5 text-amber-900" />
          </div>
          <span className="font-pixel text-lg text-e8c170">
            {gold.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="p-2"
            style={{
              backgroundColor: '#4a6fa5',
              border: '2px solid #2a4f75',
              boxShadow: '2px 2px 0 #1a3f65'
            }}
          >
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <span className="font-pixel text-lg text-f0e6d2">
            第 {day} 天
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="p-2"
            style={{
              backgroundColor: '#6a8c5f',
              border: '2px solid #3a5c2f',
              boxShadow: '2px 2px 0 #2a4c1f'
            }}
          >
            <Cloud className="w-5 h-5 text-white" />
          </div>
          <span className="font-pixel text-lg text-f0e6d2">
            {weatherIcons[weather]} {weatherLabels[weather]}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleSettings}
          className="p-2 transition-all hover:scale-110 active:scale-95"
          style={{
            backgroundColor: '#8b5a2b',
            border: '2px solid #5b3a1b',
            boxShadow: '2px 2px 0 #4b2a0b'
          }}
        >
          <Bell className="w-5 h-5 text-f0e6d2" />
        </button>
        <button
          onClick={handleSettings}
          className="p-2 transition-all hover:scale-110 active:scale-95"
          style={{
            backgroundColor: '#8b5a2b',
            border: '2px solid #5b3a1b',
            boxShadow: '2px 2px 0 #4b2a0b'
          }}
        >
          <Settings className="w-5 h-5 text-f0e6d2" />
        </button>
      </div>
    </div>
  );
};
