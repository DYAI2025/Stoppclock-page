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

// Timezone utilities for World Clock
export function getUTCOffset(timeZone: string, date = new Date()): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'shortOffset'
    });
    const parts = formatter.formatToParts(date);
    const offsetPart = parts.find(p => p.type === 'timeZoneName');
    if (offsetPart) {
      return offsetPart.value.replace('GMT', 'UTC');
    }
  } catch {
    // Invalid timezone
  }
  return 'UTC+0';
}

export function getCurrentTimeInTimezone(timeZone: string): string {
  try {
    return new Date().toLocaleTimeString('en-US', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  } catch {
    return '00:00:00';
  }
}

// World Clock city database (top 50+ cities)
export const WORLD_CLOCK_CITIES = [
  { city: 'New York', zone: 'America/New_York', country: 'USA' },
  { city: 'Los Angeles', zone: 'America/Los_Angeles', country: 'USA' },
  { city: 'Chicago', zone: 'America/Chicago', country: 'USA' },
  { city: 'Denver', zone: 'America/Denver', country: 'USA' },
  { city: 'London', zone: 'Europe/London', country: 'UK' },
  { city: 'Paris', zone: 'Europe/Paris', country: 'France' },
  { city: 'Berlin', zone: 'Europe/Berlin', country: 'Germany' },
  { city: 'Tokyo', zone: 'Asia/Tokyo', country: 'Japan' },
  { city: 'Hong Kong', zone: 'Asia/Hong_Kong', country: 'China' },
  { city: 'Sydney', zone: 'Australia/Sydney', country: 'Australia' },
  { city: 'Dubai', zone: 'Asia/Dubai', country: 'UAE' },
  { city: 'Singapore', zone: 'Asia/Singapore', country: 'Singapore' },
  { city: 'Mumbai', zone: 'Asia/Kolkata', country: 'India' },
  { city: 'São Paulo', zone: 'America/Sao_Paulo', country: 'Brazil' },
  { city: 'Moscow', zone: 'Europe/Moscow', country: 'Russia' },
  { city: 'Toronto', zone: 'America/Toronto', country: 'Canada' },
  { city: 'Mexico City', zone: 'America/Mexico_City', country: 'Mexico' },
  { city: 'Seoul', zone: 'Asia/Seoul', country: 'South Korea' },
  { city: 'Istanbul', zone: 'Europe/Istanbul', country: 'Turkey' },
  { city: 'Cairo', zone: 'Africa/Cairo', country: 'Egypt' },
];

export function searchCities(query: string) {
  const lowerQuery = query.toLowerCase();
  return WORLD_CLOCK_CITIES.filter(
    c => c.city.toLowerCase().includes(lowerQuery) ||
         c.country.toLowerCase().includes(lowerQuery)
  );
}
