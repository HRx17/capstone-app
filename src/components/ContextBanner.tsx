import { motion, AnimatePresence } from 'framer-motion';
import { useSimulator } from '../contexts/SimulatorContext';
import { Sun, Briefcase, Moon } from 'lucide-react';

const MODE_CONFIG = {
    NEUTRAL: null,
    MORNING: {
        icon: Sun,
        text: "AI: Morning Routine Active",
        colors: "bg-orange-500/80 text-white",
    },
    WORK: {
        icon: Briefcase,
        text: "AI: Work Mode Active",
        colors: "bg-blue-500/80 text-white",
    },
    EVENING: {
        icon: Moon,
        text: "AI: Evening Wind Down",
        colors: "bg-indigo-600/80 text-white",
    },
};

export function ContextBanner() {
    const { currentMode, setMode } = useSimulator();

    const config = MODE_CONFIG[currentMode];

    return (
        <AnimatePresence>
            {currentMode !== 'NEUTRAL' && config && (
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="px-4 py-2 mt-2 w-full flex justify-center z-40 relative"
                >
                    <button
                        onClick={() => setMode('NEUTRAL')}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium shadow-lg backdrop-blur-md border border-white/20 transition-transform active:scale-95 ${config.colors}`}
                    >
                        <config.icon size={16} />
                        {config.text}
                        <span className="ml-1 opacity-60 text-xs">(Tap to end)</span>
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
