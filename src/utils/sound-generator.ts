/**
 * Sound Generator - Web Audio API Alarm Sounds
 *
 * Generates synthesized alarm sounds for Custom Sessions
 * without requiring audio files.
 */

import type { SoundType } from '../types/custom-session-types';

/**
 * Get AudioContext instance (singleton pattern)
 */
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

/**
 * Play BELL sound (default - clean sine wave)
 * 660 Hz high tone
 */
function playBell() {
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.frequency.value = 660; // E5 note
  oscillator.type = 'sine';

  gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.3);
}

/**
 * Play GONG sound (deep resonant tone with harmonics)
 */
function playGong() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  // Fundamental frequency (low)
  const fundamental = ctx.createOscillator();
  const fundamentalGain = ctx.createGain();

  fundamental.connect(fundamentalGain);
  fundamentalGain.connect(ctx.destination);

  fundamental.frequency.value = 110; // A2 - deep bass
  fundamental.type = 'sine';

  fundamentalGain.gain.setValueAtTime(0.4, now);
  fundamentalGain.gain.exponentialRampToValueAtTime(0.01, now + 2.5);

  // First harmonic (adds richness)
  const harmonic1 = ctx.createOscillator();
  const harmonic1Gain = ctx.createGain();

  harmonic1.connect(harmonic1Gain);
  harmonic1Gain.connect(ctx.destination);

  harmonic1.frequency.value = 220; // Octave above
  harmonic1.type = 'sine';

  harmonic1Gain.gain.setValueAtTime(0.2, now);
  harmonic1Gain.gain.exponentialRampToValueAtTime(0.01, now + 2.0);

  // Second harmonic (shimmer)
  const harmonic2 = ctx.createOscillator();
  const harmonic2Gain = ctx.createGain();

  harmonic2.connect(harmonic2Gain);
  harmonic2Gain.connect(ctx.destination);

  harmonic2.frequency.value = 330; // Fifth
  harmonic2.type = 'sine';

  harmonic2Gain.gain.setValueAtTime(0.1, now);
  harmonic2Gain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);

  fundamental.start(now);
  fundamental.stop(now + 2.5);
  harmonic1.start(now);
  harmonic1.stop(now + 2.0);
  harmonic2.start(now);
  harmonic2.stop(now + 1.5);
}

/**
 * Play SINGING_BOWL sound (Tibetan singing bowl)
 * Multiple harmonics with slow decay
 */
function playSingingBowl() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  // Create multiple harmonic oscillators
  const frequencies = [396, 528, 660, 792]; // Harmonic series
  const durations = [3.0, 2.5, 2.0, 1.5];

  frequencies.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.value = freq;
    osc.type = 'sine';

    const volume = 0.15 / (index + 1); // Decreasing volume for higher harmonics
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + durations[index]);

    osc.start(now);
    osc.stop(now + durations[index]);
  });
}

/**
 * Play SIREN sound (oscillating frequency)
 */
function playSiren() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = 'sawtooth'; // Harsh sound

  // Oscillate frequency between 400 Hz and 800 Hz
  osc.frequency.setValueAtTime(400, now);
  osc.frequency.linearRampToValueAtTime(800, now + 0.3);
  osc.frequency.linearRampToValueAtTime(400, now + 0.6);
  osc.frequency.linearRampToValueAtTime(800, now + 0.9);
  osc.frequency.linearRampToValueAtTime(400, now + 1.2);

  gain.gain.setValueAtTime(0.3, now);
  gain.gain.linearRampToValueAtTime(0, now + 1.5);

  osc.start(now);
  osc.stop(now + 1.5);
}

/**
 * Play ALARM sound (classic alarm clock beep)
 * Repeated beeps
 */
function playAlarm() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  // Three rapid beeps
  const beeps = 3;
  const beepDuration = 0.15;
  const gapDuration = 0.1;

  for (let i = 0; i < beeps; i++) {
    const startTime = now + i * (beepDuration + gapDuration);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.value = 880; // A5 - high pitched
    osc.type = 'square'; // Harsh square wave

    gain.gain.setValueAtTime(0.25, startTime);
    gain.gain.setValueAtTime(0.25, startTime + beepDuration);
    gain.gain.linearRampToValueAtTime(0, startTime + beepDuration + 0.01);

    osc.start(startTime);
    osc.stop(startTime + beepDuration + 0.01);
  }
}

/**
 * Play WOOSH sound (soft transition sweep)
 */
function playWoosh() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(200, now);
  osc.frequency.exponentialRampToValueAtTime(50, now + 0.5); // Downward sweep

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(2000, now);
  filter.frequency.exponentialRampToValueAtTime(100, now + 0.5);

  gain.gain.setValueAtTime(0.2, now);
  gain.gain.linearRampToValueAtTime(0, now + 0.5);

  osc.start(now);
  osc.stop(now + 0.5);
}

/**
 * Play HORN sound (loud brass-like trumpet)
 */
function playHorn() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.frequency.value = 440; // A4 - middle A
  osc.type = 'sawtooth'; // Bright, brass-like

  // Sharp attack, sustained, quick release
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.4, now + 0.05); // Quick attack
  gain.gain.setValueAtTime(0.4, now + 0.5); // Sustain
  gain.gain.linearRampToValueAtTime(0, now + 0.7); // Quick release

  osc.start(now);
  osc.stop(now + 0.7);
}

/**
 * Play sound by type
 *
 * @param soundType - The type of sound to play
 */
export function playSound(soundType: SoundType = 'BELL'): void {
  switch (soundType) {
    case 'BELL':
      playBell();
      break;
    case 'GONG':
      playGong();
      break;
    case 'SINGING_BOWL':
      playSingingBowl();
      break;
    case 'SIREN':
      playSiren();
      break;
    case 'ALARM':
      playAlarm();
      break;
    case 'WOOSH':
      playWoosh();
      break;
    case 'HORN':
      playHorn();
      break;
    default:
      playBell();
  }
}

/**
 * Get user-friendly label for sound type
 */
export function getSoundLabel(soundType: SoundType): string {
  const labels: Record<SoundType, string> = {
    BELL: 'Bell',
    GONG: 'Gong',
    SINGING_BOWL: 'Singing Bowl',
    SIREN: 'Siren',
    ALARM: 'Alarm',
    WOOSH: 'Woosh',
    HORN: 'Horn',
  };
  return labels[soundType];
}

/**
 * Get all available sound types
 */
export function getAllSoundTypes(): SoundType[] {
  return ['BELL', 'GONG', 'SINGING_BOWL', 'SIREN', 'ALARM', 'WOOSH', 'HORN'];
}
