import React, { useEffect, useRef, useCallback } from 'react';
import { playThunderZap } from '../utils/audio';

interface LightningCanvasProps {
  interactive?: boolean;
  performanceMode?: boolean; // If true, reduced particle and flash frequency
  onStrikeTriggered?: () => void;
}

interface Point {
  x: number;
  y: number;
}

interface LightningBolt {
  segments: { start: Point; end: Point; width: number }[];
  alpha: number;
  branches: { start: Point; end: Point; width: number }[][];
}

export const LightningCanvas: React.FC<LightningCanvasProps> = ({
  performanceMode = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const boltsRef = useRef<LightningBolt[]>([]);
  const flashAlphaRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const lastStrikeTimeRef = useRef<number>(Date.now());

  // Procedural recursive fractal branch generator
  const createLightningBolt = useCallback(
    (startX: number, startY: number, endX: number, endY: number, maxBranches = 2): LightningBolt => {
      const segments: { start: Point; end: Point; width: number }[] = [];
      const branches: { start: Point; end: Point; width: number }[][] = [];

      const dx = endX - startX;
      const dy = endY - startY;
      const distance = Math.hypot(dx, dy);
      const steps = Math.max(6, Math.floor(distance / 25));

      let currentX = startX;
      let currentY = startY;

      for (let i = 0; i < steps; i++) {
        const progress = (i + 1) / steps;
        const targetX = startX + dx * progress;
        const targetY = startY + dy * progress;

        // Displace perpendicularly with jagged variation
        const displacement = (Math.random() - 0.5) * 45 * (1 - progress * 0.4);
        const normalX = -dy / distance;
        const normalY = dx / distance;

        const nextX = i === steps - 1 ? endX : targetX + normalX * displacement;
        const nextY = i === steps - 1 ? endY : targetY + normalY * displacement;

        segments.push({
          start: { x: currentX, y: currentY },
          end: { x: nextX, y: nextY },
          width: Math.max(1.2, 3.5 * (1 - progress * 0.6)),
        });

        // Chance of smaller branch splitting off
        if (maxBranches > 0 && Math.random() < 0.25 && i > 1 && i < steps - 2) {
          const branchSegments: { start: Point; end: Point; width: number }[] = [];
          let bCurrX = nextX;
          let bCurrY = nextY;
          const branchLength = 4;
          const branchAngle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 1.5;

          for (let b = 0; b < branchLength; b++) {
            const bDist = 18 + Math.random() * 20;
            const bNextX = bCurrX + Math.cos(branchAngle) * bDist + (Math.random() - 0.5) * 15;
            const bNextY = bCurrY + Math.sin(branchAngle) * bDist + (Math.random() - 0.5) * 15;
            branchSegments.push({
              start: { x: bCurrX, y: bCurrY },
              end: { x: bNextX, y: bNextY },
              width: Math.max(0.8, 1.8 * (1 - b / branchLength)),
            });
            bCurrX = bNextX;
            bCurrY = bNextY;
          }
          branches.push(branchSegments);
        }

        currentX = nextX;
        currentY = nextY;
      }

      return {
        segments,
        alpha: 1.0,
        branches,
      };
    },
    []
  );

  const triggerStrike = useCallback(
    (targetX?: number, targetY?: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const width = canvas.width;
      const height = canvas.height;

      const startX = targetX !== undefined ? targetX + (Math.random() - 0.5) * 200 : Math.random() * width;
      const startY = 0;
      const endX = targetX !== undefined ? targetX : (Math.random() * 0.8 + 0.1) * width;
      const endY = targetY !== undefined ? targetY : height * (0.6 + Math.random() * 0.35);

      const bolt = createLightningBolt(startX, startY, endX, endY);
      boltsRef.current.push(bolt);

      // Flash background atmospheric glow
      flashAlphaRef.current = 0.25;

      playThunderZap();
      lastStrikeTimeRef.current = Date.now();
    },
    [createLightningBolt]
  );

  // Resize canvas to match window / viewport
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Main rendering loop with micro-decay
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Flash illumination
      if (flashAlphaRef.current > 0.005) {
        ctx.fillStyle = `rgba(0, 160, 255, ${flashAlphaRef.current * 0.35})`;
        ctx.fillRect(0, 0, width, height);
        flashAlphaRef.current *= 0.82;
      }

      // Render lightning bolts
      for (let i = boltsRef.current.length - 1; i >= 0; i--) {
        const bolt = boltsRef.current[i];
        bolt.alpha *= 0.88; // decay rate

        if (bolt.alpha < 0.02) {
          boltsRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.scale(dpr, dpr);

        // 1. Outer Electric Cyan Glow
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 18;
        ctx.strokeStyle = `rgba(0, 150, 255, ${bolt.alpha * 0.8})`;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'bevel';

        ctx.beginPath();
        for (const seg of bolt.segments) {
          ctx.lineWidth = seg.width + 3;
          ctx.moveTo(seg.start.x, seg.start.y);
          ctx.lineTo(seg.end.x, seg.end.y);
        }
        ctx.stroke();

        // Outer glow on branches
        for (const branch of bolt.branches) {
          ctx.beginPath();
          for (const seg of branch) {
            ctx.lineWidth = seg.width + 2;
            ctx.moveTo(seg.start.x, seg.start.y);
            ctx.lineTo(seg.end.x, seg.end.y);
          }
          ctx.stroke();
        }

        // 2. Inner White-Hot Electrical Core
        ctx.shadowBlur = 4;
        ctx.shadowColor = '#ffffff';
        ctx.strokeStyle = `rgba(255, 255, 255, ${bolt.alpha})`;

        ctx.beginPath();
        for (const seg of bolt.segments) {
          ctx.lineWidth = seg.width * 0.8;
          ctx.moveTo(seg.start.x, seg.start.y);
          ctx.lineTo(seg.end.x, seg.end.y);
        }
        ctx.stroke();

        for (const branch of bolt.branches) {
          ctx.beginPath();
          for (const seg of branch) {
            ctx.lineWidth = seg.width * 0.6;
            ctx.moveTo(seg.start.x, seg.start.y);
            ctx.lineTo(seg.end.x, seg.end.y);
          }
          ctx.stroke();
        }

        ctx.restore();
      }

      // Randomized natural lightning strike cycle
      const interval = performanceMode ? 10000 : 5500;
      if (Date.now() - lastStrikeTimeRef.current > interval) {
        if (Math.random() < 0.35) {
          triggerStrike();
        }
        lastStrikeTimeRef.current = Date.now();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [triggerStrike, performanceMode]);

  // Global listener for custom trigger events from other components
  useEffect(() => {
    const handleCustomStrike = (e: Event) => {
      const customEvent = e as CustomEvent<{ x?: number; y?: number }>;
      triggerStrike(customEvent.detail?.x, customEvent.detail?.y);
    };

    window.addEventListener('trigger-lightning-strike', handleCustomStrike);
    return () => window.removeEventListener('trigger-lightning-strike', handleCustomStrike);
  }, [triggerStrike]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 w-full h-full mix-blend-screen opacity-90 transition-opacity duration-300"
      aria-hidden="true"
    />
  );
};

/**
 * Dispatch helper to trigger a manual strike from any button in the app
 */
export function dispatchLightningStrike(x?: number, y?: number) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('trigger-lightning-strike', {
        detail: { x, y },
      })
    );
  }
}
