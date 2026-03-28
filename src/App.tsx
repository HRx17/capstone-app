import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SimulatorProvider, useSimulator } from './contexts/SimulatorContext';
import { ToastProvider, useToast } from './contexts/ToastContext';
import { MobileShell } from './components/MobileShell';
import { ContextBanner } from './components/ContextBanner';
import { LockScreen } from './components/LockScreen';
import { ControlCenter } from './components/ControlCenter';

import { NotificationBanner } from './components/NotificationBanner';
import { io } from 'socket.io-client';
import { GlobalSearch } from './components/GlobalSearch';

// Placeholder Views
import { AppView } from './components/AppView';
import { NeutralView } from './views/NeutralView';
import { MorningView } from './views/MorningView';
import { WorkView } from './views/WorkView';
import { EveningView } from './views/EveningView';
import { AdminView } from './views/AdminView';

// Re-using same singleton socket. Connects to the local backend port in development, and falls back to identical hostname/port in production.
const socketUrl = import.meta.env.DEV ? `http://${window.location.hostname}:3001` : undefined;
const socket = io(socketUrl);

function GhostAppModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="absolute top-[64px] left-0 right-0 z-[200] flex flex-col items-center gap-2 pointer-events-none px-4">
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.9 }}
        className="bg-[#1c1c1e]/90 backdrop-blur-xl border border-white/10 rounded-[24px] w-full max-w-[340px] p-4 shadow-2xl flex flex-col gap-3 pointer-events-auto"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-[10px] bg-neutral-700 flex items-center justify-center shrink-0 shadow-inner text-xl">
            👻
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <div className="flex justify-between items-center mb-0.5">
              <h4 className="text-white font-medium text-[15px] leading-tight flex items-center gap-1.5">
                Space Recovery
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded-[4px] uppercase font-bold tracking-wider">AI</span>
              </h4>
              <span className="text-neutral-400 text-xs">now</span>
            </div>
            <p className="text-neutral-300 text-[13.5px] leading-snug">
              AI noticed you haven't used <strong className="text-white">Candy Crush</strong> in 30 days. Offload to save space?
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full mt-1">
          <button onClick={onClose} className="flex-1 py-2 px-3 rounded-lg font-medium text-sm bg-neutral-700 text-white hover:bg-neutral-600 transition-colors">
            Keep
          </button>
          <button onClick={onClose} className="flex-1 py-2 px-3 rounded-lg font-medium text-sm bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20">
            Offload
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function MainScreen() {
  const { currentMode, isLocked, activeApp, closeApp } = useSimulator();
  const { toast } = useToast();
  const [showGhostModal, setShowGhostModal] = useState(false);

  useEffect(() => {
    const handleModalTrigger = (modalId: string) => {
      if (modalId === 'ghost-app-cleanup') {
        setShowGhostModal(true);
      } else if (modalId === 'undo-action') {
        toast("Context update undone. Changes reverted.");
      }
    };

    socket.on('modal-triggered', handleModalTrigger);
    return () => {
      socket.off('modal-triggered', handleModalTrigger);
    };
  }, []);

  return (
    <>
      <MobileShell>
        <NotificationBanner />
        <ContextBanner />
        <GlobalSearch />

        <div className="relative w-full h-full z-10">
          <AnimatePresence mode="wait">
            {currentMode === 'NEUTRAL' && <NeutralView key="neutral" />}
            {currentMode === 'MORNING' && <MorningView key="morning" />}
            {currentMode === 'WORK' && <WorkView key="work" />}
            {currentMode === 'EVENING' && <EveningView key="evening" />}
          </AnimatePresence>
        </div>

        {/* LockScreen Overlay - Rendered above the views */}
        <AnimatePresence>
          {isLocked && <LockScreen key="lock" />}
        </AnimatePresence>

        {/* App View Overlay */}
        <AnimatePresence>
          {activeApp && <AppView key="app-view" appName={activeApp} onClose={closeApp} />}
        </AnimatePresence>

        <ControlCenter />
      </MobileShell>

      <AnimatePresence>
        {showGhostModal && <GhostAppModal isOpen={showGhostModal} onClose={() => setShowGhostModal(false)} />}
      </AnimatePresence>
    </>
  );
}

import { ErrorBoundary } from './ErrorBoundary';

function App() {
  const path = window.location.pathname;

  return (
    <ErrorBoundary>
      <SimulatorProvider>
        <ToastProvider>
          {path === '/admin' ? <AdminView /> : <MainScreen />}
        </ToastProvider>
      </SimulatorProvider>
    </ErrorBoundary>
  );
}

export default App;
