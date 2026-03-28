import { motion } from 'framer-motion';
import { AppIcon } from '../components/AppIcon';
import { APPS } from '../data/apps';
import { useToast } from '../contexts/ToastContext';
import { Cloud, CheckCircle2, Clock, Folder, Map, Music } from 'lucide-react';
import { PageViewer } from '../components/PageViewer';
import { useSimulator } from '../contexts/SimulatorContext';
import { useMemo } from 'react';

export function MorningView() {
    const { toast } = useToast();
    const { boostedApps, openApp, getTopAppsForMode } = useSimulator();

    const handleAppClick = (appId: string, isLocked?: boolean) => {
        if (isLocked) {
            toast("Context Lock: Are you sure you want to open this now?");
            return;
        }
        openApp(appId);
    };

    // Calculate apps to show, bringing boosted apps to the front
    const morningApps = useMemo(() => {
        const defaultMorningIds = ['mail', 'calendar', 'notes', 'weather', 'maps', 'camera', 'photos', 'news', 'reminders', 'clock', 'wallet'];
        const topApps = getTopAppsForMode('MORNING');

        let appsToShow = Array.from(new Set([...boostedApps, ...topApps, ...defaultMorningIds]));

        // Take top 11 apps
        const list = appsToShow.slice(0, 11).map(id => APPS.find(a => a.id === id)!).filter(Boolean);
        return list;
    }, [boostedApps, getTopAppsForMode]);

    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="absolute inset-0 px-4 pt-12 pb-6 flex flex-col h-full"
        >
            {/* Morning Dashboard Widget */}
            <div className="bg-black/30 backdrop-blur-2xl border border-white/10 rounded-3xl p-4 mb-6 text-white shadow-xl isolate shrink-0">
                <h2 className="text-xl font-semibold mb-3">Good Morning ☕️</h2>

                <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-black/20 rounded-2xl p-3 flex flex-col justify-center">
                        <Cloud size={24} className="mb-2 text-blue-300" />
                        <span className="text-sm font-medium">68° Partly Cloudy</span>
                    </div>
                    <div className="bg-black/20 rounded-2xl p-3 flex flex-col justify-center">
                        <Clock size={24} className="mb-2 text-orange-300" />
                        <span className="text-sm font-medium">Next: 9:00 AM Standup</span>
                    </div>
                </div>

                <div className="bg-black/20 rounded-2xl p-3">
                    <div className="flex items-center gap-2 mb-2 bg-black/20 p-2 rounded-xl">
                        <CheckCircle2 size={16} className="text-green-400" />
                        <span className="text-sm">Check overnight emails</span>
                    </div>
                    <div className="flex items-center gap-2 bg-black/20 p-2 rounded-xl">
                        <CheckCircle2 size={16} className="text-neutral-500" />
                        <span className="text-sm text-neutral-400 line-through">Morning meditation</span>
                    </div>
                </div>
            </div>

            {/* Pagination Grid View */}
            <div className="flex-1 overflow-y-auto no-scrollbar relative pb-[150px] min-h-0">
                <PageViewer pages={
                    // Chunk apps into pages of 8 (2 rows of 4)
                    Array.from({ length: Math.ceil((morningApps.length + 1) / 8) }, (_, i) => {
                        const pageApps = [...morningApps, { id: 'special_folder', name: 'Focus', icon: Cloud, color: '' }].slice(i * 8, (i + 1) * 8);
                        return (
                            <div key={i} className="flex-1 w-full pt-2 px-[26px]">
                                <div className="grid grid-cols-4 gap-y-[17.3px] justify-between">
                                    {pageApps.map((app) => {
                                        if (app.id === 'special_folder') {
                                            return (
                                                <div key="focus-folder" className="flex flex-col items-center gap-[5px] w-[72px]" onClick={() => handleAppClick('special_folder', true)}>
                                                    <motion.button
                                                        whileTap={{ scale: 0.9 }}
                                                        className="relative flex items-center justify-center w-[64px] h-[64px] squircle shadow-sm transition-all duration-300 bg-white/30 backdrop-blur-[30px] p-[6px]"
                                                    >
                                                        <div className="w-full h-full grid grid-cols-2 gap-[4px]">
                                                            <div className="w-full h-full rounded-[6px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 shadow-inner flex items-center justify-center">
                                                                <span className="text-[8px] text-white font-bold drop-shadow-md">In</span>
                                                            </div>
                                                            <div className="w-full h-full rounded-[6px] bg-black shadow-inner flex items-center justify-center">
                                                                <span className="text-[8px] text-white font-bold drop-shadow-md">Tk</span>
                                                            </div>
                                                            <div className="w-full h-full rounded-[6px] bg-blue-500 shadow-inner flex items-center justify-center">
                                                                <span className="text-[8px] text-white font-bold drop-shadow-md">Fb</span>
                                                            </div>
                                                            <div className="w-full h-full rounded-[6px] bg-blue-400 shadow-inner flex items-center justify-center">
                                                                <span className="text-[8px] text-white font-bold drop-shadow-md">Tw</span>
                                                            </div>
                                                        </div>
                                                        <div className="absolute inset-0 bg-black/50 squircle flex items-center justify-center backdrop-blur-[2px]">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                                        </div>
                                                    </motion.button>
                                                    <span className="font-['SF_Pro:Medium',sans-serif] font-[510] leading-[normal] text-[12px] text-center text-ellipsis text-shadow-[0px_2px_25px_black] text-white overflow-hidden shrink-0 mt-[5px]" style={{ fontVariationSettings: "'wdth' 100" }}>Focus</span>
                                                </div>
                                            );
                                        }

                                        return (
                                            <AppIcon
                                                key={app.id}
                                                name={app.name}
                                                icon={app.icon}
                                                color={app.color}
                                                image={app.image}
                                                badge={app.id === 'mail' ? 12 : undefined}
                                                onClick={() => handleAppClick(app.id)}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })
                } />
            </div>

            {/* Dynamic Commute Folder - Fixed at bottom above dock */}
            <div className="absolute bottom-[40px] left-0 right-0 z-20 pointer-events-none px-4">
                <div className="bg-white/20 w-full mx-auto rounded-[32px] p-4 backdrop-blur-xl border border-white/20 cursor-pointer pointer-events-auto hover:bg-white/30 transition-colors"
                    onClick={() => toast("Opening Commute Folder...")}>
                    <div className="flex items-center justify-between mb-3 px-2">
                        <span className="text-sm font-semibold text-white">Commute Predictions</span>
                        <Folder size={16} className="text-white/70" />
                    </div>
                    <div className="flex gap-4 justify-around">
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-green-500 rounded-[18px] flex items-center justify-center shadow-lg mb-1">
                                <Map size={24} className="text-white" />
                            </div>
                            <span className="text-[10px] text-white font-medium">Maps (12m)</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-black rounded-[18px] flex items-center justify-center shadow-lg mb-1">
                                <span className="text-white font-bold italic">Uber</span>
                            </div>
                            <span className="text-[10px] text-white font-medium">4 mins away</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-green-600 rounded-[18px] flex items-center justify-center shadow-lg mb-1">
                                <Music size={24} className="text-white" />
                            </div>
                            <span className="text-[10px] text-white font-medium">Podcasts</span>
                        </div>
                    </div>
                </div>
            </div>

        </motion.div>
    );
}
