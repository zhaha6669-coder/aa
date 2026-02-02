"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "../context/LanguageContext";

export default function FeaturesGrid() {
    const { t, language } = useLanguage();
    const isRtl = language === 'ar';
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const icons = [
        (
            <svg className="w-8 h-8 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
        ),
        (
            <svg className="w-8 h-8 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
        ),
        (
            <svg className="w-8 h-8 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
        ),
        (
            <svg className="w-8 h-8 text-pink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
        ),
        (
            <svg className="w-8 h-8 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
        ),
        (
            <svg className="w-8 h-8 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
        ),
    ];

    return (
        <section className="py-24 relative z-content isolate">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-blue-900/10 blur-[100px] rounded-full -z-10 pointer-events-none" />

            <div className="container mx-auto px-6 text-center">
                <motion.h2
                    initial={{ opacity: 0, translateY: 20 }}
                    whileInView={{ opacity: 1, translateY: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500 mb-6"
                >
                    {t.features_grid.heading}
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, translateY: 20 }}
                    whileInView={{ opacity: 1, translateY: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-gray-400 max-w-2xl mx-auto mb-16 text-lg"
                >
                    {t.features_grid.description}
                </motion.p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" dir={isRtl ? 'rtl' : 'ltr'}>
                    {t.features_grid.items.map((feature, i) => (
                        <motion.div
                            key={i}
                            onClick={() => setSelectedId(i)}
                            className="bg-[#0f0a1f]/80 backdrop-blur-md border border-white/5 p-8 rounded-2xl text-left hover:border-purple-500/30 transition-colors cursor-pointer group relative overflow-hidden"
                            whileHover={{ scale: 1.02 }}
                            initial={{ opacity: 0, translateY: 20 }}
                            whileInView={{ opacity: 1, translateY: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            viewport={{ once: true }}
                        >
                            <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                {icons[i]}
                            </div>
                            <h3 className={`text-xl font-semibold text-white mb-3 ${isRtl ? 'text-right tracking-normal' : ''}`}>
                                {feature.title}
                            </h3>
                            <p className={`text-gray-400 ${isRtl ? 'text-right leading-loose' : 'leading-relaxed'}`}>
                                {feature.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Dynamic Detail View (Modal/Overlay) - Using Portal */}
            {mounted && createPortal(
                <AnimatePresence>
                    {selectedId !== null && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="modal-backdrop"
                            onClick={() => setSelectedId(null)}
                        >
                            {/* Expanded Card */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className="modal-content max-w-2xl bg-[#1a102c] border-purple-500/20 p-8 md:p-12 shadow-purple-900/20"
                                dir={isRtl ? 'rtl' : 'ltr'}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Close Button */}
                                <button
                                    onClick={() => setSelectedId(null)}
                                    className={`modal-close-btn ${isRtl ? 'left-6 right-auto' : 'right-6'}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>

                                <div className="flex flex-col md:flex-row gap-8 items-start">
                                    <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0 text-indigo-400">
                                        <div className="scale-150">
                                             {icons[selectedId]}
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <h3 className={`text-3xl font-bold text-white mb-4 ${isRtl ? 'tracking-normal leading-tight' : ''}`}>
                                            {t.features_grid.items[selectedId].title}
                                        </h3>
                                        
                                        <p className={`text-lg text-indigo-200 mb-8 border-b border-white/10 pb-6 ${isRtl ? 'leading-loose' : ''}`}>
                                            {t.features_grid.items[selectedId].desc}
                                        </p>
                                        
                                        <div>
                                            <div className="flex items-center gap-3 mb-4 text-purple-400 font-bold tracking-wide uppercase text-sm">
                                                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                                                {isRtl ? "تفاصيل إضافية" : "Key Insight"}
                                            </div>
                                            
                                            <div className="flex flex-col gap-6">
                                                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                                     <span className="block text-4xl font-bold text-white mb-2">{t.features_grid.items[selectedId].stats}</span>
                                                     <span className="text-gray-400 text-sm">{isRtl ? "مؤشر الأداء الرئيسي" : "Performance Metric"}</span>
                                                </div>

                                                <p className={`text-gray-300 text-lg ${isRtl ? 'leading-loose' : 'leading-relaxed'}`}>
                                                    {t.features_grid.items[selectedId].extended_desc}
                                                </p>
                                            </div>

                                            <div className="mt-8 flex justify-end">
                                                <button 
                                                    onClick={() => setSelectedId(null)}
                                                    className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                                                >
                                                    {isRtl ? "إغلاق والتراجع" : "Close & Return"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </section>
    );
}