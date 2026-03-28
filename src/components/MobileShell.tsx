import React from "react";
import { cn } from "../lib/utils";
import { Battery, Wifi, Signal } from "lucide-react";

interface MobileShellProps {
    children: React.ReactNode;
    className?: string;
}

export function MobileShell({ children, className }: MobileShellProps) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Fixed phone dimensions — content is always laid out at this size
    const PHONE_W = 390;
    const PHONE_H = 844;

    return (
        <div className="flex items-center justify-center w-screen h-screen bg-neutral-900 overflow-hidden">
            {/* Scale wrapper: shrinks the fixed-size phone frame to fit any viewport */}
            <div
                style={{
                    width: PHONE_W,
                    height: PHONE_H,
                    transform: `scale(min(min(calc(100vw / ${PHONE_W} * 0.92), calc(100vh / ${PHONE_H} * 0.95)), 1))`,
                    transformOrigin: 'center center',
                }}
            >
                {/* Phone frame — always the same physical size, scaled by parent */}
                <div
                    className={cn(
                        "relative bg-black overflow-hidden rounded-[50px] shadow-2xl ring-8 ring-neutral-800",
                        className
                    )}
                    style={{ width: PHONE_W, height: PHONE_H }}
                >
                    {/* iOS Status Bar */}
                    <div className="absolute top-0 left-0 right-0 h-14 z-[150] flex items-center justify-between px-6 text-white text-[15px] font-semibold tracking-wide pointer-events-none">
                        <span>{time}</span>
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-black rounded-full z-[150]"></div>
                        <div className="flex items-center gap-1.5 opacity-90">
                            <Signal size={16} strokeWidth={3} />
                            <Wifi size={16} strokeWidth={3} />
                            <Battery size={20} strokeWidth={2.5} />
                        </div>
                    </div>

                    {/* Content Area */}
                    <div
                        className="relative w-full h-full pt-14 pb-8 z-10 rounded-[50px] overflow-hidden"
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
        </div>
    );
}
