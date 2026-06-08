export class PixelRenderer {
  private ctx: CanvasRenderingContext2D;
  private scale: number;
  private width: number;
  private height: number;

  constructor(canvas: HTMLCanvasElement, scale: number = 4) {
    this.ctx = canvas.getContext('2d')!;
    this.scale = scale;
    this.width = canvas.width / scale;
    this.height = canvas.height / scale;
    this.ctx.imageSmoothingEnabled = false;
  }

  clear(color: string = '#1a2744'): void {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.width * this.scale, this.height * this.scale);
  }

  drawPixel(x: number, y: number, color: string): void {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(
      Math.floor(x) * this.scale,
      Math.floor(y) * this.scale,
      this.scale,
      this.scale
    );
  }

  drawRect(x: number, y: number, w: number, h: number, color: string): void {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(
      Math.floor(x) * this.scale,
      Math.floor(y) * this.scale,
      Math.floor(w) * this.scale,
      Math.floor(h) * this.scale
    );
  }

  drawRectBorder(x: number, y: number, w: number, h: number, fillColor: string, borderColor: string): void {
    this.drawRect(x, y, w, h, fillColor);
    this.drawRect(x, y, w, 1, borderColor);
    this.drawRect(x, y + h - 1, w, 1, borderColor);
    this.drawRect(x, y, 1, h, borderColor);
    this.drawRect(x + w - 1, y, 1, h, borderColor);
  }

  drawPixelatedCircle(cx: number, cy: number, r: number, color: string): void {
    for (let y = -r; y <= r; y++) {
      for (let x = -r; x <= r; x++) {
        if (x * x + y * y <= r * r) {
          this.drawPixel(cx + x, cy + y, color);
        }
      }
    }
  }

  drawText(text: string, x: number, y: number, color: string, fontSize: number = 8): void {
    this.ctx.fillStyle = color;
    this.ctx.font = `${fontSize * this.scale}px "Press Start 2P", monospace`;
    this.ctx.fillText(
      text,
      x * this.scale,
      (y + fontSize) * this.scale
    );
  }

  drawShip(x: number, y: number, type: 'small' | 'medium' | 'large', color: string, bobOffset: number = 0): void {
    const sizes = {
      small: { w: 12, h: 6 },
      medium: { w: 18, h: 8 },
      large: { w: 24, h: 10 }
    };
    const size = sizes[type];
    const actualY = y + bobOffset;

    this.drawRect(x + 2, actualY + 2, size.w - 4, size.h - 2, color);
    this.drawRect(x + 1, actualY + 3, size.w - 2, size.h - 4, color);
    this.drawRect(x + 3, actualY + 1, size.w - 6, 1, '#8b5a2b');
    this.drawRect(x + size.w / 2 - 1, actualY - 3, 2, 4, '#4a4a4a');
    this.drawRect(x + size.w / 2 + 1, actualY - 4, 3, 3, '#f0e6d2');
  }

  drawDock(x: number, y: number, level: number): void {
    const colors = ['#6b4423', '#8b5a2b', '#a0724a'];
    const color = colors[level - 1] || colors[0];
    
    for (let i = 0; i < 3 + level; i++) {
      this.drawRect(x + i * 4, y, 3, 8, color);
      this.drawPixel(x + i * 4 + 1, y + 2, '#5a3a1a');
    }
    this.drawRect(x - 1, y - 1, 4 * (3 + level) - 1, 2, '#8b5a2b');
  }

  drawWarehouse(x: number, y: number, level: number): void {
    const w = 16 + level * 4;
    const h = 12 + level * 2;
    const colors = ['#8b6914', '#a07c1a', '#b89020'];
    const roofColors = ['#8b2500', '#a52a00', '#c03000'];
    
    this.drawRectBorder(x, y, w, h, colors[level - 1], '#4a3508');
    this.drawRect(x - 1, y - 3, w + 2, 4, roofColors[level - 1]);
    this.drawRect(x + 2, y - 4, w - 4, 2, roofColors[level - 1]);
    this.drawRect(x + w / 2 - 2, y + h - 5, 4, 5, '#4a3508');
    this.drawRect(x + 3, y + 3, 3, 3, '#4a6fa5');
    this.drawRect(x + w - 6, y + 3, 3, 3, '#4a6fa5');
  }

  drawWater(x: number, y: number, w: number, h: number, waveOffset: number): void {
    this.drawRect(x, y, w, h, '#2d4a6e');
    
    for (let i = 0; i < w; i += 4) {
      const waveY = Math.sin((i + waveOffset) * 0.3) * 1;
      this.drawPixel(x + i, y + Math.floor(h / 2 + waveY), '#4a6fa5');
      this.drawPixel(x + i + 2, y + Math.floor(h / 2 - waveY), '#5a7fb5');
    }
  }

  drawTree(x: number, y: number): void {
    this.drawRect(x + 2, y + 4, 2, 6, '#6b4423');
    this.drawPixelatedCircle(x + 3, y + 3, 4, '#2d5a27');
    this.drawPixelatedCircle(x + 3, y + 1, 3, '#3d7a37');
  }

  drawDecoration(x: number, y: number, type: string): void {
    if (type === 'lighthouse') {
      this.drawRect(x + 2, y + 6, 4, 10, '#f0e6d2');
      this.drawRect(x + 1, y + 7, 1, 8, '#c0a080');
      this.drawRect(x + 6, y + 7, 1, 8, '#c0a080');
      this.drawRect(x + 1, y + 10, 6, 2, '#e06c75');
      this.drawRect(x + 2, y + 2, 4, 4, '#e8c170');
      this.drawPixel(x + 4, y, '#ffff00');
    } else if (type === 'statue') {
      this.drawRect(x + 2, y + 8, 4, 2, '#6a6a6a');
      this.drawRect(x + 3, y + 3, 2, 5, '#8a8a8a');
      this.drawPixelatedCircle(x + 4, y + 1, 2, '#aaaaaa');
    } else {
      this.drawRect(x, y + 8, 8, 2, '#6a8c5f');
      this.drawRect(x + 2, y + 5, 4, 3, '#6a8c5f');
      this.drawPixel(x + 4, y + 3, '#e06c75');
    }
  }

  drawCargoIcon(x: number, y: number, type: string): void {
    const icons: Record<string, string> = {
      wood: '#8b5a2b',
      coal: '#2a2a2a',
      grain: '#e8c170',
      textiles: '#e06c75',
      machinery: '#6a6a6a',
      luxury: '#d4af37'
    };
    const color = icons[type] || '#888';
    this.drawRectBorder(x, y, 6, 6, color, '#333');
    this.drawPixel(x + 2, y + 2, '#fff');
  }

  drawWeather(x: number, y: number, weather: string): void {
    if (weather === 'sunny') {
      this.drawPixelatedCircle(x + 4, y + 4, 3, '#ffd700');
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        this.drawPixel(
          x + 4 + Math.round(Math.cos(angle) * 5),
          y + 4 + Math.round(Math.sin(angle) * 5),
          '#ffd700'
        );
      }
    } else if (weather === 'rainy') {
      this.drawRect(x, y + 2, 10, 3, '#8a8a8a');
      this.drawRect(x + 2, y + 1, 6, 2, '#9a9a9a');
      this.drawPixel(x + 2, y + 6, '#4a6fa5');
      this.drawPixel(x + 5, y + 7, '#4a6fa5');
      this.drawPixel(x + 8, y + 6, '#4a6fa5');
    } else {
      this.drawRect(x, y + 2, 10, 3, '#5a5a5a');
      this.drawRect(x + 2, y + 1, 6, 2, '#6a6a6a');
      this.drawPixel(x + 1, y + 5, '#ffff00');
      this.drawPixel(x + 3, y + 6, '#ffff00');
      this.drawPixel(x + 2, y + 7, '#ffff00');
    }
  }

  getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }

  getScale(): number {
    return this.scale;
  }
}
