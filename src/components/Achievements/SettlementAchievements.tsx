import React, { useState } from 'react';
import { Trophy, TrendingUp, TrendingDown, Calendar, Package, Coins, BarChart3 } from 'lucide-react';
import { PixelPanel } from '../shared/PixelPanel';
import { PixelButton } from '../shared/PixelButton';
import { TopBar } from '../shared/TopBar';
import { BottomNav } from '../shared/BottomNav';
import { ProgressBar } from '../shared/ProgressBar';
import { AchievementCard } from './AchievementCard';
import { CollectionPanelWrapper } from './CollectionPanel';
import { useGameStore } from '../../store/useGameStore';
import { audioManager } from '../../utils/audio';

type TabType = 'overview' | 'achievements' | 'collections';

export const SettlementAchievements: React.FC = () => {
  const { achievements, dailyStats, gold, day, orders, ships, buildings } = useGameStore();
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalAchievements = achievements.length;

  const totalIncome = dailyStats.reduce((sum, s) => sum + s.income, 0);
  const totalExpense = dailyStats.reduce((sum, s) => sum + s.expense, 0);
  const totalProfit = totalIncome - totalExpense;
  const totalOrders = dailyStats.reduce((sum, s) => sum + s.ordersCompleted, 0);

  const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: '经营概览', icon: <BarChart3 className="w-4 h-4" /> },
    { key: 'achievements', label: '成就系统', icon: <Trophy className="w-4 h-4" /> },
    { key: 'collections', label: '收藏品', icon: <Package className="w-4 h-4" /> }
  ];

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    audioManager.playClick();
  };

  const getRecentStats = () => {
    const recent = dailyStats.slice(-7);
    const maxProfit = Math.max(...recent.map(s => Math.abs(s.profit)), 1);
    return recent.map(stat => ({
      ...stat,
      height: Math.max(20, (Math.abs(stat.profit) / maxProfit) * 80),
      positive: stat.profit >= 0
    }));
  };

  const recentStats = getRecentStats();

  return (
    <div className="min-h-screen bg-#0f1729 pb-20">
      <TopBar />
      
      <div className="container mx-auto p-4 max-w-4xl">
        <PixelPanel variant="wood" className="mb-4">
          <div className="p-4">
            <h2 className="font-pixel text-lg text-f0e6d2 mb-4">🏆 结算成就</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div
                className="p-3 text-center"
                style={{
                  backgroundColor: '#1a2744',
                  border: '2px solid #0a1724',
                  boxShadow: '2px 2px 0 #0a1724'
                }}
              >
                <div className="text-2xl mb-1">📅</div>
                <div className="font-pixel text-xs text-a0a0a0">经营天数</div>
                <div className="font-pixel text-sm text-f0e6d2">第 {day} 天</div>
              </div>
              <div
                className="p-3 text-center"
                style={{
                  backgroundColor: '#1a2744',
                  border: '2px solid #0a1724',
                  boxShadow: '2px 2px 0 #0a1724'
                }}
              >
                <div className="text-2xl mb-1">💰</div>
                <div className="font-pixel text-xs text-a0a0a0">当前资金</div>
                <div className="font-pixel text-sm text-e8c170">💰 {gold}</div>
              </div>
              <div
                className="p-3 text-center"
                style={{
                  backgroundColor: '#1a2744',
                  border: '2px solid #0a1724',
                  boxShadow: '2px 2px 0 #0a1724'
                }}
              >
                <div className="text-2xl mb-1">📦</div>
                <div className="font-pixel text-xs text-a0a0a0">完成订单</div>
                <div className="font-pixel text-sm text-6a8c5f">{totalOrders} 单</div>
              </div>
              <div
                className="p-3 text-center"
                style={{
                  backgroundColor: '#1a2744',
                  border: '2px solid #0a1724',
                  boxShadow: '2px 2px 0 #0a1724'
                }}
              >
                <div className="text-2xl mb-1">🏆</div>
                <div className="font-pixel text-xs text-a0a0a0">成就解锁</div>
                <div className="font-pixel text-sm text-e8c170">{unlockedCount}/{totalAchievements}</div>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              {tabs.map(tab => (
                <PixelButton
                  key={tab.key}
                  size="sm"
                  variant={activeTab === tab.key ? 'primary' : 'secondary'}
                  onClick={() => handleTabChange(tab.key)}
                >
                  {tab.icon}
                  <span className="ml-1">{tab.label}</span>
                </PixelButton>
              ))}
            </div>
          </div>
        </PixelPanel>

        {activeTab === 'overview' && (
          <div className="space-y-4">
            <PixelPanel variant="dark">
              <div className="p-4">
                <h3 className="font-pixel text-sm text-f0e6d2 mb-4">📊 累计统计</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <TrendingUp className="w-4 h-4 text-6a8c5f" />
                      <span className="font-pixel text-xs text-a0a0a0">总收入</span>
                    </div>
                    <div className="font-pixel text-lg text-6a8c5f">💰 {totalIncome}</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <TrendingDown className="w-4 h-4 text-e06c75" />
                      <span className="font-pixel text-xs text-a0a0a0">总支出</span>
                    </div>
                    <div className="font-pixel text-lg text-e06c75">💰 {totalExpense}</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Coins className="w-4 h-4 text-e8c170" />
                      <span className="font-pixel text-xs text-a0a0a0">净利润</span>
                    </div>
                    <div className={`font-pixel text-lg ${totalProfit >= 0 ? 'text-6a8c5f' : 'text-e06c75'}`}>
                      💰 {totalProfit}
                    </div>
                  </div>
                </div>
              </div>
            </PixelPanel>

            {recentStats.length > 0 && (
              <PixelPanel variant="dark">
                <div className="p-4">
                  <h3 className="font-pixel text-sm text-f0e6d2 mb-4">📈 近期利润走势</h3>
                  <div className="flex items-end justify-between h-32 gap-2">
                    {recentStats.map((stat, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div
                          className={`w-full transition-all duration-300 ${
                            stat.positive ? 'bg-6a8c5f' : 'bg-e06c75'
                          }`}
                          style={{
                            height: `${stat.height}px`,
                            border: `2px solid ${stat.positive ? '#3a6744' : '#a04c55'}`,
                            boxShadow: `1px 1px 0 ${stat.positive ? '#3a674480' : '#a04c5580'}`
                          }}
                          title={`第${stat.day}天: ${stat.profit >= 0 ? '+' : ''}${stat.profit}`}
                        />
                        <span className="font-pixel text-xs text-a0a0a0 mt-1">
                          D{stat.day}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </PixelPanel>
            )}

            {dailyStats.length > 0 && (
              <PixelPanel variant="dark">
                <div className="p-4">
                  <h3 className="font-pixel text-sm text-f0e6d2 mb-4">📋 每日明细</h3>
                  <div className="space-y-2">
                    {dailyStats.slice().reverse().slice(0, 7).map(stat => (
                      <div
                        key={stat.day}
                        className="flex items-center justify-between p-2"
                        style={{
                          backgroundColor: '#1a2744',
                          border: '2px solid #0a1724'
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-4a6fa5" />
                          <span className="font-pixel text-xs text-f0e6d2">第 {stat.day} 天</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-pixel text-xs text-6a8c5f">
                            +{stat.income}
                          </span>
                          <span className="font-pixel text-xs text-e06c75">
                            -{stat.expense}
                          </span>
                          <span className="font-pixel text-xs text-a0a0a0">
                            📦 {stat.ordersCompleted}
                          </span>
                          <span className={`font-pixel text-xs ${stat.profit >= 0 ? 'text-6a8c5f' : 'text-e06c75'}`}>
                            {stat.profit >= 0 ? '+' : ''}{stat.profit}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </PixelPanel>
            )}
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-4">
            <PixelPanel variant="dark">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-pixel text-sm text-f0e6d2">成就进度</h3>
                  <span className="font-pixel text-xs text-e8c170">
                    {unlockedCount} / {totalAchievements}
                  </span>
                </div>
                <ProgressBar
                  value={unlockedCount}
                  max={totalAchievements}
                  size="md"
                  color="#e8c170"
                />
              </div>
            </PixelPanel>

            {achievements.map(achievement => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        )}

        {activeTab === 'collections' && (
          <CollectionPanelWrapper />
        )}
      </div>

      <BottomNav />
    </div>
  );
};
