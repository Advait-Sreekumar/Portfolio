"use client";

import { useEffect, useRef, useState } from "react";

/** One continuous friction voice, driven by the same progress as the blade. */
export function useKatanaAudio() {
  const [muted, setMuted] = useState(true);
  const enabled = useRef(false);
  const context = useRef<AudioContext | null>(null);
  const voice = useRef<{ source: AudioBufferSourceNode; filter: BiquadFilterNode; gain: GainNode } | null>(null);

  const stop = () => {
    const current = voice.current;
    if (!current) return;
    voice.current = null;
    const ctx = context.current;
    if (ctx && ctx.state !== "closed") {
      current.gain.gain.cancelScheduledValues(ctx.currentTime);
      current.gain.gain.setTargetAtTime(0, ctx.currentTime, 0.004);
      current.source.stop(ctx.currentTime + 0.025);
    } else current.source.stop();
    current.source.onended = () => {
      current.source.disconnect();
      current.filter.disconnect();
      current.gain.disconnect();
    };
  };

  const update = (progress: number, speed: number) => {
    const ctx = context.current;
    if (!enabled.current || !ctx || ctx.state !== "running" || document.hidden || progress >= 1 || speed <= 0) {
      stop();
      return;
    }
    if (!voice.current) {
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.Q.value = 0.8;
      const gain = ctx.createGain();
      gain.gain.value = 0;
      source.connect(filter).connect(gain).connect(ctx.destination);
      source.start();
      voice.current = { source, filter, gain };
    }
    voice.current.filter.frequency.setTargetAtTime(1000 + progress * 2200, ctx.currentTime, 0.02);
    voice.current.gain.gain.setTargetAtTime(Math.min(0.18, speed * 0.12), ctx.currentTime, 0.015);
  };

  const clink = () => {
    stop();
    const ctx = context.current;
    if (!enabled.current || !ctx || ctx.state !== "running" || document.hidden) return;
    for (const frequency of [1800, 2600]) {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
      oscillator.connect(gain).connect(ctx.destination);
      oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.32);
    }
  };

  const toggle = () => {
    enabled.current = !enabled.current;
    setMuted(!enabled.current);
    if (!enabled.current) stop();
    else {
      try {
        // Construct/resume only from this explicit user gesture. Never retry later.
        context.current ??= new AudioContext();
        void context.current.resume().catch(() => { enabled.current = false; setMuted(true); });
      } catch { enabled.current = false; setMuted(true); }
    }
  };

  const bridge = useRef({ update, stop, clink });
  bridge.current = { update, stop, clink };

  useEffect(() => {
    const hide = () => { if (document.hidden) bridge.current.stop(); };
    document.addEventListener("visibilitychange", hide);
    return () => {
      document.removeEventListener("visibilitychange", hide);
      bridge.current.stop();
      void context.current?.close();
      context.current = null;
    };
  }, []);

  return { muted, toggle, bridge };
}
