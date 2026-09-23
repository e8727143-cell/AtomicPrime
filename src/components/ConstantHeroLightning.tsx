import React, { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
}

interface BoltSegment {
  start: Point;
  end: Point;
  width: number;
}

interface ActiveBolt {
  segments: BoltSegment[];
  branches: BoltSegment[][];
  life: number;
  maxLife: number;
  glowColor: string;
}

export const ConstantHeroLightning: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let isMounted = true;

    const handleResize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = (rect.width || window.innerWidth) * dpr;
      canvas.height = (rect.height || window.innerHeight) * dpr;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const activeBolts: ActiveBolt[] = [];
    let flashIntensity = 0;

    // Helper to calculate next strike interval (1s, 3s, 5s, or 7s random interval)
    const getNextStrikeDelay = (): number => {
      const presets = [1100, 3000, 5000, 7000];
      const selected = presets[Math.floor(Math.random() * presets.length)];
      // Add slight organic jitter
      const jitter = (Math.random() - 0.5) * 500;
      return Math.max(900, selected + jitter);
    };

    let nextStrikeTime = Date.now() + 800; // First strike shortly after load

    // Helper to generate smooth fractal lightning path
    const generateFractalPath = (
      startX: number,
      startY: number,
      endX: number,
      endY: number,
      displace: number
    ): { segments: BoltSegment[]; branches: BoltSegment[][] } => {
      const segments: BoltSegment[] = [];
      const branches: BoltSegment[][] = [];

      const dx = endX - startX;
      const dy = endY - startY;
      const dist = Math.hypot(dx, dy);
      const steps = Math.max(6, Math.floor(dist / 26));

      let currX = startX;
      let currY = startY;

      for (let i = 0; i < steps; i++) {
        const prog = (i + 1) / steps;
        const targetX = startX + dx * prog;
        const targetY = startY + dy * prog;

        const normalX = -dy / dist;
        const normalY = dx / dist;
        const offset = (Math.random() - 0.5) * displace * (1 - prog * 0.25);

        const nextX = i === steps - 1 ? endX : targetX + normalX * offset;
        const nextY = i === steps - 1 ? endY : targetY + normalY * offset;

        segments.push({
          start: { x: currX, y: currY },
          end: { x: nextX, y: nextY },
          width: Math.max(1.0, 2.8 * (1 - prog * 0.45)),
        });

        // Occasional soft mini branch
        if (Math.random() < 0.28 && i > 1 && i < steps - 1) {
          const branchSegs: BoltSegment[] = [];
          let bX = nextX;
          let bY = nextY;
          const branchAngle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 1.4;
          const branchLen = 2 + Math.floor(Math.random() * 3);

          for (let b = 0; b < branchLen; b++) {
            const bDist = 12 + Math.random() * 14;
            const bNextX = bX + Math.cos(branchAngle) * bDist;
            const bNextY = bY + Math.sin(branchAngle) * bDist;
            branchSegs.push({
              start: { x: bX, y: bY },
              end: { x: bNextX, y: bNextY },
              width: Math.max(0.6, 1.4 * (1 - b / branchLen)),
            });
            bX = bNextX;
            bY = bNextY;
          }
          branches.push(branchSegs);
        }

        currX = nextX;
        currY = nextY;
      }

      return { segments, branches };
    };

    const spawnGentleStrike = (width: number, height: number, dpr: number) => {
      const startX = (width / dpr) * (0.15 + Math.random() * 0.7);
      const startY = 0;
      const endX = (width / dpr) * (0.1 + Math.random() * 0.8);
      const endY = (height / dpr) * (0.5 + Math.random() * 0.45);

      const { segments, branches } = generateFractalPath(startX, startY, endX, endY, 35);

      // Smooth life span ~38-48 frames (~650ms to 800ms) with gentle fade
      activeBolts.push({
        segments,
        branches,
        life: 0,
        maxLife: 38 + Math.floor(Math.random() * 12),
        glowColor: Math.random() > 0.4 ? '#00e5ff' : '#0077ff',
      });

      // Soft ambient pulse (subtle, non-jarring)
      flashIntensity = 0.18;
    };

    const render = () => {
      if (!isMounted) return;

      const width = canvas.width;
      const height = canvas.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      ctx.clearRect(0, 0, width, height);

      const now = Date.now();
      // Check if it's time for the next intermittent strike (1s, 3s, 5s, or 7s)
      if (now >= nextStrikeTime) {
        spawnGentleStrike(width, height, dpr);
        // Sometimes create a secondary sympathetic soft branch
        if (Math.random() < 0.3) {
          setTimeout(() => {
            if (isMounted) spawnGentleStrike(width, height, dpr);
          }, 120);
        }
        nextStrikeTime = now + getNextStrikeDelay();
      }

      // Draw gentle ambient glow
      if (flashIntensity > 0.005) {
        ctx.fillStyle = `rgba(0, 119, 255, ${flashIntensity * 0.25})`;
        ctx.fillRect(0, 0, width, height);
        flashIntensity *= 0.91; // Smooth soft decay
      }

      // Render living bolts with smooth ease-in and soft decay
      ctx.save();
      ctx.scale(dpr, dpr);

      for (let i = activeBolts.length - 1; i >= 0; i--) {
        const bolt = activeBolts[i];
        bolt.life++;

        const progress = bolt.life / bolt.maxLife;
        if (progress >= 1) {
          activeBolts.splice(i, 1);
          continue;
        }

        // Smooth curve: rapid soft rise (first 15%), then graceful exponential decay
        let alpha = 0;
        if (progress < 0.15) {
          alpha = Math.sin((progress / 0.15) * (Math.PI / 2));
        } else {
          const fadeProg = (progress - 0.15) / 0.85;
          // Smooth power curve for natural dissipation
          alpha = Math.pow(1 - fadeProg, 2.2);
        }

        if (alpha <= 0.01) continue;

        // 1. Electric Outer Soft Blue/Cyan Aura
        ctx.shadowColor = bolt.glowColor;
        ctx.shadowBlur = 18;
        ctx.strokeStyle = `rgba(0, 180, 255, ${alpha * 0.75})`;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        for (const seg of bolt.segments) {
          ctx.lineWidth = seg.width + 2.5;
          ctx.moveTo(seg.start.x, seg.start.y);
          ctx.lineTo(seg.end.x, seg.end.y);
        }
        ctx.stroke();

        for (const branch of bolt.branches) {
          ctx.beginPath();
          for (const seg of branch) {
            ctx.lineWidth = seg.width + 1.5;
            ctx.moveTo(seg.start.x, seg.start.y);
            ctx.lineTo(seg.end.x, seg.end.y);
          }
          ctx.stroke();
        }

        // 2. Pure White Core Line
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 5;
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;

        ctx.beginPath();
        for (const seg of bolt.segments) {
          ctx.lineWidth = seg.width * 0.75;
          ctx.moveTo(seg.start.x, seg.start.y);
          ctx.lineTo(seg.end.x, seg.end.y);
        }
        ctx.stroke();

        for (const branch of bolt.branches) {
          ctx.beginPath();
          for (const seg of branch) {
            ctx.lineWidth = seg.width * 0.55;
            ctx.moveTo(seg.start.x, seg.start.y);
            ctx.lineTo(seg.end.x, seg.end.y);
          }
          ctx.stroke();
        }
      }

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      isMounted = false;
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10 w-full h-full mix-blend-screen opacity-90"
      aria-hidden="true"
    />
  );
};
