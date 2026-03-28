import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { APPS } from '../data/apps';

interface AppViewProps {
    appName: string;
    onClose: () => void;
}

export function AppView({ appName, onClose }: AppViewProps) {
    const controls = useAnimation();
    const appData = APPS.find(a => a.name === appName || a.id === appName);

    // Initial animation when opening the app
    useEffect(() => {
        controls.start({
            y: 0,
            scale: 1,
            opacity: 1,
            transition: { type: "spring", damping: 25, stiffness: 200 }
        });
    }, [controls]);

    const handleDragEnd = (_: any, info: any) => {
        // Swipe to close the app logic (Swipe up from bottom)
        const threshold = -100;
        if (info.offset.y < threshold || info.velocity.y < -500) {
            // Replicate iOS swipe up to close
            controls.start({
                scale: 0.8,
                opacity: 0,
                transition: { duration: 0.2 }
            }).then(() => {
                onClose();
            });
        } else {
            // Spring back if drag wasn't far enough
            controls.start({
                y: 0,
                scale: 1,
                opacity: 1,
                transition: { type: "spring", stiffness: 300, damping: 30 }
            });
        }
    };

    return (
        <motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.4}
            onDragEnd={handleDragEnd}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={controls}
            exit={{ scale: 0.8, opacity: 0, transition: { duration: 0.2 } }}
            className="absolute inset-0 z-[100] bg-white flex flex-col items-center justify-center overflow-hidden touch-none"
        >
            {/* iOS Back Button Header */}
            <div className="absolute top-12 left-0 right-0 px-4 flex items-center z-10">
                <button
                    onClick={() => {
                        controls.start({ opacity: 0, scale: 0.8 }).then(onClose);
                    }}
                    className="flex items-center gap-1 text-blue-500 font-medium text-[17px] active:opacity-70 transition-opacity"
                >
                    <ChevronLeft size={28} className="-ml-2" />
                    Back
                </button>
            </div>

            {/* Centered Content */}
            <div className="flex flex-col items-center justify-center pointer-events-none">
                {appData && appData.icon && (
                    <appData.icon size={80} color="black" strokeWidth={1.5} />
                )}
                {appData && appData.image && (
                    <img src={appData.image} alt={appData.name} className="w-20 h-20 rounded-[20px] shadow-lg" />
                )}
                {!appData && (
                    <div className="w-20 h-20 bg-neutral-200 rounded-[20px] flex items-center justify-center border border-black/10">
                        <span className="text-black font-bold text-2xl">{appName.substring(0, 1)}</span>
                    </div>
                )}
                <span className="text-black mt-4 text-xl font-medium tracking-wide">
                    {appData ? appData.name : appName}
                </span>

                {/* Home Indicator Replicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-[5px] bg-black/50 rounded-full" />
            </div>
        </motion.div>
    );
}
