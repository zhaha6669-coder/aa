"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";

// Extend window type for openContactForm
declare global {
    interface Window {
        openContactForm?: () => void;
    }
}

export default function WhyLuminaIsland() {
    const { t, language } = useLanguage();
    const isRtl = language === 'ar';
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative inline-block" ref={containerRef}>
            <motion.div
                layout
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`relative z-50 overflow-hidden ${isOpen 
                    ? "fixed inset-x-4 top-[20%] md:absolute md:inset-auto md:top-auto md:bottom-0 md:left-1/2 md:-translate-x-1/2 rounded-3xl bg-[#1a1625]/95 backdrop-blur-xl border border-purple-500/30 shadow-[0_0_50px_rgba(147,51,234,0.3)]" 
                    : "rounded-xl border border-white/10 bg-transparent hover:border-purple-500/50 hover:bg-purple-500/10"
                }`}
                style={{
                    width: isOpen ? "min(600px, 90vw)" : "auto",
                    height: isOpen ? "auto" : "auto",
                    originX: 0.5,
                    originY: 1
                }}
            >
                <div role="button" onClick={() => !isOpen && setIsOpen(true)} className={`${isOpen ? 'cursor-default' : 'cursor-pointer'}`}>
                    <AnimatePresence mode="popLayout">
                        {!isOpen ? (
                            <motion.button
                                layoutId="island-trigger"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="px-8 py-3 text-white font-medium whitespace-nowrap w-full h-full"
                            >
                                {t.services_bento.why_us}
                            </motion.button>
                        ) : (
                            <motion.div
                                layoutId="island-content"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="p-8 md:p-10 flex flex-col gap-6 text-center"
                                dir={isRtl ? "rtl" : "ltr"}
                            >
                                {/* Close Button */}
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                                    className={`absolute top-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors ${isRtl ? 'left-4' : 'right-4'}`}
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                                <div className="space-y-3 sm:space-y-4">
                                    <h3 className={`text-xl sm:text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 ${isRtl ? 'font-arabic' : ''} leading-tight`}>
                                        {t.services_bento.why_lumina_card.headline_1} <br/>{t.services_bento.why_lumina_card.headline_2}
                                    </h3>
                                    
                                    <p className={`text-gray-300 leading-loose text-sm sm:text-base ${isRtl ? 'font-arabic' : ''}`}>
                                        {t.services_bento.why_lumina_card.body}
                                    </p>
                                </div>

                                <div className="pt-2">
                                    <button onClick={() => { setIsOpen(false); if (window.openContactForm) window.openContactForm(); }} className={`w-full py-3 sm:py-3.5 px-5 sm:px-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm sm:text-base font-bold shadow-lg shadow-purple-500/25 transition-all transform hover:scale-[1.02] ${isRtl ? 'font-arabic' : ''}`}>
                                        {t.services_bento.why_lumina_card.cta}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
            
            {/* Backdrop for mobile to help focusing */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
