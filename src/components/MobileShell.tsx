import React from "react";
import { cn } from "../lib/utils";
import { Battery, Wifi, Signal } from "lucide-react";

interface MobileShellProps {
    children: React.ReactNode;
    className?: string;
}

export function MobileShell({ children, className }: MobileShellProps) {
    // Use a pseudo-current time for the status bar
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="flex items-center justify-center min-h-[100dvh] bg-neutral-900 w-full sm:p-4 md:p-8">
            {/* Mobile Device Container */}
            <div
                className={cn(
                    "relative w-full h-[100dvh] sm:h-[850px] sm:max-h-[90vh] sm:max-w-[400px] bg-black overflow-hidden",
                    "sm:rounded-[50px] sm:shadow-2xl sm:ring-8 sm:ring-neutral-800",
                    className
                )}
            >
                {/* iOS Status Bar */}
                <div className="absolute top-0 left-0 right-0 h-14 z-[150] flex items-center justify-between px-6 text-white text-[15px] font-semibold tracking-wide pointer-events-none">
                    <span>{time}</span>
                    {/* Dynamic Island / Notch simulated by empty space center */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-black rounded-full z-[150]"></div>

                    <div className="flex items-center gap-1.5 opacity-90">
                        <Signal size={16} strokeWidth={3} />
                        <Wifi size={16} strokeWidth={3} />
                        <Battery size={20} strokeWidth={2.5} />
                    </div>
                </div>

                {/* Content Area */}
                <div
                    className="relative w-full h-full pt-14 pb-8 z-10 sm:rounded-[50px] overflow-hidden"
                    style={{
                        backgroundImage: 'url("/assets/f4e8b98baf01df251fad69c06120eb2503116f35.png")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    {children}
                </div>

                {/* Home Indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[140px] h-[5px] bg-white opacity-80 rounded-full z-50"></div>
            </div>
        </div>
    );
}
