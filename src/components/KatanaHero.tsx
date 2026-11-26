"use client";

import { useEffect, useRef, useState } from "react";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useKatanaAudio } from "@/lib/useKatanaAudio";
import { profile } from "@/data/profile";

/* viewBox geometry (matches the SVG below) */
const VB_W = 2100;
const VB_X = -240;
const VB_H = 900;

/* intro choreography */
const REST_Y = 940;
const FINAL_Y = 410;
const MAX_DRAW = 480;
const HOLD_MS = 500;
const DRAW_MS = 3400;

/* spark anchors, viewBox units */
const MOUTH_X = 733;
const SEAM_HALF = 58;
const BLADE_BASE_X = 700;
const TSUBA_X = 792;

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

interface SparkBridge {
  emit?: (velocity: number, progress: number) => void;
  burst?: (count: number) => void;
  beginAmbient?: () => void;
  stopAmbient?: () => void;
}

/* hot → cool ember palette */
const SPARK_COLORS = [
  "#fffdf5",
  "#fff6df",
  "#ffe9b8",
  "#ffd27a",
  "#ffab5e",
  "#ff8a4a",
];

function pickColor(): string {
  return SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)];
}

/**
 * Cinematic horizontal katana intro.
 *
 * hold → rise + draw (sparks track draw velocity along the moving
 * blade-sheath contact point) → lock shake + clink + spark burst
 * → dual reflection sweeps → copy/nav reveal → scroll unlock.
 */
