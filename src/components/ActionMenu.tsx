import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulator } from '../contexts/SimulatorContext';
import { Settings2, Sun, Briefcase, Moon, Smartphone } from 'lucide-react';
import { cn } from '../lib/utils';

export function ActionMenu() {
    const { currentMode, setMode, isLocked } = useSimulator();
    const [isOpen, setIsOpen] = useState(false);

    // Hide if locked
    if (isLocked) return null;

    const modes = [
        { id: 'NEUTRAL', label: 'Default', icon: Smartphone, color: 'text-white' },
        { id: 'MORNING', label: 'Morning', icon: Sun, color: 'text-orange-400' },
        { id: 'WORK', label: 'Work', icon: Briefcase, color: 'text-blue-400' },
        { id: 'EVENING', label: 'Relax', icon: Moon, color: 'text-purple-400' },
    ];

    return (
        <div className="absolute bottom-[24px] right-[24px] z-50 flex flex-col items-end gap-3 pointer-events-none">

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-[rgba(30,30,30,0.85)] mix-blend-screen backdrop-blur-2xl border border-white/20 p-2 rounded-3xl shadow-2xl flex flex-col gap-1 pointer-events-auto"
                    >
                        {modes.map((mode) => (
                            <button
                                key={mode.id}
                                onClick={() => {
                                    setMode(mode.id as any);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "px-4 py-3 rounded-2xl flex items-center justify-between gap-4 transition-colors",
                                    currentMode === mode.id ? "bg-white/20" : "hover:bg-white/10"
                                )}
                            >
                                <span className={cn("text-sm font-semibold tracking-wide", currentMode === mode.id ? "text-white" : "text-white/70")}>{mode.label}</span>
                                <mode.icon size={18} className={currentMode === mode.id ? "text-white" : "text-white/50"} />
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center shadow-2xl pointer-events-auto transition-transform active:scale-90",
                    isOpen ? "bg-white text-black" : "bg-[rgba(30,30,30,0.8)] backdrop-blur-xl border border-white/20 text-white hover:bg-white/20"
                )}
            >
                <Settings2 size={20} className={isOpen ? "rotate-90 transition-transform" : "transition-transform"} />
            </button>
        </div>
    );
}
