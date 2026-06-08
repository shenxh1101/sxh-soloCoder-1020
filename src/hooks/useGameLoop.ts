import { useEffect, useRef } from 'react';

interface GameLoopOptions {
  onTick: (deltaTime: number) => void;
  onRender?: (deltaTime: number) => void;
  tickRate?: number;
  enabled?: boolean;
}

export const useGameLoop = ({
  onTick,
  onRender,
  tickRate = 60,
  enabled = true
}: GameLoopOptions) => {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const accumulatorRef = useRef<number>(0);
  const tickIntervalRef = useRef<number>(1000 / tickRate);

  useEffect(() => {
    if (!enabled) {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      return;
    }

    const animate = (time: number) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        accumulatorRef.current += deltaTime;

        while (accumulatorRef.current >= tickIntervalRef.current) {
          onTick(tickIntervalRef.current);
          accumulatorRef.current -= tickIntervalRef.current;
        }

        onRender?.(deltaTime);
      }

      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [onTick, onRender, tickRate, enabled]);
};
