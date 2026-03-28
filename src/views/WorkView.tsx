import { motion } from 'framer-motion';
import { AppIcon } from '../components/AppIcon';
import { APPS } from '../data/apps';
import { useToast } from '../contexts/ToastContext';
import { Video, PenTool, Folder, Map, Music } from 'lucide-react';
import { PageViewer } from '../components/PageViewer';
import { useSimulator } from '../contexts/SimulatorContext';
import { useMemo } from 'react';

export function WorkView() {
    const { toast } = useToast();
    const { boostedApps, openApp, getTopAppsForMode } = useSimulator();

    const handleAppClick = (appId: string, isGrayscale?: boolean) => {
        const targetApp = APPS.find(a => a.id === appId);
        toast(`Opening ${targetApp?.name || appId}`);
        if (isGrayscale) {
            setTimeout(() => toast(`Notice: You are in Work Mode.`), 500);
        }
        openApp(appId);
    };

    const distractingApps = APPS.filter(a => ['instagram', 'youtube', 'netflix'].includes(a.id));

    // Calculate apps to show, bringing boosted apps to the front
    const workApps = useMemo(() => {
        const defaultWorkIds = APPS.filter(a => !['instagram', 'youtube', 'netflix', 'maps', 'spotify'].includes(a.id)).map(a => a.id);
        const topApps = getTopAppsForMode('WORK');

        let appsToShow = Array.from(new Set([...boostedApps, ...topApps, ...defaultWorkIds]));

        // Take top 8 apps
        const list = appsToShow.slice(0, 8).map(id => APPS.find(a => a.id === id)!).filter(Boolean);
        return list;
    }, [boostedApps, getTopAppsForMode]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="absolute inset-0 px-4 pt-12 pb-6 flex flex-col h-full"
        >
            {/* Productivity Slab */}
            <div className="bg-black/30 backdrop-blur-2xl border border-white/10 rounded-[32px] p-5 mb-6 text-white shadow-xl isolate">
                <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                            <Video size={20} className="text-white" />
                        </div>
                        <div>
                            <div className="text-sm font-semibold">Weekly Sync</div>
                            <div className="text-xs text-blue-200">10:00 AM - 11:00 AM</div>
                        </div>
                    </div>
                    <button
                        className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                        onClick={() => toast("Joining meeting...")}
                    >
                        Join
                    </button>
                </div>

                <div className="bg-black/20 rounded-2xl p-4 relative overflow-hidden group">
                    <div className="absolute top-2 right-2 opacity-50"><PenTool size={16} /></div>
                    <h4 className="text-xs font-semibold text-white/70 mb-2 uppercase tracking-wide">Quick Note</h4>
                    <p className="text-sm italic text-white/90">"Follow up with Sarah about the design system updates."</p>
                </div>
            </div>

            {/* Pagination Grid View */}
            <div className="flex-1 overflow-y-auto no-scrollbar relative pb-[220px] min-h-0">
                <PageViewer pages={
                    // Chunk apps into pages of 8 (2 rows of 4)
                    Array.from({ length: Math.ceil((workApps.length + distractingApps.length) / 8) }, (_, i) => {
                        const pageApps = [...workApps, ...distractingApps].slice(i * 8, (i + 1) * 8);
                        return (
                            <div key={i} className="flex-1 w-full pt-2 px-[26px]">
                                <div className="grid grid-cols-4 gap-y-[17.3px] justify-between">
                                    {pageApps.map((app) => {
                                        const isDistracting = distractingApps.some(da => da.id === app.id);
                                        return (
                                            <AppIcon
                                                key={app.id}
                                                name={app.name}
                                                icon={app.icon}
                                                color={app.color}
                                                image={app.image}
                                                disabled={isDistracting}
                                                onClick={() => handleAppClick(app.id, isDistracting)}
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
