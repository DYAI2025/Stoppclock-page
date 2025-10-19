// Shared utilities for timer tools

export function beep(ms = 300, f = 880) {
  try {
    const ac = new (window.AudioContext || (window as any).webkitAudioContext)();
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.frequency.value = f;
    o.type = "sine";
    o.connect(g);
    g.connect(ac.destination);
    g.gain.setValueAtTime(0.0001, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.5, ac.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + ms / 1000);
    o.start();
    o.stop(ac.currentTime + ms / 1000 + 0.05);
  } catch {
    // Silently fail - audio may not be available
  }
}

export function flash(el: HTMLElement | null, ms = 300) {
  if (!el) return;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;
  el.classList.add("flash-active");
  setTimeout(() => el.classList.remove("flash-active"), ms);
}
