import { useState, useEffect } from 'react';
import { motion, type PanInfo, useAnimation } from 'framer-motion';
import { useSimulator } from '../contexts/SimulatorContext';
import { Lock, Camera, Flashlight } from 'lucide-react';

export function LockScreen() {
    const { currentMode, setLocked } = useSimulator();
    const [time, setTime] = useState(new Date());
    const controls = useAnimation();

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        // If swiped up more than 150px, unlock the device
        if (info.offset.y < -150) {
            setLocked(false);
        } else {
            // Snap back if swipe wasn't enough
            controls.start({ y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } });
        }
    };

    const formattedTime = time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).replace(' AM', '').replace(' PM', '');
    const formattedDate = time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

    // Notifications context depending on mode
    const getNotifications = () => {
        switch (currentMode) {
            case 'MORNING':
                return [{ title: "Morning Routine", content: "Don't forget to review your emails.", time: "Now" }];
            case 'WORK':
                return [{ title: "Work Mode Active", content: "Notifications are silenced.", time: "10m ago" }];
            case 'EVENING':
                return [{ title: "Digital Wellbeing", content: "Time to wind down.", time: "1h ago" }];
            default:
                return [
                    { title: "Messages", content: "Hey, are we still meeting later?", time: "5m ago" },
                    { title: "Mail", content: "Weekly project update.", time: "20m ago" }
                ];
        }
    };

    return (
        <motion.div
            drag="y"
            dragConstraints={{ top: -1000, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            animate={controls}
            initial={{ y: 0 }}
            exit={{ y: "-100%", transition: { duration: 0.4, ease: "easeInOut" } }}
            className="absolute inset-x-0 inset-y-0 z-[100] cursor-grab active:cursor-grabbing pb-8 flex flex-col items-center bg-transparent"
        >
            <div
                className="absolute inset-x-0 top-0 bottom-[1px] bg-black/20"
                style={{
                    backgroundImage: 'url("/assets/f4e8b98baf01df251fad69c06120eb2503116f35.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    clipPath: 'inset(0px 0px 0px 0px)' // ensure background itself clips cleanly
                }}
            />
            <div className="absolute inset-0 bg-black/20" /> {/* Subtle dim */}

            {/* Top Padlock */}
            <div className="relative z-10 pt-16 mb-2">
                <Lock size={20} className="text-white drop-shadow-md mx-auto" strokeWidth={2.5} />
            </div>

            {/* Date & Time */}
            <div className="relative z-10 flex flex-col items-center text-white text-center tracking-tight mt-[16px]">
                <span className="text-[22px] font-[500] drop-shadow-lg opacity-90 tracking-[0.35px] font-['SF_Pro:Medium']">{formattedDate}</span>
                <h1 className="text-[96px] font-[500] leading-[100px] -mt-1 drop-shadow-lg tracking-[-2px] font-['SF_Pro:Medium']">
                    {formattedTime}
                </h1>
            </div>

            {/* Notifications */}
            <div className="relative z-10 w-full px-4 mt-[40px] flex flex-col gap-2">
                {getNotifications().map((notif, i) => (
                    <div
                        key={i}
                        className="bg-[rgba(255,255,255,0.07)] mix-blend-screen shadow-[0px_8px_40px_0px_rgba(0,0,0,0.2)] px-[16px] py-[15px] rounded-[24px] relative overflow-hidden flex items-start"
                        style={{ backdropFilter: 'blur(34.25px)' }}
                    >
                        {/* App Icon */}
                        <div className="w-[38px] h-[38px] rounded-[10px] bg-white shrink-0 mr-3 flex items-center justify-center overflow-hidden">
                            {currentMode === 'MORNING' && <img src="/assets/e51130db3e3410ac00bd0ca6daea130b9b3d1eec.png" className="w-full h-full object-cover" />}
                            {currentMode === 'WORK' && <img src="/assets/ab9306709315ca1ca8ea2df617a9af5a097c6bbc.png" className="w-full h-full object-cover" />}
                            {currentMode === 'EVENING' && <div className="w-full h-full bg-pink-500 flex items-center justify-center"><Flashlight size={20} className="text-white" /></div>}
                            {currentMode === 'NEUTRAL' && <img src="/assets/dd3b1a5ed7db644c197314328f647774bd86226e.png" className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-1 mt-0.5">
                            <div className="flex justify-between items-baseline mb-0.5">
                                <span className="text-[15px] font-[600] text-white font-['SF_Pro:Semibold'] leading-[20px] tracking-[-0.24px]">{notif.title}</span>
                                <span className="text-[13px] text-[rgba(235,235,245,0.6)] font-[400] tracking-[-0.08px]">{notif.time}</span>
                            </div>
                            <p className="text-[15px] text-white font-[400] leading-[20px] tracking-[-0.24px]">{notif.content}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex-1" />

            {/* Bottom Shortcuts */}
            <div className="relative z-10 w-full px-8 flex justify-between mb-8">
                <div className="w-12 h-12 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 text-white shadow-lg">
                    <Flashlight size={22} fill="white" className="opacity-90" />
                </div>
                <div className="w-12 h-12 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 text-white shadow-lg">
                    <Camera size={22} className="opacity-90" />
                </div>
            </div>

            {/* Swipe up hint */}
            <div className="relative z-10 mb-2 flex flex-col items-center">
                <span className="text-[14px] font-medium text-white drop-shadow-md tracking-wide">Swipe up to unlock</span>
            </div>

        </motion.div>
    );
}
