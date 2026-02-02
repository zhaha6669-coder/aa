"use client";

import { motion, useSpring, useMotionValue } from "framer-motion";
import { useEffect, useState, useCallback, useRef } from "react";

export default function MouseFollower() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const frameIdRef = useRef<number>();

    const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
    const x = useSpring(mouseX, springConfig);
    const y = useSpring(mouseY, springConfig);

    useEffect(() => {
        // Detect touch device
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        setIsTouchDevice(isTouch);
        
        if (isTouch) return;

        // Performance optimization: use requestAnimationFrame
        const handleMouseMove = (e: MouseEvent) => {
            if (frameIdRef.current) {
                cancelAnimationFrame(frameIdRef.current);
            }
            
            frameIdRef.current = requestAnimationFrame(() => {
                mouseX.set(e.clientX - 200);
                mouseY.set(e.clientY - 200);
            });
        };

        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            if (frameIdRef.current) {
                cancelAnimationFrame(frameIdRef.current);
            }
        };
    }, [mouseX, mouseY]);

    // Don't render on touch devices
    if (isTouchDevice) return null;

    return (
        <motion.div
            style={{ x, y }}
            className="fixed top-0 left-0 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none z-0 mix-blend-screen"
        />
    );
}
