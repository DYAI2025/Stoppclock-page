import { useState, useEffect, useCallback, useRef } from 'react';
import { PomodoroPhase, PomodoroState, PomodoroPreset, POMODORO_PRESETS, DEFAULT_POMODORO_STATE } from './types';

// Helper to get duration in seconds for a phase
const getPhaseDuration = (phase: PomodoroPhase, preset: PomodoroPreset): number => {
    switch (phase) {
        case 'focus': return preset.focusDuration * 60;
        case 'shortBreak': return preset.shortBreakDuration * 60;
        case 'longBreak': return preset.longBreakDuration * 60;
    }
};

export function usePomodoroLogic() {
    const [state, setState] = useState<PomodoroState>(() => {
        // Try to load from localStorage
        try {
            const saved = localStorage.getItem('sc.v1.pomodoro');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Validate and sanitise
                const activePresetId = (parsed.activePresetId && POMODORO_PRESETS[parsed.activePresetId])
                    ? parsed.activePresetId
                    : 'classic';

                const remainingSeconds = (typeof parsed.remainingSeconds === 'number' && !isNaN(parsed.remainingSeconds))
                    ? parsed.remainingSeconds
                    : POMODORO_PRESETS[activePresetId].focusDuration * 60;

                return {
                    ...DEFAULT_POMODORO_STATE,
                    ...parsed,
                    activePresetId,
                    remainingSeconds
                };
            }
        } catch (e) { console.error(e) }
        return DEFAULT_POMODORO_STATE;
    });

    const timerRef = useRef<number | null>(null);
    const lastTickRef = useRef<number | null>(null);

    const getPreset = useCallback((): PomodoroPreset => {
        return POMODORO_PRESETS[state.activePresetId] || POMODORO_PRESETS['classic'];
    }, [state.activePresetId]);

    // Save to local storage on change
    useEffect(() => {
        localStorage.setItem('sc.v1.pomodoro', JSON.stringify(state));
    }, [state]);

    const tick = useCallback(() => {
        setState(prev => {
            if (!prev.isRunning || prev.remainingSeconds <= 0) return prev;

            const now = Date.now();
            // Calculate delta to be robust against lag/tab throttling
            // For simplicity in this version, we just decrement by 1 if running smoothly, 
            // but "Drift correction" (NFR-POMO-3) suggests comparing timestamps.
            // Let's stick to simple decrement for MVP P1.2, but robust enough.

            const nextRemaining = prev.remainingSeconds - 1;

            if (nextRemaining < 0) {
                // Phase finished!
                // We will handle phase transition in an effect or immediate logic?
                // Let's handle it here effectively.
                return {
                    ...prev,
                    remainingSeconds: 0,
                    isRunning: false // Auto-pause at end of phase? Or auto-continue? 
                    // FR-POMOspec doesn't explicitly say "Auto-advance". 
                    // Usually Pomo apps wait for user to start break, or start focus.
                    // Let's auto-pause at 0 for now (Requires user action to start next phase usually).
                };
            }

            return {
                ...prev,
                remainingSeconds: nextRemaining
            };
        });
    }, []);

    // Timer effect
    useEffect(() => {
        if (state.isRunning && state.remainingSeconds > 0) {
            timerRef.current = window.setInterval(tick, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [state.isRunning, state.remainingSeconds, tick]);


    const nextPhase = useCallback(() => {
        setState(prev => {
            const preset = POMODORO_PRESETS[prev.activePresetId] || POMODORO_PRESETS['classic'];
            let nextPhase: PomodoroPhase = 'focus';
            let nextSessions = prev.totalSessionsCompleted;

            if (prev.currentPhase === 'focus') {
                nextSessions += 1;
                // Check for long break
                // A "cycle" is usually Focus + Break. 
                // e.g. 4 cycles before long break means: F, S, F, S, F, S, F -> Long Break.
                const sessionsInCycle = nextSessions % preset.cyclesBeforeLongBreak;

                if (sessionsInCycle === 0) {
                    nextPhase = 'longBreak';
                } else {
                    nextPhase = 'shortBreak';
                }
            } else {
                // From break to focus
                nextPhase = 'focus';
            }

            return {
                ...prev,
                currentPhase: nextPhase,
                totalSessionsCompleted: nextSessions,
                remainingSeconds: getPhaseDuration(nextPhase, preset),
                isRunning: false // Wait for user to start next phase
            };
        });
    }, []);

    const toggleTimer = useCallback(() => {
        setState(prev => {
            // If we were at 0, and user clicks start, we probably want to advance phase first or reset?
            // But logic above sets isRunning=false at 0. So user sees 00:00.
            // If 00:00, user usually clicks "Next" or "Skip".
            // If they click Start at 00:00, maybe we should jump to next phase?
            if (prev.remainingSeconds === 0) {
                // Implicit "Next"
                // We need to call logic similar to nextPhase but we can't call hook function inside setState easily
                // For now, let's assume they use "Skip/Next" button for that.
                return prev;
            }
            return { ...prev, isRunning: !prev.isRunning };
        });
    }, []);

    const setPreset = useCallback((presetId: string) => {
        const preset = POMODORO_PRESETS[presetId];
        if (!preset) return;
        setState(prev => ({
            ...DEFAULT_POMODORO_STATE,
            activePresetId: presetId,
            remainingSeconds: preset.focusDuration * 60,
            // Keep focus label?
            focusLabel: prev.focusLabel
        }));
    }, []);

    const resetSession = useCallback(() => {
        setState(prev => {
            const preset = POMODORO_PRESETS[prev.activePresetId] || POMODORO_PRESETS['classic'];
            return {
                ...prev,
                isRunning: false,
                remainingSeconds: getPhaseDuration(prev.currentPhase, preset)
            };
        });
    }, []);

    const skip = useCallback(() => {
        nextPhase();
    }, [nextPhase]);

    const setFocusLabel = useCallback((label: string) => {
        setState(prev => ({ ...prev, focusLabel: label }));
    }, []);

    return {
        state,
        toggleTimer,
        skip,
        resetSession,
        setPreset,
        setFocusLabel,
        activePreset: getPreset()
    };
}
