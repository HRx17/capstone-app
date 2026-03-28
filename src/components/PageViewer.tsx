import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { cn } from '../lib/utils';

interface PageViewerProps {
    pages: React.ReactNode[];
    className?: string;
    onPageChange?: (page: number) => void;
}

export function PageViewer({ pages, className, onPageChange }: PageViewerProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);

    const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, { offset, velocity }: any) => {
        const swipeThreshold = 50;
        const velocityThreshold = 500;

        // Swipe Left (Next Page)
        if (offset.x < -swipeThreshold || velocity.x < -velocityThreshold) {
            if (currentPage < pages.length - 1) {
                setCurrentPage(prev => prev + 1);
            }
        }
        // Swipe Right (Prev Page)
        else if (offset.x > swipeThreshold || velocity.x > velocityThreshold) {
            if (currentPage > 0) {
                setCurrentPage(prev => prev - 1);
            }
        }
    };

    // Animate to new page when state changes
    useEffect(() => {
        if (containerRef.current) {
            const width = containerRef.current.offsetWidth;
            animate(x, -currentPage * width, {
                type: 'spring',
                stiffness: 300,
                damping: 30,
                restDelta: 0.5
            });
            onPageChange?.(currentPage);
        }
    }, [currentPage, onPageChange]);

    return (
        <div className={cn("relative w-full h-full flex flex-col overflow-hidden", className)}>
            {/* Pages Track */}
            <motion.div
                ref={containerRef}
                className="flex flex-1 w-full shrink-0"
                style={{ x }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={handleDragEnd}
            >
                {pages.map((page, i) => (
                    <div key={i} className="min-w-full h-full shrink-0 flex flex-col pb-6">
                        {page}
                    </div>
                ))}
            </motion.div>

            {/* Pagination Indicators */}
            {pages.length > 1 && (
                <div className="absolute bottom-[0px] left-0 right-0 flex justify-center gap-2 pointer-events-none pb-2">
                    {pages.map((_, i) => (
                        <div
                            key={i}
                            className={cn(
                                "w-1.5 h-1.5 rounded-full transition-colors duration-300",
                                i === currentPage ? "bg-white" : "bg-white/40"
                            )}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
