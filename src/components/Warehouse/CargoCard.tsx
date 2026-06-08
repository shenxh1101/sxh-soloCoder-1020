import React, { useState } from 'react';
import { Package, TrendingUp, TrendingDown, Minus, Plus, ArrowRight } from 'lucide-react';
import { PixelPanel } from '../shared/PixelPanel';
import { PixelButton } from '../shared/PixelButton';
import { ProgressBar } from '../shared/ProgressBar';
import { useGameStore } from '../../store/useGameStore';
import { audioManager } from '../../utils/audio';
import type { CargoItem, Building } from '../../types/game';

interface CargoCardProps {
  cargo: CargoItem;
  warehouses: Building[];
}

export const CargoCard: React.FC<CargoCardProps> = ({ cargo, warehouses }) => {
  const { removeCargo, addCargo, gold } = useGameStore();
  const [transferAmount, setTransferAmount] = useState(1);

  const cargoTypeColors: Record<string, string> = {
    wood: '#8B4513',
    coal: '#333333',
    grain: '#DAA520',
    textiles: '#9370DB',
    machinery: '#708090',
    luxury: '#FFD700'
  };

  const totalCapacity = warehouses.reduce((sum, w) => sum + w.level * 200, 0);
  const totalUsed = warehouses.reduce((sum, w) => sum + w.level * 200, 0) - 
    warehouses.reduce((sum, w) => sum + (w.level * 200 - 50), 0);

  const transferOutCost = transferAmount * 10;
  const transferInCost = Math.floor(transferAmount * cargo.value * 0.1);

  const handleTransferOut = () => {
    removeCargo(cargo.id, transferAmount, transferOutCost);
  };

  const handleTransferIn = () => {
    const newCargo = {
      ...cargo,
      id: `stock_${Date.now()}`,
      weight: transferAmount
    };
    addCargo(newCargo, transferInCost);
  };

  const unitPrice = cargo.value;

  return (
    <PixelPanel variant="dark">
      <div className="p-4">
        <div className="flex items-start gap-4 mb-3">
          <div
            className="text-4xl p-3 flex-shrink-0"
            style={{
              backgroundColor: cargoTypeColors[cargo.type] + '40',
              border: `3px solid ${cargoTypeColors[cargo.type]}`,
              boxShadow: `2px 2px 0 ${cargoTypeColors[cargo.type]}80`
            }}
          >
            {cargo.icon}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-pixel text-sm text-f0e6d2">{cargo.name}</h4>
              <span className="font-pixel text-xs text-e8c170">
                💰 {unitPrice}/吨
              </span>
            </div>
            
            <div className="font-pixel text-xs text-a0a0a0 mb-3">
              库存: <span className="text-f0e6d2">{cargo.weight} 吨</span>
            </div>

            <ProgressBar
              value={cargo.weight}
              max={totalCapacity / warehouses.length}
              label="仓库占用"
              showValue
              size="sm"
              color="#4a6fa5"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTransferAmount(Math.max(1, transferAmount - 1))}
              className="p-2 hover:bg-#2a3754 transition-colors"
              style={{
                backgroundColor: '#1a2744',
                border: '2px solid #0a1724',
                boxShadow: '1px 1px 0 #0a1724'
              }}
            >
              <Minus className="w-4 h-4 text-f0e6d2" />
            </button>
            <span className="font-pixel text-sm text-f0e6d2 w-16 text-center">
              {transferAmount} 吨
            </span>
            <button
              onClick={() => setTransferAmount(Math.min(cargo.weight, transferAmount + 1))}
              className="p-2 hover:bg-#2a3754 transition-colors"
              style={{
                backgroundColor: '#1a2744',
                border: '2px solid #0a1724',
                boxShadow: '1px 1px 0 #0a1724'
              }}
            >
              <Plus className="w-4 h-4 text-f0e6d2" />
            </button>
          </div>

          <div className="flex gap-2">
            <PixelButton
              size="sm"
              variant="secondary"
              onClick={handleTransferOut}
              disabled={transferAmount > cargo.weight || gold < transferOutCost}
            >
              <TrendingDown className="w-4 h-4 mr-1" />
              调出 💰{transferOutCost}
            </PixelButton>
            <PixelButton
              size="sm"
              variant="success"
              onClick={handleTransferIn}
              disabled={gold < transferInCost}
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              调入 💰{transferInCost}
            </PixelButton>
          </div>
        </div>
      </div>
    </PixelPanel>
  );
};
