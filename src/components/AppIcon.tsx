import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface AppIconProps {
    name: string;
    icon: React.ComponentType<any>;
    color: string;
    image?: string;
    badge?: number;
    disabled?: boolean;
    locked?: boolean;
    onClick: (name: string, locked?: boolean) => void;
}

export function AppIcon({ name, icon: Icon, color, image, badge, disabled, locked, onClick }: AppIconProps) {
    return (
        <div className="flex flex-col items-center gap-[5px] w-[72px]" onClick={() => onClick(name, locked)}>
            <motion.button
                whileTap={{ scale: 0.9 }}
                className={cn(
                    "relative flex items-center justify-center w-[64px] h-[64px] squircle shadow-sm transition-all duration-300",
                    color,
                    disabled && "grayscale opacity-50 contrast-75",
                )}
            >
                {image ? (
                    <img src={image} alt={name} className="w-full h-full object-cover rounded-[14px]" />
                ) : (
                    <Icon size={32} className="text-white drop-shadow-sm" strokeWidth={1.5} />
                )}

                {badge && badge > 0 && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white text-[11px] font-bold min-w-[20px] h-[20px] flex items-center justify-center rounded-full border-2 border-transparent px-1 shadow-md"
                    >
                        {badge > 99 ? '99+' : badge}
                    </motion.div>
                )}

                {locked && (
                    <div className="absolute inset-0 bg-black/40 squircle flex items-center justify-center backdrop-blur-[2px]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock drop-shadow-md"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                    </div>
                )}
            </motion.button>
            <span className={cn(
                "font-['SF_Pro:Medium',sans-serif] font-[510] leading-[normal] text-[12px] text-center text-ellipsis text-shadow-[0px_2px_25px_black] text-white overflow-hidden shrink-0 mt-[5px]",
                disabled && "opacity-50"
            )} style={{ fontVariationSettings: "'wdth' 100" }}>
                {name}
            </span>
        </div>
    );
}
