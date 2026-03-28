import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { APPS } from '../data/apps';
import { useToast } from '../contexts/ToastContext';
import { PlayCircle, Headphones, BookOpen, AlertCircle, Folder, Map, Music } from 'lucide-react';
import { AppIcon } from '../components/AppIcon';
import { useSimulator } from '../contexts/SimulatorContext';

function WellbeingModal({ isOpen, onClose, onIgnore }: { isOpen: boolean, onClose: () => void, onIgnore: () => void }) {
    if (!isOpen) return null;
    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={onClose} />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-[#1c1c1e] bg-opacity-95 border border-white/10 p-6 rounded-[32px] shadow-2xl w-full max-w-[320px] text-center"
            >
                <div className="mx-auto w-14 h-14 bg-red-500/20 rounded-full flex items-center justify-center mb-4 text-red-400">
                    <AlertCircle size={32} />
                </div>
                <h3 className="text-white font-semibold text-xl mb-2">Digital Wellbeing</h3>
                <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
                    You usually wind down at this time. Spending time on <strong className="text-white">Social Media</strong> right now may affect your sleep.
                </p>
                <div className="flex flex-col gap-3">
                    <button onClick={onIgnore} className="w-full py-3.5 px-4 rounded-2xl font-semibold bg-white text-black active:scale-95 transition-transform">
                        15 minutes
                    </button>
                    <button onClick={onIgnore} className="w-full py-3.5 px-4 text-white/80 font-medium bg-neutral-800 rounded-2xl active:scale-95 transition-transform">
                        Ignore and Open
                    </button>
                    <button onClick={onClose} className="w-full py-3.5 px-4 text-white/50 font-medium active:scale-95 transition-transform">
                        Cancel
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

export function EveningView() {
    const { toast } = useToast();
    const { boostedApps, openApp, getTopAppsForMode } = useSimulator();
    const [pendingApp, setPendingApp] = useState<string | null>(null);
    const [showWarning, setShowWarning] = useState(false);

    const handleAppClick = (appId: string, isSocial?: boolean) => {
        if (isSocial) {
            setPendingApp(appId);
            setShowWarning(true);
            return;
        }
        openApp(appId);
    };

    const handleIgnoreWarning = () => {
        if (pendingApp) {
            openApp(pendingApp);
        }
        setShowWarning(false);
        setPendingApp(null);
    };

    const socialApps = APPS.filter(a => ['instagram', 'whatsapp'].includes(a.id));

    // Calculate apps to show, bringing boosted apps to the front
    const focusApps = useMemo(() => {
        const defaultFocusIds = ['notes', 'mail', 'calendar', 'weather', 'reminders'];
        const topApps = getTopAppsForMode('EVENING');

        let appsToShow = Array.from(new Set([...boostedApps, ...topApps, ...defaultFocusIds]));

        // Return up to 5 apps
        const list = appsToShow.slice(0, 5).map(id => APPS.find(a => a.id === id)!).filter(Boolean);
        return list;
    }, [boostedApps, getTopAppsForMode]);

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                className="absolute inset-0 px-4 pt-12 pb-6 flex flex-col h-full"
            >
                <div className="flex-1 overflow-y-auto no-scrollbar pb-[150px] min-h-0 flex flex-col justify-between">
                    <div className="flex flex-col gap-6 w-[100%] mx-auto">
                        {/* Watch Widget - Horizontally Scrollable */}
                        <section>
                            <div className="flex items-center gap-2 mb-3">
                                <PlayCircle size={18} className="text-red-400" />
                                <h3 className="text-white font-semibold tracking-wide flex-1">Watch</h3>
                            </div>
                            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x snap-mandatory">
                                <div className="w-[85%] sm:w-[280px] snap-center shrink-0 bg-neutral-800 rounded-[28px] h-36 relative overflow-hidden group cursor-pointer" onClick={() => toast("Playing Stranger Things")}>
                                    <img src="https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Stranger Things" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                                        <div className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm inline-block mb-1">NETFLIX ORIGINAL</div>
                                        <h4 className="text-white font-bold text-lg leading-tight">Stranger Things</h4>
                                        <p className="text-white/70 text-xs">Continue S4:E2</p>
                                    </div>
                                </div>
                                <div className="w-[85%] sm:w-[280px] snap-center shrink-0 bg-neutral-800 rounded-[28px] h-36 relative overflow-hidden group cursor-pointer" onClick={() => toast("Playing YouTube")}>
                                    <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Tech Review" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                                        <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mb-1"><PlayCircle size={14} className="text-white" /></div>
                                        <h4 className="text-white font-bold text-lg leading-tight">Late Night Lofi</h4>
                                        <p className="text-white/70 text-xs">Recommended for you</p>
                                    </div>
                                </div>
                            </div>
                            {/* Scroll Indicators */}
                            <div className="flex justify-center gap-1.5 mt-2 mb-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-white transition-colors"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-white/40 transition-colors"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-white/40 transition-colors"></div>
                            </div>
                        </section>

                        {/* Listen Section */}
                        <section>
                            <div className="flex items-center gap-2 mb-3">
                                <Headphones size={18} className="text-green-400" />
                                <h3 className="text-white font-semibold tracking-wide">Listen</h3>
                            </div>
                            <div className="bg-[#1dab51] rounded-3xl p-4 flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-transform" onClick={() => toast("Resuming sleep playlist")}>
                                <div className="w-16 h-16 bg-black/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shrink-0">
                                    <BookOpen size={24} className="text-white" />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-white font-bold mb-1 truncate">Sleep Sounds & Binaural Beats</h4>
                                    <p className="text-white/80 text-xs truncate">Playing from Your Library</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Social / Muted Section - Exact Grid Match */}
                    <section className="mt-4 px-[10px]">
                        <div className="flex items-center gap-2 mb-3">
                            <h3 className="text-white/70 font-semibold tracking-wide">Wind Down</h3>
                        </div>
                        <div className="grid grid-cols-4 gap-y-[17.3px] justify-between">
                            {socialApps.map((app) => (
                                <AppIcon
                                    key={app.id}
                                    name={app.name}
                                    icon={app.icon}
                                    color={app.color}
                                    image={app.image}
                                    disabled={true}
                                    onClick={() => handleAppClick(app.id, true)}
                                />
                            ))}
                            {focusApps.map((app) => (
                                <AppIcon
                                    key={app.id}
                                    name={app.name}
                                    icon={app.icon}
                                    color={app.color}
                                    image={app.image}
                                    onClick={() => handleAppClick(app.id)}
                                />
                            ))}
                        </div>
                    </section>
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

            <AnimatePresence>
                {showWarning && <WellbeingModal isOpen={showWarning} onClose={() => { setShowWarning(false); setPendingApp(null); }} onIgnore={handleIgnoreWarning} />}
            </AnimatePresence>
        </>
    );
}
