import { useState, useMemo, useEffect } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { AppIcon } from '../components/AppIcon';
import { APPS } from '../data/apps';
import { PageViewer } from '../components/PageViewer';
import { useSimulator } from '../contexts/SimulatorContext';

// Exactly match Figma 3:2614 iOS Home Screen order
const initialIosAppOrder = [
    'facetime', 'calendar', 'photos', 'camera',
    'mail', 'notes', 'reminders', 'clock',
    'news', 'tv', 'games', 'appstore',
    'maps', 'health', 'wallet', 'settings'
];

export function NeutralView() {
    const { boostedApps, openApp, getTopAppsForMode } = useSimulator();

    const [isEditing, setIsEditing] = useState(false);

    const [appIds, setAppIds] = useState<string[]>([]);

    useEffect(() => {
        const topApps = getTopAppsForMode('NEUTRAL');
        const dockIds = ['facetime', 'maps', 'whatsapp', 'spotify'];
        
        const allOtherAppIds = APPS.map(a => a.id).filter(id => !dockIds.includes(id));
        
        setAppIds(prev => {
            const current = prev.length > 0 ? prev : initialIosAppOrder;
            return Array.from(new Set([
                ...boostedApps, // Highest priority
                ...topApps,     // AI memory priority
                ...current,     // User's custom order or initial iOS order
                ...allOtherAppIds // Fill the rest with all supported apps
            ]));
        });
    }, [boostedApps]); // AI memory sets on mount, boostedApps reacts real-time

    const handleAppClick = (appId: string) => {
        if (isEditing) return; // Prevent clicks while jiggling
        openApp(appId);
    };

    // Calculate which apps to show based on the current sorted IDs
    const displayedApps = useMemo(() => {
        return appIds.map(id => APPS.find(a => a.id === id)!).filter(Boolean);
    }, [appIds]);

    // Chunk into pages of 24 apps each (4 columns x 6 rows)
    const paginatedApps = useMemo(() => {
        const chunks = [];
        const chunkSize = 24;
        for (let i = 0; i < displayedApps.length; i += chunkSize) {
            chunks.push(displayedApps.slice(i, i + chunkSize));
        }
        return chunks;
    }, [displayedApps]);

    // Dock apps
    const dockApps = [
        { id: 'phone', name: 'Phone', icon: APPS.find(a => a.id === 'facetime')?.icon, color: 'bg-green-500', image: '/assets/be0ee9b967751c8796eabda800355dc882ddfd66.png' },
        { id: 'safari', name: 'Safari', icon: APPS.find(a => a.id === 'maps')?.icon, color: 'bg-white', image: '/assets/b3c7d4cebbfc914ec87f981d05b6f31335c80f3f.png' },
        { id: 'messages', name: 'Messages', icon: APPS.find(a => a.id === 'whatsapp')?.icon, color: 'bg-green-500', image: '/assets/dd3b1a5ed7db644c197314328f647774bd86226e.png' },
        { id: 'music', name: 'Music', icon: APPS.find(a => a.id === 'spotify')?.icon, color: 'bg-red-500', image: '/assets/763e27ff64bf5bdaa996bbfac0837229d5d68fc6.png' }
    ];

    // Jiggle animation variants for edit mode
    const jiggleVariants: any = {
        idle: { rotate: 0 },
        jiggling: {
            rotate: [-2, 2, -2],
            transition: {
                repeat: Infinity,
                duration: 0.2,
                ease: "linear",
            }
        }
    };

    const pages = paginatedApps.map((pageApps, pageIndex) => (
        <div
            key={`page-${pageIndex}`}
            className="flex-1 w-full pt-[28.6px] px-[26px]"
            onClick={() => isEditing && setIsEditing(false)}
        >
                <Reorder.Group
                    axis="y"
                    values={pageApps.map(a => a.id)}
                    onReorder={(newOrder) => {
                        setAppIds(prev => {
                            const newFullOrder = [...prev];
                            const startIdx = pageIndex * 24;
                            newOrder.forEach((id, i) => {
                                newFullOrder[startIdx + i] = id;
                            });
                            return newFullOrder;
                        });
                    }}
                    className="grid grid-cols-4 gap-y-[17.3px] justify-between h-max"
                >
                    {pageApps.map((app) => (
                        <Reorder.Item
                            key={app.id}
                            value={app.id}
                            drag={isEditing}
                            onDragStart={() => setIsEditing(true)}
                            className="relative flex justify-center"
                        >
                            <motion.div
                                variants={jiggleVariants}
                                animate={isEditing ? "jiggling" : "idle"}
                                onPointerDown={(e) => {
                                    const timer = setTimeout(() => setIsEditing(true), 500);
                                    e.currentTarget.addEventListener('pointerup', () => clearTimeout(timer), { once: true });
                                }}
                            >
                                <AppIcon
                                    name={app.name}
                                    icon={app.icon}
                                    color={app.color}
                                    image={app.image}
                                    onClick={() => handleAppClick(app.id)}
                                />
                                {isEditing && (
                                    <div
                                        className="absolute -top-1 -left-1 w-5 h-5 bg-neutral-300 rounded-full flex items-center justify-center text-black text-xs cursor-pointer z-50 border border-neutral-400"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        -
                                    </div>
                                )}
                            </motion.div>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
        </div>
    ));

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 pt-10 flex flex-col h-full"
        >
            {/* Fix grid sizing to allow scrolling if needed behind the dock */}
            <div className="flex-1 overflow-y-auto no-scrollbar relative min-h-0 pb-[150px]">
                <PageViewer pages={pages} />
            </div>

            {/* Fixed Bottom UI overlay */}
            <div className="absolute bottom-[20px] left-0 right-0 pointer-events-none flex flex-col items-center z-50">
                {/* Dock */}
                <div className="w-full px-[17px] pointer-events-auto">
                    <div className="w-full h-[98px] rounded-[38px] relative overflow-hidden flex items-center justify-between px-[19px] py-[20px] mx-auto bg-[rgba(255,255,255,0.25)] mix-blend-screen backdrop-blur-[45px]">
                        {dockApps.map(app => (
                            <div key={app.id} className="relative z-10 w-[64px] h-[64px] shrink-0" onClick={() => handleAppClick(app.id)}>
                                <img src={app.image} className="w-full h-full object-cover rounded-[16px] shadow-sm" alt={app.name} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 'Done' button for edit mode */}
            <AnimatePresence>
                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute top-12 right-4 z-50"
                    >
                        <button
                            onClick={() => setIsEditing(false)}
                            className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-sm font-medium border border-white/10"
                        >
                            Done
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
