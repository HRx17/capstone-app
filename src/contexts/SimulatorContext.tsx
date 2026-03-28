import React, { createContext, useContext, useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

export type ContextMode = 'NEUTRAL' | 'MORNING' | 'WORK' | 'EVENING';

interface SimulatorState {
    currentMode: ContextMode;
    setMode: (mode: ContextMode) => void;
    isLocked: boolean;
    setLocked: (locked: boolean) => void;
    autoPilotRunning: boolean;
    triggerAutoPilot: (running: boolean) => void;
    pushNotification: (data: any) => void;
    triggerModal: (modalId: string) => void;
    boostedApps: string[];
    boostApp: (appId: string) => void;
    resetBoosts: () => void;
    activeApp: string | null;
    openApp: (appId: string) => void;
    closeApp: () => void;
    getTopAppsForMode: (mode: ContextMode) => string[];
}

const SimulatorContext = createContext<SimulatorState | undefined>(undefined);


// Connect to Wizard of Oz backend
// If running locally on Vite (5173), point to the 3001 backend. If over localtunnel, use relative hostname.
const isDev = window.location.port === '5173';
const backendUrl = isDev ? `http://${window.location.hostname}:3001` : undefined;
const socket: Socket = backendUrl ? io(backendUrl) : io();

export function SimulatorProvider({ children }: { children: React.ReactNode }) {
    const [currentMode, setCurrentMode] = useState<ContextMode>('NEUTRAL');
    const [isLocked, setIsLocked] = useState<boolean>(true);

    useEffect(() => {
        socket.on('state-update', (state) => {
            console.log("Received state update from backend:", state);
            if (state.currentMode) setCurrentMode(state.currentMode);
            if (typeof state.isLocked === 'boolean') setIsLocked(state.isLocked);
        });

        return () => {
            socket.off('state-update');
        };
    }, []);

    // Wrap state setters to emit to backend instead of just changing local state
    const setMode = (mode: ContextMode) => {
        // Optimistically update local state immediately for instant feedback
        setCurrentMode(mode);
        if (socket.connected) {
            socket.emit('set-mode', mode);
        }
    };

    const setLocked = (locked: boolean) => {
        // Optimistically update local state immediately
        setIsLocked(locked);
        if (socket.connected) {
            socket.emit('set-locked', locked);
        }
    };

    // --- NEW WOZ CONTROLS ---
    const [autoPilotRunning, setAutoPilotRunning] = useState<boolean>(false);

    // Notifications and Modals are technically one-off events, not persistent state
    // But we need to listen to them here and perhaps expose them, or we can simply listen in App.tsx
    // However, exposing methods to trigger them from AdminView is needed here

    const triggerAutoPilot = (running: boolean) => {
        setAutoPilotRunning(running);
        if (socket.connected) {
            socket.emit('set-auto-pilot', running);
        }
    };

    const pushNotification = (data: any) => {
        if (socket.connected) {
            socket.emit('push-notification', data);
        }
    };

    const triggerModal = (modalId: string) => {
        if (socket.connected) {
            socket.emit('trigger-modal', modalId);
        }
    };

    // --- SCENARIO BOOSTS ---
    const [boostedApps, setBoostedApps] = useState<string[]>([]);

    const boostApp = (appId: string) => {
        setBoostedApps(prev => [appId, ...prev.filter(id => id !== appId)]);
        if (socket.connected) {
            socket.emit('boost-app', appId);
        }
    };

    const resetBoosts = () => {
        setBoostedApps([]);
        if (socket.connected) {
            socket.emit('reset-boosts');
        }
    };

    // We also need to listen for autoPilot and boostedApps state from server 
    // to keep admin views in sync across different devices
    useEffect(() => {
        const handleStateUpdate = (state: any) => {
            if (typeof state.autoPilotRunning === 'boolean') {
                setAutoPilotRunning(state.autoPilotRunning);
            }
            if (Array.isArray(state.boostedApps)) {
                setBoostedApps(state.boostedApps);
            }
        };
        socket.on('state-update', handleStateUpdate);
        return () => {
            socket.off('state-update', handleStateUpdate);
        };
    }, []);

    // --- AI APP MEMORY ---
    const [appMemory, setAppMemory] = useState<Record<ContextMode, { lastOpened: string[], counts: Record<string, number> }>>(() => {
        const stored = localStorage.getItem('aiAppMemory');
        if (stored) {
            try { return JSON.parse(stored); } catch (e) { console.error(e); }
        }
        return {
            NEUTRAL: { lastOpened: [], counts: {} },
            MORNING: { lastOpened: [], counts: {} },
            WORK: { lastOpened: [], counts: {} },
            EVENING: { lastOpened: [], counts: {} }
        };
    });

    const [activeApp, setActiveApp] = useState<string | null>(null);

    const openApp = (appId: string) => {
        setActiveApp(appId);
        
        setAppMemory(prev => {
            const modeMemory = prev[currentMode];
            const newLastOpened = [appId, ...modeMemory.lastOpened.filter(id => id !== appId)].slice(0, 10);
            const newCounts = { ...modeMemory.counts, [appId]: (modeMemory.counts[appId] || 0) + 1 };
            
            const nextState = {
                ...prev,
                [currentMode]: {
                    lastOpened: newLastOpened,
                    counts: newCounts
                }
            };
            localStorage.setItem('aiAppMemory', JSON.stringify(nextState));
            return nextState;
        });
    };

    const closeApp = () => setActiveApp(null);

    const getTopAppsForMode = (mode: ContextMode) => {
        const mem = appMemory[mode];
        const recent = mem.lastOpened.slice(0, 2);
        
        const remainingNeeded = Math.max(0, 2 - recent.length);
        if (remainingNeeded > 0) {
            const sortedByFreq = Object.entries(mem.counts)
                .filter(([id]) => !recent.includes(id))
                .sort((a, b) => b[1] - a[1])
                .map(([id]) => id)
                .slice(0, remainingNeeded);
            return [...recent, ...sortedByFreq];
        }
        
        return recent;
    };

    return (
        <SimulatorContext.Provider value={{
            currentMode, setMode,
            isLocked, setLocked,
            autoPilotRunning, triggerAutoPilot,
            pushNotification, triggerModal,
            boostedApps, boostApp, resetBoosts,
            activeApp, openApp, closeApp, getTopAppsForMode
        }}>
            {children}
        </SimulatorContext.Provider>
    );
}

export function useSimulator() {
    const context = useContext(SimulatorContext);
    if (context === undefined) {
        throw new Error('useSimulator must be used within a SimulatorProvider');
    }
    return context;
}
