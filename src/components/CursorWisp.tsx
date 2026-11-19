"use client";

import { useEffect, useRef } from "react";

interface Wisp {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

/**
 * Ember cursor wisp — the pointer trails tiny brass embers.
 * Desktop fine pointers only; disabled for reduced motion; the loop
 * parks itself whenever there is nothing to draw.
 */
export default function CursorWisp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const particles: Wisp[] = [];
    let raf = 0;
    let running = false;
    let skip = 0;

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const onMove = (e: PointerEvent) => {
      if (++skip % 2) return; // every other event — keeps density tasteful
      if (particles.length > 80) particles.shift();
      particles.push({
        x: e.clientX + (Math.random() - 0.5) * 6,
        y: e.clientY + (Math.random() - 0.5) * 6,
        vx: (Math.random() - 0.5) * 0.7,
        vy: -(0.35 + Math.random() * 0.75),
        life: 0,
        maxLife: 0.4 + Math.random() * 0.3,
        size: 0.8 + Math.random() * 1.6,
      });
      kick();
    };

    const step = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      const now = performance.now();
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += 1 / 60;
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.008; // embers drift upward
        const k = 1 - p.life / p.maxLife;
        ctx.globalAlpha = k * 0.55;
        ctx.fillStyle = "#e8c98a";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * k, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = k * 0.18;
        ctx.fillStyle = "#c65b2e";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.6 * k, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      void now;

      if (particles.length === 0) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(step);
    };

    const kick = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(step);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      running = false;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    return null;

  return <canvas ref={canvasRef} className="cursor-wisp" aria-hidden="true" />;
}
