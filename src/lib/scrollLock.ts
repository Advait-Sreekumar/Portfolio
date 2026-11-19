"use client";

/**
 * Hard scroll lock used during the katana intro.
 * Blocks: mouse wheel, trackpad, arrow/space/pgup/pgdn/home/end keys,
 * touch scrolling and scrollbar dragging (overflow hidden removes the bar).
 */
const GUARDED_KEYS = new Set([
  "ArrowUp",
  "ArrowDown",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  " ",
  "Spacebar",
]);

let locked = false;
let prevOverflow = "";
let prevTouchAction = "";

function onWheel(e: WheelEvent) {
  if (locked) e.preventDefault();
}
function onTouchMove(e: TouchEvent) {
  if (locked) e.preventDefault();
}
function onKeyDown(e: KeyboardEvent) {
  if (!locked) return;
  const target = e.target as HTMLElement | null;
  // never block typing inside inputs
  const tag = target?.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) return;
  if (GUARDED_KEYS.has(e.key)) e.preventDefault();
}

export function lockScroll(): void {
  if (locked || typeof document === "undefined") return;
  locked = true;
  const html = document.documentElement;
  prevOverflow = html.style.overflow;
  prevTouchAction = html.style.touchAction;
  html.style.overflow = "hidden";
  html.style.touchAction = "none";
  document.body.classList.add("is-scroll-locked");
  window.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("touchmove", onTouchMove, { passive: false });
  window.addEventListener("keydown", onKeyDown, { passive: false });
}

export function unlockScroll(): void {
  if (!locked || typeof document === "undefined") return;
  locked = false;
  const html = document.documentElement;
  html.style.overflow = prevOverflow;
  html.style.touchAction = prevTouchAction;
  document.body.classList.remove("is-scroll-locked");
  window.removeEventListener("wheel", onWheel);
  window.removeEventListener("touchmove", onTouchMove);
  window.removeEventListener("keydown", onKeyDown);
}

export function isScrollLocked(): boolean {
  return locked;
}