export default function KatanaHero() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparks = useRef<SparkBridge>({});
  const { muted, toggle: toggleSound, bridge: sounds } = useKatanaAudio();
  const [replay, setReplay] = useState(0);
  const [skip, setSkip] = useState(false);
  const reduced = useReducedMotion();

  /* ── spark particle engine ──────────────────────────────────────────
   * Tracks the blade-sheath contact point in world space (including the
   * rise offset) so sparks ride the actual seam while the blade slides. */
  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas || reduced) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let scale = 1;
    let offX = 0;
    let offY = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const particles: Spark[] = [];
    let raf = 0;
    let running = false;

    /* live pose of the rig, fed by emit() */
    let poseProgress = 0;
    let lastEmitAt = 0;
    let glow = 0;

    const measure = () => {
      const rect = stage.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas.width = Math.max(1, Math.floor(W * dpr));
      canvas.height = Math.max(1, Math.floor(H * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      scale = Math.min(W / VB_W, H / VB_H); // preserveAspectRatio xMidYMid meet
      offX = (W - VB_W * scale) / 2 - VB_X * scale;
      offY = (H - VB_H * scale) / 2;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);

    const riseYAt = (p: number) => REST_Y + (FINAL_Y - REST_Y) * p;

    const spawn = (
      sx: number,
      sy: number,
      ang: number,
      speed: number,
      boost = 1,
    ) => {
      if (particles.length > 260) particles.shift();
      const v = (1.7 + Math.random() * 4.1) * speed * boost;
      particles.push({
        x: offX + sx * scale,
        y: offY + (sy + riseYAt(poseProgress)) * scale,
        vx: Math.cos(ang) * v,
        vy: Math.sin(ang) * v,
        life: 0,
        maxLife: 0.3 + Math.random() * 0.42,
        size: 0.9 + Math.random() * 2.1,
        color: pickColor(),
      });
    };

    /* friction sparks along the moving seam */
    const emitAtSeam = (velocity: number, progress: number) => {
      if (document.hidden || window.scrollY > window.innerHeight * 1.25) return;
      poseProgress = progress;
      lastEmitAt = performance.now();

      const drawX = MAX_DRAW * progress;
      const n = Math.max(1, Math.min(30, Math.round(velocity * 430 + Math.random() * 2)));

      for (let i = 0; i < n; i++) {
        // mostly fanned backwards off the mouth, occasional forward spit
        const back = Math.random() < 0.85;
        const ang = back
          ? Math.PI * (0.68 + Math.random() * 0.64)
          : (Math.random() - 0.5) * 1;
        spawn(
          MOUTH_X + (Math.random() - 0.5) * 12,
          (Math.random() * 2 - 1) * SEAM_HALF,
          ang,
          0.75 + velocity * 46,
        );
      }

      // sparks scraped off the freshly exposed steel at the habaki edge
      if (Math.random() < 0.35 && velocity > 0.002) {
        for (let i = 0; i < 3; i++) {
          spawn(
            BLADE_BASE_X + drawX + (Math.random() - 0.5) * 14,
            (Math.random() * 2 - 1) * 62,
            Math.PI * (0.8 + Math.random() * 0.4),
            0.5 + velocity * 30,
            0.7,
          );
        }
      }
      kick();
    };

    const burst = (count: number) => {
      poseProgress = 1; // rig is at rest
      for (let i = 0; i < count; i++) {
        const ang = Math.random() * Math.PI * 2;
        const mag = 1.3 + Math.random() * 3;
        spawn(MOUTH_X, (Math.random() * 2 - 1) * SEAM_HALF, ang, mag, 1.9);
        if (i % 3 === 0)
          spawn(
            TSUBA_X + MAX_DRAW,
            (Math.random() * 2 - 1) * 96,
            ang,
            mag * 0.8,
            1.4,
          );
      }
      glow = 1;
      kick();
    };

    const step = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";

      /* white-hot friction glow at the mouth while the blade moves */
      const active = performance.now() - lastEmitAt < 180;
      const targetGlow = active ? Math.min(1, glow) : 0;
      glow += (targetGlow - glow) * 0.16;
      if (glow > 0.02) {
        const gx = offX + MOUTH_X * scale;
        const gy = offY + (0 + riseYAt(poseProgress)) * scale;
        const gr = 110 * scale * (0.6 + glow);
        const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
        grad.addColorStop(0, `rgba(255,214,150,${(0.5 * glow).toFixed(3)})`);
        grad.addColorStop(0.45, `rgba(255,140,70,${(0.22 * glow).toFixed(3)})`);
        grad.addColorStop(1, "rgba(255,120,50,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(gx, gy, gr, 0, Math.PI * 2);
        ctx.fill();
      }
      glow *= active ? 1 : 0.82;
      if (!active) glow = Math.max(glow, 0);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += 1 / 60;
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }
        p.vy += 0.17; // gravity
        p.vx *= 0.985;
        const px = p.x;
        const py = p.y;
        p.x += p.vx;
        p.y += p.vy;
        const k = 1 - p.life / p.maxLife;

        // streak
        ctx.globalAlpha = Math.max(0, k);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size * k + 0.4;
        ctx.beginPath();
        ctx.moveTo(px - p.vx * 3, py - p.vy * 3);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        // soft bloom core
        ctx.globalAlpha = Math.max(0, k * 0.4);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.1 * k, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (particles.length === 0 && glow <= 0.02) {
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

    sparks.current.emit = (v, p) => {
      emitAtSeam(v, p);
      glow = Math.min(1, glow + v * 26);
    };
    sparks.current.burst = (n) => burst(n);

    /* ambient sparks drifting off the resting sheath mouth */
    let ambientTimer: number;
    const ambientTick = () => {
      ambientTimer = window.setTimeout(
        () => {
          if (!document.hidden && window.scrollY < window.innerHeight) {
            poseProgress = 1;
            for (let i = 0; i < 2 + Math.floor(Math.random() * 3); i++) {
              spawn(
                MOUTH_X,
                (Math.random() * 2 - 1) * SEAM_HALF,
                Math.PI * (0.82 + Math.random() * 0.36),
                0.5,
                0.5,
              );
            }
            kick();
          }
          ambientTick();
        },
        2600 + Math.random() * 1900,
      );
    };
    sparks.current.beginAmbient = () => { clearTimeout(ambientTimer); ambientTick(); };
    sparks.current.stopAmbient = () => clearTimeout(ambientTimer);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      clearTimeout(ambientTimer);
      sparks.current = {};
    };
  }, [reduced]);

  /* ── intro timeline ──────────────────────────────────────────────── */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const anchor = window.location.hash;
    if (!anchor && replay === 0) window.scrollTo(0, 0);
    lockScroll();

    const setVar = (n: string, v: string) => root.style.setProperty(n, v);

    const reveal = () => {
      root.dataset.phase = "done";
      document.body.dataset.intro = "complete";
      window.dispatchEvent(new Event("kx:nav-ready"));
      unlockScroll();
      if (anchor && replay === 0) document.getElementById(anchor.slice(1))?.scrollIntoView();
    };

    sparks.current.stopAmbient?.();
    if (reduced || skip || (anchor && replay === 0)) {
      root.classList.add("kx-instant");
      reveal();
      return () => unlockScroll();
    }

    root.classList.remove("kx-instant", "kx-lock", "kx-sweeping", "kx-sweep2");
    root.dataset.phase = "boot";
    setVar("--rise-y", `${REST_Y}px`);
    setVar("--draw-x", "0px");
    setVar("--rise-rot", "-8.5deg");
    setVar("--streak", "0");

    const timers: number[] = [];
    let raf = 0;

    const startDraw = () => {
      const start = performance.now();
      let lastEased = 0;
      let lastTime = start;

      const frame = (now: number) => {
        const t = Math.min(1, (now - start) / DRAW_MS);
        const eased = 1 - Math.pow(1 - t, 5); // easeOutQuint
        const dv = eased - lastEased;
        lastEased = eased;
        const speed = dv / Math.max(0.001, (now - lastTime) / 1000);
        lastTime = now;

        setVar("--rise-y", `${REST_Y + (FINAL_Y - REST_Y) * eased}px`);
        setVar("--draw-x", `${eased * MAX_DRAW}px`);
        setVar("--rise-rot", `${-8.5 + 2.5 * eased}deg`);
        setVar("--streak", Math.min(1, dv * 130).toFixed(3));
        sparks.current.emit?.(dv, eased);
        sounds.current.update(eased, speed);

        if (t < 1) {
          raf = requestAnimationFrame(frame);
        } else {
          setVar("--streak", "0");
          root.classList.add("kx-lock");
          sounds.current.clink();
          sparks.current.burst?.(48);
          timers.push(
            window.setTimeout(() => root.classList.add("kx-sweeping"), 150),
            window.setTimeout(() => root.classList.add("kx-sweep2"), 560),
            window.setTimeout(() => {
              reveal();
              sparks.current.beginAmbient?.();
            }, 980),
          );
        }
      };
      raf = requestAnimationFrame(frame);
    };

    timers.push(window.setTimeout(startDraw, HOLD_MS));

    return () => {
      timers.forEach(clearTimeout);
      cancelAnimationFrame(raf);
      sounds.current.stop();
      unlockScroll();
      delete document.body.dataset.intro;
    };
  }, [reduced, replay, skip, sounds]);

  /* ── subtle parallax (fine pointers only) ────────────────────────── */
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0, previous = 0;
    const loop = (now: number) => {
      const dt = previous ? Math.min(64, now - previous) : 16.7;
      previous = now;
      const blend = 1 - Math.exp(-dt / 45);
      cx += (tx - cx) * blend;
      cy += (ty - cy) * blend;
      root.style.setProperty("--parx", (cx * 13).toFixed(2) + "px");
      root.style.setProperty("--pary", (cy * 8).toFixed(2) + "px");
      if (Math.abs(tx - cx) + Math.abs(ty - cy) > 0.001 && !document.hidden) raf = requestAnimationFrame(loop);
      else { raf = 0; previous = 0; }
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch" || root.getBoundingClientRect().bottom <= 0) return;
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      root.style.removeProperty("--parx");
      root.style.removeProperty("--pary");
    };
  }, [reduced]);

  return (
    <header ref={rootRef} id="top" className="hero" data-phase="boot" aria-label="Advait Sreekumar — Portfolio">
      {/* ensō brush ring — slow-turning backdrop */}
      <div className="enso" aria-hidden="true">
        <svg viewBox="0 0 600 600">
          <circle
            cx="300"
            cy="300"
            r="262"
            fill="none"
            stroke="rgba(232,201,138,0.05)"
            strokeWidth="22"
            strokeLinecap="round"
            strokeDasharray="980 130 320 70"
          />
          <circle
            cx="300"
            cy="300"
            r="238"
            fill="none"
            stroke="rgba(198,91,46,0.04)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="540 220 620 90"
          />
        </svg>
      </div>

      <div className="kx-stage" ref={stageRef}>
        <canvas ref={canvasRef} className="kx-sparks" aria-hidden="true" />

        {/* ══════════════════ KATANA ══════════════════ */}
        <svg
          className="kx-svg"
          viewBox={`${VB_X} 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <linearGradient id="kx-lacquerGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e2024" />
              <stop offset="45%" stopColor="#0c0d0f" />
              <stop offset="100%" stopColor="#020202" />
            </linearGradient>
            <linearGradient id="kx-brassGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f2dca0" />
              <stop offset="30%" stopColor="#c79b52" />
              <stop offset="60%" stopColor="#8a6a3e" />
              <stop offset="100%" stopColor="#3d2c18" />
            </linearGradient>
            <linearGradient id="kx-brassGradH" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3d2c18" />
              <stop offset="50%" stopColor="#d9b877" />
              <stop offset="100%" stopColor="#3d2c18" />
            </linearGradient>
            <linearGradient id="kx-steelGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#464b50" />
              <stop offset="14%" stopColor="#f5f7f9" />
              <stop offset="30%" stopColor="#c7ced4" />
              <stop offset="50%" stopColor="#e7ebee" />
              <stop offset="72%" stopColor="#7d858c" />
              <stop offset="100%" stopColor="#23262a" />
            </linearGradient>
            <linearGradient id="kx-handleGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#221012" />
              <stop offset="50%" stopColor="#120809" />
              <stop offset="100%" stopColor="#040202" />
            </linearGradient>
            <linearGradient id="kx-sweepGrad" x1="0" y1="0" x2="1" y2="0.2">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="45%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="55%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="kx-streakGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="70%" stopColor="#dfe9ff" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.4" />
            </linearGradient>
            <pattern id="kx-wrap" width="16" height="16" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
              <rect width="16" height="16" fill="#160a0c" />
              <rect width="8" height="16" fill="#261114" />
            </pattern>
            <pattern id="kx-filigree" width="10" height="10" patternUnits="userSpaceOnUse">
              <rect width="10" height="10" fill="transparent" />
              <circle cx="5" cy="5" r="0.9" fill="rgba(0,0,0,0.35)" />
            </pattern>
            <clipPath id="kx-mouth" clipPathUnits="userSpaceOnUse">
              <rect x="715" y="-400" width="2200" height="800" />
            </clipPath>
            <clipPath id="kx-bladeSweepClip" clipPathUnits="userSpaceOnUse">
              <rect x="120" y="-70" width="650" height="140" />
            </clipPath>
          </defs>

          <g className="kx-parallax">
            <g className="kx-rise-group">
              {/* ── SHEATH (static) ── */}
              <g className="kx-sheath">
                <path
                  fill="url(#kx-lacquerGrad)"
                  d="M -140,-74 L 700,-70 Q 724,-68 730,-50 L 730,50 Q 724,68 700,70 L -140,74 Q -174,2 -140,-74 Z"
                />
                <path stroke="rgba(255,255,255,0.07)" strokeWidth="1.5" fill="none" d="M -140,-72 L 698,-68" />
                <path stroke="rgba(255,255,255,0.07)" strokeWidth="1.5" fill="none" d="M -140,72 L 698,68" />
                <rect fill="url(#kx-brassGrad)" x="656" y="-70" width="38" height="140" rx="4" />
                <rect fill="url(#kx-filigree)" x="656" y="-70" width="38" height="140" rx="4" opacity="0.5" />
                <rect fill="url(#kx-brassGrad)" x="-40" y="-52" width="20" height="104" rx="3" opacity="0.85" />
                <path
                  d="M 674,74 C 656,112 690,132 666,172 C 652,196 676,220 660,246"
                  stroke="#0a0a0a"
                  strokeWidth="5"
                  fill="none"
                  strokeLinecap="round"
                />
                <circle cx="660" cy="252" r="6" fill="#0a0a0a" />
              </g>

              {/* ── DRAW GROUP (slides right, clipped at the mouth) ── */}
              <g clipPath="url(#kx-mouth)">
                <g className="kx-draw-group">
                  {/* blade */}
                  <path
                    fill="url(#kx-steelGrad)"
                    d="M -160,4 L -20,-70 L 560,-64 Q 660,-62 700,-56 L 700,56 Q 660,62 560,64 L -20,70 Z"
                  />
                  <path stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" fill="none" d="M -60,10 L 620,3" />
                  <path
                    stroke="rgba(255,255,255,0.55)"
                    strokeWidth="1"
                    fill="none"
                    d="M -20,-70 L 560,-64 Q 660,-62 700,-56"
                  />
                  <path
                    stroke="rgba(0,0,0,0.4)"
                    strokeWidth="1"
                    fill="none"
                    d="M -20,70 L 560,64 Q 660,62 700,56"
                  />
                  <path
                    fill="none"
                    stroke="rgba(30,34,38,0.35)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    d="M 60,34 Q 120,50 180,34 Q 240,18 300,34 Q 360,50 420,34 Q 480,18 540,34 Q 590,46 620,36"
                  />

                  {/* speed streak while drawing */}
                  <rect className="kx-streak" x="-160" y="-66" width="820" height="132" fill="url(#kx-streakGrad)" />

                  {/* engraved name */}
                  <g transform="translate(0,-3)">
                    {[0, 1, 2].map((layer) => {
                      const cfg = [
                        { y: 12, fill: "rgba(0,0,0,0.6)", dx: 0 },
                        { y: 8.2, fill: "rgba(255,255,255,0.45)", dx: -1.4 },
                        { y: 10, fill: "#33383d", dx: -0.6 },
                      ][layer];
                      return (
                        <text
                          key={layer}
                          x={275 + cfg.dx}
                          y={cfg.y}
                          className="kx-engrave"
                          fontSize="38"
                          letterSpacing="3.5"
                          textLength="380"
                          lengthAdjust="spacingAndGlyphs"
                          fill={cfg.fill}
                        >
                          {profile.bladeEngraving}
                        </text>
                      );
                    })}
                  </g>

                  {/* reflection sweeps */}
                  <g clipPath="url(#kx-bladeSweepClip)">
                    <rect
                      className="kx-sweep-rect kx-sweep-main"
                      x="0"
                      y="-90"
                      width="180"
                      height="180"
                      fill="url(#kx-sweepGrad)"
                    />
                    <rect
                      className="kx-sweep-rect kx-sweep-second"
                      x="0"
                      y="-40"
                      width="60"
                      height="80"
                      fill="url(#kx-sweepGrad)"
                    />
                  </g>

                  {/* habaki */}
                  <rect fill="url(#kx-brassGrad)" x="700" y="-62" width="52" height="124" rx="2" />
                  <rect fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="1" x="700" y="-62" width="52" height="124" rx="2" />
                  <line x1="712" y1="-58" x2="712" y2="58" stroke="rgba(0,0,0,0.25)" strokeWidth="1" />
                  <line x1="726" y1="-60" x2="726" y2="60" stroke="rgba(0,0,0,0.25)" strokeWidth="1" />
                  <line x1="740" y1="-58" x2="740" y2="58" stroke="rgba(0,0,0,0.25)" strokeWidth="1" />

                  {/* tsuba */}
                  <g transform="translate(792,0)">
                    <ellipse rx="28" ry="108" fill="url(#kx-brassGrad)" stroke="#1a1206" strokeWidth="2" />
                    <ellipse rx="28" ry="108" fill="url(#kx-filigree)" opacity="0.6" />
                    <ellipse rx="19" ry="90" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="1.5" />
                    <ellipse rx="10" ry="58" fill="#050303" opacity="0.55" />
                    <circle cx="0" cy="-108" r="12" fill="url(#kx-brassGrad)" />
                    <circle cx="0" cy="108" r="12" fill="url(#kx-brassGrad)" />
                    <circle cx="20" cy="-76" r="9" fill="url(#kx-brassGrad)" />
                    <circle cx="20" cy="76" r="9" fill="url(#kx-brassGrad)" />
                    <circle cx="-20" cy="-76" r="9" fill="url(#kx-brassGrad)" />
                    <circle cx="-20" cy="76" r="9" fill="url(#kx-brassGrad)" />
                  </g>

                  {/* fuchi */}
                  <rect fill="url(#kx-brassGradH)" x="822" y="-38" width="16" height="76" rx="2" />

                  {/* tsuka */}
                  <g>
                    <path d="M 838,-36 L 1200,-30 Q 1212,0 1200,30 L 838,36 Z" fill="url(#kx-handleGrad)" />
                    <path d="M 838,-36 L 1200,-30 Q 1212,0 1200,30 L 838,36 Z" fill="url(#kx-wrap)" opacity="0.6" />
                    <path
                      d="M 838,-36 L 1200,-30 Q 1212,0 1200,30 L 838,36 Z"
                      fill="none"
                      stroke="rgba(255,255,255,0.06)"
                      strokeWidth="1"
                    />
                    <rect x="888" y="-6" width="14" height="14" fill="#e8e2d2" opacity="0.9" transform="rotate(45 895 1)" />
                    <rect x="938" y="-8" width="12" height="12" fill="#e8e2d2" opacity="0.85" transform="rotate(45 944 -2)" />
                    <rect x="988" y="-6" width="12" height="12" fill="#e8e2d2" opacity="0.85" transform="rotate(45 994 -0.5)" />
                    <rect x="1038" y="-6" width="11" height="11" fill="#e8e2d2" opacity="0.8" transform="rotate(45 1043.5 -0.5)" />
                  </g>

                  {/* extra wrap diamonds preserve spacing along the longer tsuka */}
                  {[1088, 1138, 1188].map((x) => (
                    <rect key={x} x={x} y="-6" width="11" height="11" fill="#e8e2d2" opacity="0.8" transform={`rotate(45 ${x + 5.5} -0.5)`} />
                  ))}
                  {/* kashira */}
                  <ellipse cx="1210" cy="0" rx="18" ry="46" fill="url(#kx-brassGrad)" stroke="#1a1206" strokeWidth="1.5" />
                  <ellipse cx="1210" cy="0" rx="18" ry="46" fill="url(#kx-filigree)" opacity="0.5" />
                </g>
              </g>
            </g>
          </g>
        </svg>
      </div>

      {/* ── HERO COPY ── */}
      <div className="hero-copy">
        <h1 className="sr-text">{profile.name}</h1>
        <div className="hero-rule" aria-hidden="true" />
        <p className="hero-role">{profile.role}</p>
      </div>

      <div className="hero-controls">
        <button type="button" onClick={toggleSound} aria-pressed={!muted}>{muted ? "Sound off" : "Sound on"}</button>
        <button type="button" onClick={() => { setSkip(false); setReplay((value) => value + 1); }} disabled={reduced}>Draw again</button>
        <button type="button" className="intro-skip" onClick={() => {
          setSkip(true);
          document.getElementById("experience")?.scrollIntoView({ behavior: "instant" as ScrollBehavior });
          unlockScroll();
        }}>Skip intro</button>
      </div>

      <div className="scroll-hint" aria-hidden="true">
        <span>Scroll</span>
        <span className="hint-line" />
      </div>
    </header>
  );
}
