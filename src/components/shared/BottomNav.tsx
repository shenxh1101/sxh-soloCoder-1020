import React from 'react';
import { Map, Ship, ScrollText, Warehouse, Trophy } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { audioManager } from '../../utils/audio';

export const BottomNav: React.FC = () => {
  const { currentPage, setCurrentPage } = useUIStore();

  const navItems = [
    { id: 'port', icon: Map, label: '港口' },
    { id: 'fleet', icon: Ship, label: '船队' },
    { id: 'orders', icon: ScrollText, label: '订单' },
    { id: 'warehouse', icon: Warehouse, label: '仓库' },
    { id: 'achievements', icon: Trophy, label: '结算' }
  ];

  const handleNav = (page: string) => {
    audioManager.playClick();
    setCurrentPage(page);
  };

  return (
    <div
      className="flex items-center justify-center gap-2 px-4 py-3"
      style={{
        backgroundColor: '#1a2744',
        borderTop: '4px solid #0a1724',
        boxShadow: '0 -4px 0 rgba(0,0,0,0.3)'
      }}
    >
      {navItems.map((item) => {
        const isActive = currentPage === item.id;
        const Icon = item.icon;
        
        return (
          <button
            key={item.id}
            onClick={() => handleNav(item.id)}
            className={`
              flex flex-col items-center gap-1 px-6 py-2 transition-all
              ${isActive ? '' : 'hover:-translate-y-1 active:translate-y-0'}
            `}
            style={{
              backgroundColor: isActive ? '#4a6fa5' : '#2a3754',
              border: `3px solid ${isActive ? '#6a8fc5' : '#1a2744'}`,
              borderTopColor: isActive ? '#7a9fd5' : '#3a4764',
              borderLeftColor: isActive ? '#7a9fd5' : '#3a4764',
              boxShadow: isActive
                ? '0 -2px 0 #7a9fd5, 2px 2px 0 #1a2744'
                : '2px 2px 0 #0a1724'
            }}
          >
            <Icon
              className="w-6 h-6"
              style={{ color: isActive ? '#e8c170' : '#f0e6d2' }}
            />
            <span
              className="font-pixel text-xs"
              style={{ color: isActive ? '#e8c170' : '#f0e6d2' }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
