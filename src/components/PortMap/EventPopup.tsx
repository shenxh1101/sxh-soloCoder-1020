import React from 'react';
import { X, CloudLightning, AlertTriangle, Wrench, Package } from 'lucide-react';
import { PixelPanel } from '../shared/PixelPanel';
import { PixelButton } from '../shared/PixelButton';
import { useUIStore } from '../../store/useUIStore';
import { useGameStore } from '../../store/useGameStore';
import { audioManager } from '../../utils/audio';
import type { GameEvent } from '../../types/game';

export const EventPopup: React.FC = () => {
  const { showEventPopup, currentEvent, hideEvent } = useUIStore();
  const { handleEvent, spendGold } = useGameStore();

  if (!showEventPopup || !currentEvent) return null;

  const eventIcons: Record<string, React.ReactNode> = {
    storm: <CloudLightning className="w-8 h-8 text-e06c75" />,
    shoal: <AlertTriangle className="w-8 h-8 text-e8c170" />,
    breakdown: <Wrench className="w-8 h-8 text-e06c75" />,
    new_order: <Package className="w-8 h-8 text-6a8c5f" />
  };

  const eventColors: Record<string, string> = {
    storm: '#e06c75',
    shoal: '#e8c170',
    breakdown: '#e06c75',
    new_order: '#6a8c5f'
  };

  const handleClose = () => {
    audioManager.playClick();
    hideEvent();
  };

  const handleRepair = () => {
    if (currentEvent.repairCost && currentEvent.shipId) {
      if (spendGold(currentEvent.repairCost)) {
        handleEvent(currentEvent);
        audioManager.playSuccess();
        hideEvent();
      }
    }
  };

  const handleWait = () => {
    audioManager.playClick();
    handleEvent(currentEvent);
    hideEvent();
  };

  const handleDismiss = () => {
    audioManager.playClick();
    if (currentEvent.type !== 'breakdown') {
      handleEvent(currentEvent);
    }
    hideEvent();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
      <PixelPanel
        variant="wood"
        className="w-96 animate-bounce-in"
        headerActions={
          <button
            onClick={handleClose}
            className="p-1 hover:bg-black/20 transition-colors"
          >
            <X className="w-5 h-5 text-f0e6d2" />
          </button>
        }
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <div
            className="p-4 rounded-full animate-pulse"
            style={{ backgroundColor: `${eventColors[currentEvent.type]}20` }}
          >
            {eventIcons[currentEvent.type]}
          </div>

          <div>
            <h3
              className="font-pixel text-xl mb-2"
              style={{ color: eventColors[currentEvent.type], letterSpacing: '2px' }}
            >
              {currentEvent.type === 'storm' && '暴风雨来袭！'}
              {currentEvent.type === 'shoal' && '船只搁浅！'}
              {currentEvent.type === 'breakdown' && '机械故障！'}
              {currentEvent.type === 'new_order' && '新订单到达！'}
            </h3>
            <p className="font-pixel text-sm text-f0e6d2 leading-relaxed">
              {currentEvent.message}
            </p>
          </div>

          {currentEvent.type === 'storm' && currentEvent.damage && (
            <div className="w-full p-3" style={{ backgroundColor: '#5a3a1a', border: '2px solid #3a2010' }}>
              <div className="font-pixel text-xs text-a0a0a0">预计船体损伤</div>
              <div className="font-pixel text-lg text-e06c75">-{currentEvent.damage}% 耐久度</div>
            </div>
          )}

          {currentEvent.type === 'breakdown' && currentEvent.repairCost && (
            <div className="w-full p-3" style={{ backgroundColor: '#5a3a1a', border: '2px solid #3a2010' }}>
              <div className="font-pixel text-xs text-a0a0a0">紧急维修费用</div>
              <div className="font-pixel text-lg text-e8c170">💰 {currentEvent.repairCost}</div>
            </div>
          )}

          {currentEvent.type === 'shoal' && currentEvent.delay && (
            <div className="w-full p-3" style={{ backgroundColor: '#5a3a1a', border: '2px solid #3a2010' }}>
              <div className="font-pixel text-xs text-a0a0a0">预计延误时间</div>
              <div className="font-pixel text-lg text-e8c170">⏱️ {currentEvent.delay}秒</div>
            </div>
          )}

          <div className="flex gap-3 w-full pt-2">
            {currentEvent.type === 'breakdown' ? (
              <>
                <PixelButton
                  variant="secondary"
                  className="flex-1"
                  onClick={handleWait}
                >
                  等待救援
                </PixelButton>
                <PixelButton
                  variant="success"
                  className="flex-1"
                  onClick={handleRepair}
                >
                  紧急维修
                </PixelButton>
              </>
            ) : (
              <PixelButton
                variant="primary"
                className="flex-1"
                onClick={handleDismiss}
              >
                确认
              </PixelButton>
            )}
          </div>
        </div>
      </PixelPanel>
    </div>
  );
};
