import { useState } from 'react';
import { motion, useAnimation, type PanInfo } from 'framer-motion';
import { Sun, Briefcase, Moon, Smartphone, Wifi, Bluetooth, Zap, Camera, BellOff, Lock, Copy, Battery, Play, FastForward, Rewind, Signal } from 'lucide-react';
import { useSimulator } from '../contexts/SimulatorContext';
import { cn } from '../lib/utils';

export function ControlCenter() {
    const { currentMode, setMode } = useSimulator();
    const [isOpen, setIsOpen] = useState(false);
    const controls = useAnimation();

    const handleDragEnd = (_e: any, info: PanInfo) => {
        if (isOpen && info.offset.y < -100) {
            setIsOpen(false);
            controls.start({ y: "-100%" });
        } else if (!isOpen && info.offset.y > 100) {
            setIsOpen(true);
            controls.start({ y: 0 });
        } else {
            controls.start({ y: isOpen ? 0 : "-100%" });
        }
    };

    const toggleMode = (mode: 'NEUTRAL' | 'MORNING' | 'WORK' | 'EVENING') => {
        setMode(mode);
    };

    // Shared block style for the iOS frosted glass look
    const blockStyle = "bg-[rgba(100,100,100,0.3)] backdrop-blur-[45px] border border-white/5 overflow-hidden flex items-center justify-center relative";
    const smBlockRadius = "rounded-[24px]";
    const lgBlockRadius = "rounded-[36px]";

    return (
        <>
            {/* Invisible trigger zone at top right corner */}
            {!isOpen && (
                <motion.div
                    drag="y"
                    dragConstraints={{ top: 0, bottom: 0 }}
                    dragElastic={0.4}
                    onDragEnd={handleDragEnd}
                    className="absolute top-0 right-0 w-[40%] h-[80px] z-[200] cursor-grab active:cursor-grabbing"
                />
            )}

            {/* Control Center Overlay overlay */}
            <motion.div
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={isOpen ? 0 : 0.4}
                onDragEnd={handleDragEnd}
                animate={controls}
                initial={{ y: "-100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 280, mass: 0.8 }}
                className="absolute inset-x-0 inset-y-0 z-[160] flex flex-col items-center pt-[70px] cursor-grab active:cursor-grabbing bg-[rgba(0,0,0,0.25)] backdrop-blur-[20px]"
            >
                {/* 
                    Exact iOS Control Center Grid Layout
                    Base unit: 72px width, 72px height
                    Gap: 14px 
                    Total Width: 4 * 72 + 3 * 14 = 330px
                */}
                <div className="grid grid-cols-4 gap-[14px] w-[330px] select-none pointer-events-none">

                    {/* Row 1 & 2: Network (left) and Media (right) */}
                    <div className={cn("col-span-2 row-span-2 p-3.5 flex flex-col justify-between h-[158px]", blockStyle, lgBlockRadius)}>
                        <div className="flex justify-between w-full h-full">
                            <div className="flex flex-col justify-between h-full">
                                {/* Airplane */}
                                <div className="w-[52px] h-[52px] rounded-full bg-[rgba(255,255,255,0.15)] flex items-center justify-center transition-colors">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l5.5 4.5-4 4-2.5-1-1.5 1.5 3.5 3.5 3.5 3.5 1.5-1.5-1-2.5 4-4 4.5 5.5 1.2-.7c.4-.2.7-.6.6-1.1z" /></svg>
                                </div>
                                {/* WiFi Active */}
                                <div className="w-[52px] h-[52px] rounded-full bg-blue-500 flex items-center justify-center transition-colors">
                                    <Wifi size={24} className="text-white" />
                                </div>
                            </div>
                            <div className="flex flex-col justify-between h-full">
                                {/* Airdrop */}
                                <div className="w-[52px] h-[52px] rounded-full bg-[rgba(255,255,255,0.15)] flex items-center justify-center transition-colors">
                                    <Signal size={24} className="text-white" />
                                </div>
                                {/* Bluetooth Active */}
                                <div className="w-[52px] h-[52px] rounded-full bg-blue-500 flex items-center justify-center transition-colors">
                                    <Bluetooth size={24} className="text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={cn("col-span-2 row-span-2 p-4 flex flex-col h-[158px] relative", blockStyle, lgBlockRadius)}>
                        <div className="absolute top-4 right-4 text-white/40"><Zap size={20} /></div>
                        <div className="w-[48px] h-[48px] bg-white/10 rounded-[12px] mb-2" />
                        <div className="text-left w-full">
                            <h4 className="text-white text-[15px] font-semibold leading-tight">Track</h4>
                            <p className="text-white/60 text-[13px]">Artist</p>
                        </div>
                        <div className="flex items-center justify-between w-full mt-3 px-1 text-white">
                            <Rewind size={20} fill="white" />
                            <Play size={24} fill="white" />
                            <FastForward size={20} fill="white" />
                        </div>
                    </div>

                    {/* Row 3 */}
                    <div className={cn("col-span-1 row-span-1 h-[72px]", blockStyle, smBlockRadius)}>
                        <Camera size={26} className="text-white" strokeWidth={1.5} />
                    </div>
                    <div className={cn("col-span-1 row-span-1 h-[72px] bg-white", blockStyle, smBlockRadius)}>
                        <BellOff size={26} className="text-red-500" strokeWidth={1.5} />
                    </div>

                    {/* Sliders (Span Row 3 & 4) */}
                    <div className={cn("col-span-1 row-span-2 h-[158px] flex flex-col justify-end p-0", blockStyle, smBlockRadius)}>
                        <div className="absolute inset-x-0 bottom-0 h-[65%] bg-white/90" />
                        <Sun size={24} className="text-black/50 relative z-10 mb-4 mix-blend-difference invert" />
                    </div>
                    <div className={cn("col-span-1 row-span-2 h-[158px] flex flex-col justify-end p-0", blockStyle, smBlockRadius)}>
                        <div className="absolute inset-x-0 bottom-0 h-[40%] bg-white/90" />
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-black/50 relative z-10 mb-4 mix-blend-difference invert"><path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>
                    </div>

                    {/* Row 4 (Left Focus) */}
                    <div className={cn("col-span-2 row-span-1 h-[72px] flex items-center px-4 gap-3", blockStyle, smBlockRadius)}>
                        <div className="w-[36px] h-[36px] rounded-full bg-[rgba(255,255,255,0.2)] flex items-center justify-center">
                            <Moon size={18} className="text-purple-300" />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-white text-[15px] font-semibold leading-tight">Focus</span>
                            <span className="text-white/60 text-[12px] leading-tight">Setup</span>
                        </div>
                    </div>

                    {/* Row 5 & 6 (Left 2x2 area replaced with AI Contexts) */}
                    <button
                        onPointerDownCapture={(e) => e.stopPropagation()}
                        onClick={() => toggleMode('MORNING')}
                        className={cn("col-span-1 row-span-1 h-[72px] transition-transform active:scale-95 pointer-events-auto cursor-pointer", blockStyle, smBlockRadius, currentMode === 'MORNING' && "bg-white")}>
                        <Sun size={28} className={currentMode === 'MORNING' ? "text-orange-500" : "text-white"} />
                    </button>
                    <button
                        onPointerDownCapture={(e) => e.stopPropagation()}
                        onClick={() => toggleMode('WORK')}
                        className={cn("col-span-1 row-span-1 h-[72px] transition-transform active:scale-95 pointer-events-auto cursor-pointer", blockStyle, smBlockRadius, currentMode === 'WORK' && "bg-white")}>
                        <Briefcase size={28} className={currentMode === 'WORK' ? "text-blue-500" : "text-white"} />
                    </button>

                    {/* Row 5 (Right) */}
                    <div className={cn("col-span-1 row-span-1 h-[72px]", blockStyle, smBlockRadius)}>
                        <Lock size={26} className="text-white" strokeWidth={1.5} />
                    </div>
                    <div className={cn("col-span-1 row-span-1 h-[72px]", blockStyle, smBlockRadius)}>
                        <Copy size={26} className="text-white" strokeWidth={1.5} />
                    </div>

                    {/* Row 6 (Left part continued) */}
                    <button
                        onPointerDownCapture={(e) => e.stopPropagation()}
                        onClick={() => toggleMode('EVENING')}
                        className={cn("col-span-1 row-span-1 h-[72px] transition-transform active:scale-95 pointer-events-auto cursor-pointer", blockStyle, smBlockRadius, currentMode === 'EVENING' && "bg-white")}>
                        <Moon size={28} className={currentMode === 'EVENING' ? "text-purple-500" : "text-white"} />
                    </button>
                    <button
                        onPointerDownCapture={(e) => e.stopPropagation()}
                        onClick={() => toggleMode('NEUTRAL')}
                        className={cn("col-span-1 row-span-1 h-[72px] transition-transform active:scale-95 pointer-events-auto cursor-pointer", blockStyle, smBlockRadius, currentMode === 'NEUTRAL' && "bg-white")}>
                        <Smartphone size={28} className={currentMode === 'NEUTRAL' ? "text-neutral-900" : "text-white"} />
                    </button>

                    {/* Row 6 (Right) */}
                    <div className={cn("col-span-1 row-span-1 h-[72px]", blockStyle, smBlockRadius)}>
                        <Battery size={26} className="text-white" strokeWidth={1.5} />
                    </div>
                    <div className="col-span-1 row-span-1 h-[72px]" /> {/* Empty slot */}

                </div>
            </motion.div>
        </>
    );
}
