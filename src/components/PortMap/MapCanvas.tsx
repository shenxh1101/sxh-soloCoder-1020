import React, { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { PixelRenderer } from '../../utils/pixelRenderer';
import { wave } from '../../utils/animation';

interface MapCanvasProps {
  onCellClick?: (x: number, y: number) => void;
  selectedBuildType?: string | null;
}

const GRID_WIDTH = 12;
const GRID_HEIGHT = 8;
const CELL_SIZE = 64;

export const MapCanvas: React.FC<MapCanvasProps> = ({ onCellClick, selectedBuildType }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<PixelRenderer | null>(null);
  const hoveredCellRef = useRef<{ x: number; y: number } | null>(null);
  const waveOffsetRef = useRef(0);

  const { buildings, ships, cargo, weather, unlockedSections } = useGameStore();

  const getCellPosition = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = Math.floor((clientX - rect.left) * scaleX / (CELL_SIZE * 4));
    const y = Math.floor((clientY - rect.top) * scaleY / (CELL_SIZE * 4));
    
    if (x >= 0 && x < GRID_WIDTH && y >= 0 && y < GRID_HEIGHT) {
      return { x, y };
    }
    return null;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new PixelRenderer(canvas, 4);
    rendererRef.current = renderer;

    let animationId: number;
    let lastTime = 0;

    const render = (time: number) => {
      const deltaTime = time - lastTime;
      lastTime = time;

      waveOffsetRef.current += deltaTime * 0.005;

      renderer.clear('#1a2744');

      const waterY = 4;
      renderer.drawWater(0, waterY * CELL_SIZE, GRID_WIDTH * CELL_SIZE, (GRID_HEIGHT - waterY) * CELL_SIZE, waveOffsetRef.current);

      for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
          const px = x * CELL_SIZE;
          const py = y * CELL_SIZE;

          if (y < waterY) {
            const grassColor = (x + y) % 2 === 0 ? '#3d5a27' : '#4a6a37';
            renderer.drawRect(px, py, CELL_SIZE, CELL_SIZE, grassColor);
            
            if ((x * 7 + y * 13) % 11 === 0 && y < waterY - 1) {
              renderer.drawTree(px + 24, py + 20);
            }
          }

          if (x === 0 || x === GRID_WIDTH - 1 || y === 0 || y === GRID_HEIGHT - 1) {
            renderer.drawRect(px, py, CELL_SIZE, 1, '#0a1724');
            renderer.drawRect(px, py + CELL_SIZE - 1, CELL_SIZE, 1, '#0a1724');
            renderer.drawRect(px, py, 1, CELL_SIZE, '#0a1724');
            renderer.drawRect(px + CELL_SIZE - 1, py, 1, CELL_SIZE, '#0a1724');
          }
        }
      }

      buildings.forEach((building) => {
        const px = building.position.x * CELL_SIZE;
        const py = building.position.y * CELL_SIZE;

        if (building.type === 'dock') {
          renderer.drawDock(px + 8, py + 16, building.level);
        } else if (building.type === 'warehouse') {
          renderer.drawWarehouse(px + 16, py + 12, building.level);
        } else if (building.type === 'decoration') {
          renderer.drawDecoration(px + 20, py + 16, 'lighthouse');
        }

        if (building.status === 'building') {
          const progress = building.buildProgress || 0;
          renderer.drawRect(px + 4, py - 6, CELL_SIZE - 8, 4, '#2a2a2a');
          renderer.drawRect(px + 4, py - 6, (CELL_SIZE - 8) * progress, 4, '#6a8c5f');
        }
      });

      ships.forEach((ship) => {
        const px = ship.position.x * CELL_SIZE;
        const py = ship.position.y * CELL_SIZE;
        const bobOffset = Math.sin(waveOffsetRef.current + ship.position.x) * 2;

        let shipColor = '#4a6fa5';
        if (ship.status === 'repairing') shipColor = '#e06c75';
        if (ship.status === 'loading') shipColor = '#e8c170';
        if (ship.status === 'sailing') shipColor = '#6a8c5f';

        renderer.drawShip(px + 16, py + 20 + bobOffset, ship.type, shipColor);

        if (ship.status === 'loading' || ship.status === 'repairing') {
          renderer.drawRect(px + 8, py + 44, CELL_SIZE - 16, 4, '#2a2a2a');
          renderer.drawRect(px + 8, py + 44, (CELL_SIZE - 16) * ship.progress, 4, '#6a8c5f');
        }

        if (ship.status === 'sailing' && ship.targetPosition) {
          const tx = ship.targetPosition.x * CELL_SIZE + CELL_SIZE / 2;
          const ty = ship.targetPosition.y * CELL_SIZE + CELL_SIZE / 2;
          const cx = px + CELL_SIZE / 2;
          const cy = py + CELL_SIZE / 2;
          
          const ctx = renderer.getContext();
          ctx.strokeStyle = 'rgba(232, 193, 112, 0.5)';
          ctx.lineWidth = 2 * renderer.getScale();
          ctx.setLineDash([4 * renderer.getScale(), 4 * renderer.getScale()]);
          ctx.beginPath();
          ctx.moveTo(cx * renderer.getScale(), cy * renderer.getScale());
          ctx.lineTo(tx * renderer.getScale(), ty * renderer.getScale());
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });

      if (hoveredCellRef.current && selectedBuildType) {
        const { x, y } = hoveredCellRef.current;
        const px = x * CELL_SIZE;
        const py = y * CELL_SIZE;

        const existingBuilding = buildings.find(
          (b) => b.position.x === x && b.position.y === y
        );

        if (!existingBuilding && y >= waterY - 1) {
          renderer.drawRect(px, py, CELL_SIZE, CELL_SIZE, 'rgba(106, 140, 95, 0.3)');
          renderer.drawRect(px, py, CELL_SIZE, 2, 'rgba(106, 140, 95, 0.8)');
          renderer.drawRect(px, py + CELL_SIZE - 2, CELL_SIZE, 2, 'rgba(106, 140, 95, 0.8)');
          renderer.drawRect(px, py, 2, CELL_SIZE, 'rgba(106, 140, 95, 0.8)');
          renderer.drawRect(px + CELL_SIZE - 2, py, 2, CELL_SIZE, 'rgba(106, 140, 95, 0.8)');
        } else if (existingBuilding) {
          renderer.drawRect(px, py, CELL_SIZE, CELL_SIZE, 'rgba(224, 108, 117, 0.3)');
        }
      }

      if (weather === 'rainy' || weather === 'stormy') {
        const ctx = renderer.getContext();
        ctx.fillStyle = weather === 'stormy' ? 'rgba(100, 150, 200, 0.4)' : 'rgba(100, 150, 200, 0.2)';
        for (let i = 0; i < 100; i++) {
          const rx = ((i * 127 + Date.now() * 0.3) % (GRID_WIDTH * CELL_SIZE)) * renderer.getScale();
          const ry = ((i * 89 + Date.now() * 0.5) % (GRID_HEIGHT * CELL_SIZE)) * renderer.getScale();
          ctx.fillRect(rx, ry, renderer.getScale(), renderer.getScale() * 4);
        }
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [buildings, ships, weather, selectedBuildType]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const cell = getCellPosition(e.clientX, e.clientY);
    hoveredCellRef.current = cell;
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const cell = getCellPosition(e.clientX, e.clientY);
    if (cell && onCellClick) {
      onCellClick(cell.x, cell.y);
    }
  };

  const handleMouseLeave = () => {
    hoveredCellRef.current = null;
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={GRID_WIDTH * CELL_SIZE * 4}
        height={GRID_HEIGHT * CELL_SIZE * 4}
        className="w-full cursor-crosshair"
        style={{ imageRendering: 'pixelated' }}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        onMouseLeave={handleMouseLeave}
      />
      
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)'
        }}
      />
    </div>
  );
};
