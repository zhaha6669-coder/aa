"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "../context/LanguageContext";

const icons = {
    hexagon: (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l-9.53 5.5v11L12 22l9.53-5.5v-11L12 2z" />
            <circle cx="12" cy="12" r="3" className="fill-current opacity-20 stroke-none" />
        </svg>
    ),
    triangle: (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l10.39 18H1.61L12 3z" />
            <path d="M12 8l4 8H8l4-8z" className="fill-current opacity-20 stroke-none" />
        </svg>
    ),
    cube: (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
             <path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
             <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
             <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
    ),
    globe: (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
    ),
    zap: (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
    )
};

const colors = [
    "text-purple-400",
    "text-fuchsia-400",
    "text-indigo-400",
    "text-cyan-400",
    "text-amber-400"
];

const bgColors = [
    "bg-purple-500/10",
    "bg-fuchsia-500/10",
    "bg-indigo-500/10",
    "bg-cyan-500/10",
    "bg-amber-500/10"
];

export default function AboutValues() {
    const { t, language } = useLanguage();
    const isRtl = language === 'ar';
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <section className="relative py-24 z-10 overflow-hidden">
             {/* Background glow */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/20 blur-[120px] rounded-full -z-10" />

            <div className="container mx-auto px-6">
                <div className="flex flex-col items-center mb-16 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        {isRtl ? "قيمنا الجوهرية" : "Core Values"}
                    </h2>
                    <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" />
                </div>

                {/* Main Grid display */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16" dir={isRtl ? 'rtl' : 'ltr'}>
                    {t.about.values.map((item: any, index: number) => (
                        <motion.div
                            key={index}
                            onClick={() => setSelectedId(`${index}`)}
                            className="group relative p-8 h-full bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md overflow-hidden hover:bg-white/10 transition-all cursor-pointer"
                        >
                             <div className={`w-16 h-16 mb-6 rounded-2xl ${bgColors[index % bgColors.length]} flex items-center justify-center border border-white/5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                <div className={colors[index % colors.length]}>
                                     {icons[item.icon as keyof typeof icons] || icons.cube}
                                </div>
                            </div>
                            
                            <h3 className={`text-xl font-bold text-white mb-3 ${isRtl ? 'tracking-normal' : ''}`}>
                                {item.title}
                            </h3>
                            <p className={`text-gray-400 text-sm ${isRtl ? 'leading-loose' : 'leading-relaxed'}`}>
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom Navigation / Indicators (Interactive Boxes) */}
                <div className="flex flex-wrap justify-center gap-4" dir={isRtl ? 'rtl' : 'ltr'}>
                    {t.about.values.map((item: any, index: number) => (
                        <motion.button
                            key={index}
                            onClick={() => setSelectedId(`${index}`)}
                            className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 w-24 h-24 md:w-32 md:h-32
                                ${selectedId === `${index}` 
                                    ? 'bg-white/10 border-purple-500/50 scale-105 shadow-[0_0_20px_rgba(168,85,247,0.2)]' 
                                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                }`}
                        >
                            <div className={`w-8 h-8 md:w-10 md:h-10 mb-2 ${colors[index % colors.length]}`}>
                                {icons[item.icon as keyof typeof icons] || icons.cube}
                            </div>
                            <span className="text-[10px] md:text-xs text-gray-400 text-center font-medium line-clamp-1">
                                {item.title}
                            </span>
                        </motion.button>
                    ))}
                </div>

                {/* Dynamic Island Expansion (Modal) */}
                {mounted && createPortal(
                    <AnimatePresence>
                        {selectedId && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="modal-backdrop"
                                onClick={() => setSelectedId(null)}
                            >
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                    className="modal-content max-w-2xl bg-[#1a1025]"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <button 
                                        onClick={() => setSelectedId(null)}
                                        className={`modal-close-btn ${isRtl ? 'left-4 right-auto' : ''}`}
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>

                                    <div className="p-8 md:p-12">
                                         <div className={`w-20 h-20 mb-6 rounded-2xl ${bgColors[parseInt(selectedId) % bgColors.length]} flex items-center justify-center border border-white/5 shadow-lg`}>
                                            <div className={colors[parseInt(selectedId) % colors.length]}>
                                                {icons[t.about.values[parseInt(selectedId)].icon as keyof typeof icons] || icons.cube}
                                        </div>
                                    </div>

                                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                        {t.about.values[parseInt(selectedId)].title}
                                    </h3>
                                    
                                    <p className={`text-lg text-gray-300 mb-8 ${isRtl ? 'leading-loose' : 'leading-relaxed'}`}>
                                         {t.about.values[parseInt(selectedId)].details || t.about.values[parseInt(selectedId)].desc}
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-purple-300 border border-purple-500/20">
                                            {isRtl ? "ميزة حصرية" : "Exclusive Feature"}
                                        </span>
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-indigo-300 border border-indigo-500/20">
                                            {isRtl ? "تكنولوجيا متقدمة" : "Advanced Tech"}
                                        </span>
                                    </div>
                                </div>

                                {/* Decorative bottom gradient */}
                                <div className="h-2 w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500" />
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>,
                    document.body
                )}
            </div>
        </section>
    );
}
