export type SoundType = 'beep' | 'chime' | 'bell' | 'none';

export interface SessionElement {
  id: string;
  type: 'work' | 'break' | 'custom';
  durationMs: number;
  focusText: string;
  phaseName?: string;
  sound: SoundType;
  createdAt: number;
}

export interface CustomSession {
  id: string;
  name: string;
  elements: SessionElement[];
  createdAt: number;
  updatedAt: number;
}

export interface SessionRuntime {
  sessionId: string;
  currentIndex: number;
  remainingMs: number;
  totalDurationMs: number;
  status: 'IDLE' | 'RUNNING' | 'PAUSED' | 'COMPLETED';
  startedAt: number | null;
}

export interface SessionPreset {
  id: string;
  name: string;
  description: string;
  elements: Omit<SessionElement, 'id' | 'createdAt'>[];
  category: string;
}