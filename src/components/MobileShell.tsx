import React, { useEffect, useState } from "react";
import { cn } from "../lib/utils";
import { Battery, Wifi, Signal } from "lucide-react";

interface MobileShellProps {
    children: React.ReactNode;
    className?: string;
}

// Fixed phone frame dimensions — all internal layout is designed for these
const PHONE_W = 390;
const PHONE_H = 844;

function useViewportScale() {
    const [scale, setScale] = useState(1);

    useEffect(() => {
        function compute() {
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            // Scale to fit width (with 4% margin) AND height (with 4% margin), take the smaller
            const scaleX = (vw * 0.96) / PHONE_W;
            const scaleY = (vh * 0.96) / PHONE_H;
            // Never scale above 1 (natural size) on large screens
            setScale(Math.min(scaleX, scaleY, 1));
        }

        compute();
        window.addEventListener("resize", compute);
        // Also fire on orientation change on mobile
        window.addEventListener("orientationchange", () => {
            setTimeout(compute, 200);
        });
        return () => {
            window.removeEventListener("resize", compute);
        };
    }, []);

    return scale;
}

export function MobileShell({ children, className }: MobileShellProps) {
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const scale = useViewportScale();

    return (
        <div className="flex items-center justify-center w-screen h-screen bg-neutral-900 overflow-hidden">
            {/*
              Outer wrapper is sized to the SCALED dimensions so it sits
              centred without taking up its pre-scale footprint.
            */}
            <div
                style={{
                    width: PHONE_W * scale,
                    height: PHONE_H * scale,
                    position: "relative",
                }}
            >
                {/*
                  Inner phone frame is always 390×844 but scaled down via
                  transform so all internal pixel values (padding, fonts, icons)
                  stay proportional and nothing gets cut off.
                */}
                <div
                    style={{
                        width: PHONE_W,
                        height: PHONE_H,
                        transform: `scale(${scale})`,
                        transformOrigin: "top left",
                        position: "absolute",
                        top: 0,
                        left: 0,
                    }}
                >
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
                            {/* Dynamic Island */}
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
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        >
                            {children}
                        </div>

                        {/* Home Indicator */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[140px] h-[5px] bg-white opacity-80 rounded-full z-50"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
