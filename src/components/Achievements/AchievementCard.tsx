import React from 'react';
import { Lock, Unlock, Trophy, Music, Shirt, Home, Coins } from 'lucide-react';
import { PixelPanel } from '../shared/PixelPanel';
import { ProgressBar } from '../shared/ProgressBar';
import { useGameStore } from '../../store/useGameStore';
import { audioManager } from '../../utils/audio';
import type { Achievement } from '../../types/game';

interface AchievementCardProps {
  achievement: Achievement;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const { unlockAchievement } = useGameStore();

  const rewardIcons = {
    music: <Music className="w-4 h-4" />,
    skin: <Shirt className="w-4 h-4" />,
    decoration: <Home className="w-4 h-4" />,
    gold: <Coins className="w-4 h-4" />
  };

  const rewardLabels = {
    music: '音乐',
    skin: '皮肤',
    decoration: '装饰',
    gold: '金币'
  };

  const progressPercent = Math.min(100, (achievement.condition.current / achievement.condition.target) * 100);

  const handleClick = () => {
    if (achievement.condition.current >= achievement.condition.target && !achievement.unlocked) {
      unlockAchievement(achievement.id);
    }
    audioManager.playClick();
  };

  return (
    <PixelPanel
      variant={achievement.unlocked ? 'wood' : 'dark'}
      className={`cursor-pointer transition-all hover:scale-[1.01] ${achievement.unlocked ? 'ring-2 ring-e8c170' : ''}`}
      onClick={handleClick}
    >
      <div className="p-4">
        <div className="flex items-start gap-4">
          <div
            className={`text-4xl p-3 flex-shrink-0 relative ${
              achievement.unlocked ? '' : 'grayscale opacity-60'
            }`}
            style={{
              backgroundColor: achievement.unlocked ? '#4a3724' : '#1a2744',
              border: `3px solid ${achievement.unlocked ? '#e8c170' : '#0a1724'}`,
              boxShadow: `2px 2px 0 ${achievement.unlocked ? '#e8c17080' : '#0a1724'}`
            }}
          >
            {achievement.icon}
            {achievement.unlocked && (
              <div className="absolute -top-1 -right-1 bg-6a8c5f rounded-full p-1">
                <Unlock className="w-3 h-3 text-f0e6d2" />
              </div>
            )}
            {!achievement.unlocked && achievement.condition.current < achievement.condition.target && (
              <div className="absolute -top-1 -right-1 bg-2a3754 rounded-full p-1">
                <Lock className="w-3 h-3 text-a0a0a0" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h4 className={`font-pixel text-sm ${achievement.unlocked ? 'text-e8c170' : 'text-f0e6d2'}`}>
                {achievement.name}
              </h4>
              {achievement.unlocked && (
                <span className="font-pixel text-xs text-6a8c5f">✅ 已解锁</span>
              )}
            </div>

            <p className="font-pixel text-xs text-a0a0a0 mb-3">
              {achievement.description}
            </p>

            <div className="flex items-center gap-2 mb-3">
              <div
                className="flex items-center gap-1 px-2 py-1"
                style={{
                  backgroundColor: '#1a2744',
                  border: '2px solid #0a1724'
                }}
              >
                {rewardIcons[achievement.reward.type]}
                <span className="font-pixel text-xs text-a0a0a0">
                  {rewardLabels[achievement.reward.type]}:
                  <span className="text-e8c170 ml-1">
                    {achievement.reward.type === 'gold' ? `💰 ${achievement.reward.value}` : achievement.reward.value}
                  </span>
                </span>
              </div>
            </div>

            {!achievement.unlocked && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-pixel text-xs text-a0a0a0">
                    进度: {achievement.condition.current} / {achievement.condition.target}
                  </span>
                  <span className="font-pixel text-xs text-4a6fa5">
                    {Math.floor(progressPercent)}%
                  </span>
                </div>
                <ProgressBar
                  value={achievement.condition.current}
                  max={achievement.condition.target}
                  size="sm"
                  color={achievement.condition.current >= achievement.condition.target ? '#6a8c5f' : '#4a6fa5'}
                />
              </div>
            )}

            {!achievement.unlocked && achievement.condition.current >= achievement.condition.target && (
              <div className="mt-2 text-center font-pixel text-xs text-6a8c5f animate-pulse">
                🎉 点击领取奖励
              </div>
            )}
          </div>
        </div>
      </div>
    </PixelPanel>
  );
};
