"use client";

import { useEffect } from "react";
import { useMotionValue, useSpring, useMotionTemplate, motion } from "framer-motion";

export default function AmbientBackground() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring animation for fluid movement
    const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
    const smoothX = useSpring(mouseX, springConfig);
    const smoothY = useSpring(mouseY, springConfig);

    useEffect(() => {
        let frameId: number;
        
        const handleMouseMove = (e: MouseEvent) => {
            // Performance optimization: batch updates with requestAnimationFrame
            if (frameId) {
                cancelAnimationFrame(frameId);
            }
            
            frameId = requestAnimationFrame(() => {
                mouseX.set(e.clientX);
                mouseY.set(e.clientY);
            });
        };

        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            if (frameId) {
                cancelAnimationFrame(frameId);
            }
        };
    }, [mouseX, mouseY]);

    // specific gradient requested by user for the glow look
    // radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.06), transparent 40%)
    const glowGradient = useMotionTemplate`radial-gradient(600px circle at ${smoothX}px ${smoothY}px, rgba(255, 255, 255, 0.06), transparent 40%)`;

    // Mask for the grid - needs to be solid (black) in center to show grid fully
    const maskGradient = useMotionTemplate`radial-gradient(circle 300px at ${smoothX}px ${smoothY}px, black, transparent)`;

    return (
        <div className="fixed inset-0 z-0 overflow-hidden bg-lumina-dark pointer-events-none">

            {/* Ambient Orbs (Static Animation for performance) */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '7s' }} />

            {/* User Requested Glow Layer */}
            <motion.div
                className="absolute inset-0"
                style={{
                    background: glowGradient
                }}
            />
        </div>
    );
}
