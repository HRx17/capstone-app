import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

// Using the same singleton socket approach as SimulatorContext
import { io } from 'socket.io-client';
const socket = io(`http://${window.location.hostname}:3001`);

interface NotificationData {
    id: string;
    title: string;
    message: string;
    icon?: string;
}

export function NotificationBanner() {
    const [notifications, setNotifications] = useState<NotificationData[]>([]);

    useEffect(() => {
        socket.on('notification-received', (data: any) => {
            const newNotif = { ...data, id: Math.random().toString(36).substring(7) };
            setNotifications(prev => [...prev, newNotif]);

            // Auto dismiss after 4 seconds
            setTimeout(() => {
                setNotifications(prev => prev.filter(n => n.id !== newNotif.id));
            }, 4000);
        });

        return () => {
            socket.off('notification-received');
        };
    }, []);

    return (
        <div className="absolute top-[64px] left-0 right-0 z-[200] flex flex-col items-center gap-2 pointer-events-none px-4">
            <AnimatePresence>
                {notifications.map((notif) => (
                    <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, y: -20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        className="bg-[#1c1c1e]/90 backdrop-blur-xl border border-white/10 rounded-2xl w-full max-w-[340px] p-4 shadow-2xl flex items-start gap-3 pointer-events-auto"
                        onClick={() => setNotifications(prev => prev.filter(n => n.id !== notif.id))}
                    >
                        <div className="w-10 h-10 rounded-[10px] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-inner text-xl">
                            {notif.icon || '✨'}
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                            <div className="flex justify-between items-center mb-0.5">
                                <h4 className="text-white font-medium text-[15px] leading-tight flex items-center gap-1.5">
                                    {notif.title}
                                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded-[4px] uppercase font-bold tracking-wider">AI</span>
                                </h4>
                                <span className="text-neutral-400 text-xs">now</span>
                            </div>
                            <p className="text-neutral-300 text-[13.5px] leading-snug truncate">
                                {notif.message}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
