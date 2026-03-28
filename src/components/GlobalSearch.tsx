import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { APPS } from '../data/apps';
import { AppIcon } from './AppIcon';
import { useSimulator } from '../contexts/SimulatorContext';

export function GlobalSearch() {
    const { openApp } = useSimulator();
    const [searchQuery, setSearchQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const filteredApps = useMemo(() => {
        if (!searchQuery) return [];
        return APPS.filter(app => app.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [searchQuery]);

    return (
        <div className="absolute top-[60px] left-0 right-0 z-[100] px-4 flex flex-col pt-2 pointer-events-none">
            {/* Search Bar */}
            <div className="h-[36px] rounded-[100px] flex items-center shrink-0 px-3 py-2 relative overflow-hidden bg-black/40 backdrop-blur-xl border border-white/20 shadow-lg pointer-events-auto transition-all">
                <Search size={16} className="text-white/70 mr-2" />
                <input
                    type="text"
                    placeholder="Search apps..."
                    value={searchQuery}
                    onFocus={() => setIsFocused(true)}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none outline-none text-white text-[14px] w-full placeholder:text-white/60"
                />
                {(searchQuery || isFocused) && (
                    <button onClick={() => { setSearchQuery(''); setIsFocused(false); }} className="ml-2 text-white/70 hover:text-white">
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* Results Overlay */}
            <AnimatePresence>
                {(isFocused || searchQuery) && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="mt-3 bg-black/80 backdrop-blur-2xl rounded-3xl p-6 pointer-events-auto border border-white/10 shadow-2xl max-h-[500px] overflow-y-auto no-scrollbar"
                    >
                        {searchQuery && filteredApps.length === 0 ? (
                            <div className="text-center text-white/50 text-sm py-4">No apps found</div>
                        ) : (
                            <div className="grid grid-cols-4 gap-y-6 gap-x-[17.3px] justify-between">
                                {filteredApps.length > 0 ? filteredApps.map(app => (
                                    <div key={app.id} className="flex flex-col items-center">
                                       <AppIcon
                                           name={app.name}
                                           icon={app.icon}
                                           color={app.color}
                                           image={app.image}
                                           onClick={() => { openApp(app.id); setSearchQuery(''); setIsFocused(false); }}
                                       />
                                    </div>
                                )) : (
                                    <div className="col-span-4 text-center text-white/50 text-sm py-4">Type to search...</div>
                                )}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
