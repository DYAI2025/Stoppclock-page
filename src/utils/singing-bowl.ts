/**
 * Generates a gentle singing bowl sound using Web Audio API
 * High frequency (800-1200Hz) for motivating but not stressful sound
 */
export function playSingingBowl(): void {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    // Create oscillator for fundamental frequency
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    // Singing bowl tone: 880 Hz (A5 - clear, pleasant)
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
    oscillator.type = 'sine';

    // ADSR Envelope: gentle attack, long sustain, natural decay
    const now = audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.1); // Attack: 100ms
    gainNode.gain.linearRampToValueAtTime(0.2, now + 0.3); // Sustain: hold at 0.2
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 2.5); // Decay: 2.2s

    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Play
    oscillator.start(now);
    oscillator.stop(now + 2.5);

    // Cleanup
    oscillator.onended = () => {
      oscillator.disconnect();
      gainNode.disconnect();
      audioContext.close();
    };
  } catch (error) {
    // Silently fail if Web Audio API unavailable
    console.warn('Web Audio API not available:', error);
  }
}
