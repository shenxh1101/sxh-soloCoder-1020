import React, { useEffect, useRef, useState } from 'react';
import { Play, FolderOpen, Settings, Volume2, VolumeX } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { useGameStore } from '../../store/useGameStore';
import { hasSavedGame } from '../../utils/storage';
import { audioManager } from '../../utils/audio';
import { wave, FrameAnimation } from '../../utils/animation';

export const MainMenu: React.FC = () => {
  const { setCurrentPage } = useUIStore();
  const { loadSavedGame, resetGame } = useGameStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasSave, setHasSave] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const waveOffsetRef = useRef(0);

  useEffect(() => {
    setHasSave(hasSavedGame());
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;

    const waveAnim = new FrameAnimation(4, 200, (frame) => {
      waveOffsetRef.current = frame * 2;
    });
    waveAnim.start();

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;

      const gradient = ctx.createLinearGradient(0, 0, 0, h);
      gradient.addColorStop(0, '#1a2744');
      gradient.addColorStop(0.5, '#2a4764');
      gradient.addColorStop(1, '#3a6784');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < 30; i++) {
        const x = (i * 43 + Date.now() * 0.01) % w;
        const y = (i * 29) % (h * 0.4);
        const brightness = 0.5 + Math.sin(Date.now() * 0.003 + i) * 0.5;
        ctx.fillStyle = `rgba(255, 255, 200, ${brightness * 0.8})`;
        ctx.fillRect(Math.floor(x), Math.floor(y), 2, 2);
      }

      ctx.fillStyle = '#1a3a5a';
      ctx.beginPath();
      ctx.moveTo(0, h * 0.5);
      for (let x = 0; x <= w; x += 20) {
        const y = h * 0.5 + Math.sin(x * 0.02 + Date.now() * 0.001) * 10 - 30;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h * 0.5);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#2d5a7d';
      ctx.fillRect(0, h * 0.5, w, h * 0.5);

      for (let i = 0; i < w; i += 4) {
        const waveY = Math.sin((i + waveOffsetRef.current) * 0.05) * 3;
        ctx.fillStyle = '#4a8ab5';
        ctx.fillRect(i, h * 0.5 + waveY, 2, 1);
        ctx.fillStyle = '#6ab5d5';
        ctx.fillRect(i + 2, h * 0.5 - waveY, 2, 1);
      }

      const shipX = (Date.now() * 0.05) % (w + 60) - 60;
      const shipY = h * 0.5 + Math.sin(shipX * 0.02) * 5;
      ctx.fillStyle = '#8b5a2b';
      ctx.fillRect(shipX + 10, shipY, 40, 12);
      ctx.fillStyle = '#6b4423';
      ctx.fillRect(shipX + 8, shipY + 2, 44, 8);
      ctx.fillStyle = '#4a4a4a';
      ctx.fillRect(shipX + 28, shipY - 15, 4, 18);
      ctx.fillStyle = '#f0e6d2';
      ctx.fillRect(shipX + 32, shipY - 20, 12, 10);

      const lighthouseX = w * 0.8;
      ctx.fillStyle = '#8b5a2b';
      ctx.fillRect(lighthouseX - 20, h * 0.5 - 5, 40, 10);
      ctx.fillStyle = '#f0e6d2';
      ctx.fillRect(lighthouseX - 6, h * 0.5 - 40, 12, 35);
      ctx.fillStyle = '#e06c75';
      ctx.fillRect(lighthouseX - 8, h * 0.5 - 25, 16, 4);
      ctx.fillStyle = '#e8c170';
      ctx.fillRect(lighthouseX - 5, h * 0.5 - 50, 10, 10);
      const lightAngle = (Date.now() * 0.002) % (Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 150, 0.3)';
      ctx.beginPath();
      ctx.moveTo(lighthouseX, h * 0.5 - 45);
      ctx.lineTo(
        lighthouseX + Math.cos(lightAngle) * 100,
        h * 0.5 - 45 + Math.sin(lightAngle) * 100
      );
      ctx.lineTo(
        lighthouseX + Math.cos(lightAngle + 0.3) * 100,
        h * 0.5 - 45 + Math.sin(lightAngle + 0.3) * 100
      );
      ctx.closePath();
      ctx.fill();

      const seagullX = (Date.now() * 0.1) % (w + 40) - 40;
      const seagullY = h * 0.2 + Math.sin(seagullX * 0.03) * 10;
      ctx.fillStyle = '#fff';
      ctx.fillRect(seagullX, seagullY, 6, 2);
      ctx.fillRect(seagullX - 4, seagullY - 2, 4, 2);
      ctx.fillRect(seagullX + 6, seagullY - 2, 4, 2);

      requestAnimationFrame(render);
    };

    render();

    return () => {
      waveAnim.stop();
    };
  }, []);

  const handleNewGame = () => {
    audioManager.playClick();
    if (hasSave) {
      if (window.confirm('开始新游戏将覆盖现有存档，确定继续吗？')) {
        resetGame();
        setCurrentPage('port');
      }
    } else {
      resetGame();
      setCurrentPage('port');
    }
  };

  const handleContinue = () => {
    audioManager.playClick();
    if (loadSavedGame()) {
      setCurrentPage('port');
    }
  };

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    audioManager.setMusicEnabled(newState);
    audioManager.setSfxEnabled(newState);
    if (newState) {
      audioManager.playClick();
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ imageRendering: 'pixelated' }}>
      <canvas
        ref={canvasRef}
        width={1280}
        height={720}
        className="absolute inset-0 w-full h-full"
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="mb-12 text-center">
          <h1
            className="font-pixel text-6xl mb-4"
            style={{
              color: '#e8c170',
              textShadow: '4px 4px 0 #8b5a2b, 8px 8px 0 rgba(0,0,0,0.5)',
              letterSpacing: '8px',
              transform: `translateY(${wave(Date.now() * 0.003, 1, 3)}px)`
            }}
          >
            港湾岁月
          </h1>
          <p
            className="font-pixel text-xl"
            style={{
              color: '#f0e6d2',
              textShadow: '2px 2px 0 #1a2744',
              letterSpacing: '4px'
            }}
          >
            HARBOR YEARS
          </p>
          <p
            className="font-pixel text-sm mt-4"
            style={{
              color: '#a0a0a0',
              letterSpacing: '2px'
            }}
          >
            像素风港口经营物语
          </p>
        </div>

        <div className="flex flex-col gap-4 w-72">
          <button
            onClick={handleNewGame}
            className="flex items-center justify-center gap-3 px-8 py-4 font-pixel text-lg transition-all hover:-translate-y-1 active:translate-y-0"
            style={{
              backgroundColor: '#4a6fa5',
              color: '#f0e6d2',
              border: '4px solid #2a4f75',
              borderTopColor: '#6a8fc5',
              borderLeftColor: '#6a8fc5',
              boxShadow: '4px 4px 0 #1a3f55',
              letterSpacing: '4px'
            }}
          >
            <Play className="w-6 h-6" />
            新的航程
          </button>

          <button
            onClick={handleContinue}
            disabled={!hasSave}
            className={`flex items-center justify-center gap-3 px-8 py-4 font-pixel text-lg transition-all ${hasSave ? 'hover:-translate-y-1 active:translate-y-0' : 'opacity-50 cursor-not-allowed'}`}
            style={{
              backgroundColor: '#8b5a2b',
              color: '#f0e6d2',
              border: '4px solid #5b3a1b',
              borderTopColor: '#ab7a4b',
              borderLeftColor: '#ab7a4b',
              boxShadow: hasSave ? '4px 4px 0 #4b2a0b' : 'none',
              letterSpacing: '4px'
            }}
          >
            <FolderOpen className="w-6 h-6" />
            继续游戏
          </button>

          <button
            onClick={toggleSound}
            className="flex items-center justify-center gap-3 px-8 py-4 font-pixel text-lg transition-all hover:-translate-y-1 active:translate-y-0"
            style={{
              backgroundColor: '#6a8c5f',
              color: '#f0e6d2',
              border: '4px solid #3a5c2f',
              borderTopColor: '#8aac7f',
              borderLeftColor: '#8aac7f',
              boxShadow: '4px 4px 0 #2a4c1f',
              letterSpacing: '4px'
            }}
          >
            {soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
            {soundEnabled ? '音效开启' : '音效关闭'}
          </button>

          <button
            onClick={() => audioManager.playClick()}
            className="flex items-center justify-center gap-3 px-8 py-4 font-pixel text-lg transition-all hover:-translate-y-1 active:translate-y-0"
            style={{
              backgroundColor: '#6a6a6a',
              color: '#f0e6d2',
              border: '4px solid #3a3a3a',
              borderTopColor: '#8a8a8a',
              borderLeftColor: '#8a8a8a',
              boxShadow: '4px 4px 0 #2a2a2a',
              letterSpacing: '4px'
            }}
          >
            <Settings className="w-6 h-6" />
            游戏设置
          </button>
        </div>

        <div className="absolute bottom-8 font-pixel text-sm" style={{ color: '#888', letterSpacing: '2px' }}>
          版本 1.0.0 | 点击任意按钮开始你的港口之旅
        </div>
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)'
        }}
      />
    </div>
  );
};
