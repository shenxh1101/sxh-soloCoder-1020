import React, { useState, useEffect } from 'react';
import { TopBar } from '../shared/TopBar';
import { BottomNav } from '../shared/BottomNav';
import { MapCanvas } from './MapCanvas';
import { BuildPanel } from './BuildPanel';
import { EventPopup } from './EventPopup';
import { useGameStore } from '../../store/useGameStore';
import { useUIStore } from '../../store/useUIStore';
import { eventSystem } from '../../engine/EventSystem';
import { buildingConfigs } from '../../data/mockData';
import { useGameLoop } from '../../hooks/useGameLoop';
import { GameEngine } from '../../engine/GameEngine';
import { audioManager } from '../../utils/audio';
import type { BuildingType, GameEvent } from '../../types/game';

export const PortMap: React.FC = () => {
  const [selectedBuildType, setSelectedBuildType] = useState<BuildingType | null>(null);
  const [gameEngine, setGameEngine] = useState<GameEngine | null>(null);
  const { buildings, addBuilding, setGameState, gold } = useGameStore();
  const { showEvent, addNotification } = useUIStore();

  useEffect(() => {
    const state = useGameStore.getState();
    const engine = new GameEngine(state, (updates) => {
      setGameState(updates);
    });
    setGameEngine(engine);

    const unsubscribe = eventSystem.subscribe((event: GameEvent) => {
      showEvent(event);
      addNotification({
        type: event.type === 'new_order' ? 'success' : 'warning',
        message: event.message
      });
    });

    return unsubscribe;
  }, [setGameState, showEvent, addNotification]);

  useGameLoop({
    onTick: (deltaTime) => {
      if (gameEngine) {
        const state = useGameStore.getState();
        gameEngine.updateState(state);
        gameEngine.tick(deltaTime);

        const ships = useGameStore.getState().ships;
        ships.forEach((ship) => {
          if (ship.status === 'idle' && ship.currentOrder) {
            const order = useGameStore.getState().orders.find(o => o.id === ship.currentOrder);
            if (order && order.status === 'accepted') {
              useGameStore.getState().completeOrder(order.id);
              audioManager.playSuccess();
              addNotification({
                type: 'success',
                message: `${ship.name} 完成了运输任务！获得 ${order.reward} 金币`
              });
            }
          }
        });
      }
    },
    enabled: !!gameEngine
  });

  const handleCellClick = (x: number, y: number) => {
    if (!selectedBuildType) return;

    const existingBuilding = buildings.find(
      (b) => b.position.x === x && b.position.y === y
    );

    if (existingBuilding) {
      audioManager.playError();
      addNotification({
        type: 'error',
        message: '该位置已有建筑！'
      });
      return;
    }

    if (y < 3) {
      audioManager.playError();
      addNotification({
        type: 'error',
        message: '只能在靠近水域的位置建造！'
      });
      return;
    }

    const config = buildingConfigs.find(c => c.type === selectedBuildType);
    if (!config || gold < config.cost) {
      audioManager.playError();
      addNotification({
        type: 'error',
        message: '金币不足！'
      });
      return;
    }

    const newBuilding = {
      id: `${selectedBuildType}_${Date.now()}`,
      type: selectedBuildType,
      level: 1 as const,
      position: { x, y },
      status: 'operational' as const
    };

    useGameStore.getState().spendGold(config.cost);
    addBuilding(newBuilding);
    setSelectedBuildType(null);
    
    addNotification({
      type: 'success',
      message: `${config.name} 建造完成！`
    });
  };

  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: '#0a1724' }}>
      <TopBar />
      
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 p-4 overflow-auto">
          <MapCanvas
            onCellClick={handleCellClick}
            selectedBuildType={selectedBuildType}
          />
        </div>
        
        <div className="w-80 p-4 overflow-y-auto" style={{ backgroundColor: '#1a2744' }}>
          <BuildPanel
            selectedBuildType={selectedBuildType}
            onSelectBuildType={setSelectedBuildType}
          />
        </div>
      </div>
      
      <BottomNav />
      <EventPopup />
    </div>
  );
};
