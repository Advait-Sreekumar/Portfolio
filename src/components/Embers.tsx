"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface Ember {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  hueShift: number;
}

/**
 * Cinematic floating embers on a single GPU-friendly canvas.
 * Pauses when the tab is hidden; disabled entirely for reduced motion.
 */
export default function Embers() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = true;
    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const embers: Ember[] = [];

    const spawn = (randomY = false): Ember => {
      const maxLife = 6 + Math.random() * 8;
      return {
        x: Math.random() * w,
        y: randomY ? Math.random() * h : h + 10,
        vx: (Math.random() - 0.5) * 0.18,
        vy: -(0.25 + Math.random() * 0.55),
        size: 0.6 + Math.random() * 1.9,
        life: Math.random() * maxLife,
        maxLife,
        hueShift: Math.random(),
      };
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    const targetCount = Math.max(16, Math.min(42, Math.floor((w * h) / 45000)));
    for (let i = 0; i < targetCount; i++) embers.push(spawn(true));

    let t = 0;
    const tick = () => {
      if (!running) return;
      t += 0.008;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      for (let i = 0; i < embers.length; i++) {
        const e = embers[i];
        e.life += 0.016;
        if (e.life > e.maxLife || e.y < -12) {
          embers[i] = spawn();
          continue;
        }
        e.x += e.vx + Math.sin(t * 2 + i) * 0.12;
        e.y += e.vy;

        const lifeRatio = e.life / e.maxLife;
        const fade =
          lifeRatio < 0.15 ? lifeRatio / 0.15 : 1 - (lifeRatio - 0.15) / 0.85;
        const flicker = 0.72 + 0.28 * Math.sin(t * 7 + i * 3.7);

        // ember palette: #c65b2e -> #e8c98a
        const warm = e.hueShift > 0.5;
        const r = Math.round(warm ? 230 : 198);
        const g = Math.round(warm ? 201 : 91);
        const b = Math.round(warm ? 138 : 46);

        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${(0.5 * fade * flicker).toFixed(3)})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onVisibility = () => {
      running = !document.hidden;
      if (running) raf = requestAnimationFrame(tick);
      else cancelAnimationFrame(raf);
    };

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced]);

  if (reduced) return null;
  return <canvas ref={canvasRef} className="embers" aria-hidden="true" />;
}
