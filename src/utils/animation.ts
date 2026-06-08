export const easeInOutQuad = (t: number): number => {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
};

export const easeOutQuad = (t: number): number => {
  return t * (2 - t);
};

export const easeInQuad = (t: number): number => {
  return t * t;
};

export const lerp = (start: number, end: number, t: number): number => {
  return start + (end - start) * t;
};

export const lerpPosition = (
  start: { x: number; y: number },
  end: { x: number; y: number },
  t: number
): { x: number; y: number } => {
  return {
    x: lerp(start.x, end.x, t),
    y: lerp(start.y, end.y, t)
  };
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

export const wave = (time: number, frequency: number = 1, amplitude: number = 1): number => {
  return Math.sin(time * frequency) * amplitude;
};

export const pingPong = (time: number, length: number = 1): number => {
  const t = (time % (length * 2)) / length;
  return t > 1 ? 2 - t : t;
};

export class FrameAnimation {
  private frames: number = 0;
  private frameCount: number;
  private frameDuration: number;
  private lastTime: number = 0;
  private onFrame: (frame: number) => void;
  private playing: boolean = false;

  constructor(frameCount: number, frameDuration: number, onFrame: (frame: number) => void) {
    this.frameCount = frameCount;
    this.frameDuration = frameDuration;
    this.onFrame = onFrame;
  }

  start(): void {
    this.playing = true;
    this.lastTime = performance.now();
    this.animate();
  }

  stop(): void {
    this.playing = false;
  }

  private animate(): void {
    if (this.playing) {
      const now = performance.now();
      const delta = now - this.lastTime;
      
      if (delta >= this.frameDuration) {
        this.frames = (this.frames + 1) % this.frameCount;
        this.onFrame(this.frames);
        this.lastTime = now;
      }
      
      requestAnimationFrame(() => this.animate());
    }
  }

  reset(): void {
    this.frames = 0;
    this.onFrame(0);
  }
}

export class Tween {
  private startTime: number = 0;
  private duration: number;
  private from: number;
  private to: number;
  private onUpdate: (value: number) => void;
  private onComplete?: () => void;
  private easing: (t: number) => number;
  private playing: boolean = false;

  constructor(
    from: number,
    to: number,
    duration: number,
    onUpdate: (value: number) => void,
    onComplete?: () => void,
    easing: (t: number) => number = easeInOutQuad
  ) {
    this.from = from;
    this.to = to;
    this.duration = duration;
    this.onUpdate = onUpdate;
    this.onComplete = onComplete;
    this.easing = easing;
  }

  start(): void {
    this.playing = true;
    this.startTime = performance.now();
    this.animate();
  }

  stop(): void {
    this.playing = false;
  }

  private animate(): void {
    if (this.playing) {
      const now = performance.now();
      const elapsed = now - this.startTime;
      const progress = Math.min(1, elapsed / this.duration);
      const easedProgress = this.easing(progress);
      const value = this.from + (this.to - this.from) * easedProgress;
      
      this.onUpdate(value);
      
      if (progress < 1) {
        requestAnimationFrame(() => this.animate());
      } else {
        this.playing = false;
        this.onComplete?.();
      }
    }
  }
}

export const createShakeAnimation = (
  intensity: number = 5,
  duration: number = 300
): { x: number; y: number } => {
  const time = performance.now() % duration;
  const progress = 1 - time / duration;
  const shake = intensity * progress;
  return {
    x: (Math.random() - 0.5) * shake * 2,
    y: (Math.random() - 0.5) * shake * 2
  };
};
