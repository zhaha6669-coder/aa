"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import MagneticButton from "./MagneticButton";
import WhyLuminaIsland from "./WhyLuminaIsland";
import { useLanguage } from "../context/LanguageContext";
import { useServices, Service } from "../hooks/useApiData";

interface ServicesBentoProps {
    onOpenContact?: () => void;
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const item = {
    hidden: { opacity: 0, y: 30, scale: 0.8, filter: "blur(10px)" },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        transition: { duration: 0.8, type: "spring", bounce: 0.4 }
    },
};

// Icon mapping for services
const serviceIcons: Record<string, React.ReactNode> = {
    '🚀': <svg className="w-16 h-16 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
    '💻': <svg className="w-16 h-16 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
    '📱': <svg className="w-16 h-16 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
    '🎨': <svg className="w-16 h-16 text-fuchsia-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>,
    '⚡': <svg className="w-16 h-16 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    '🔧': <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    '🌐': <svg className="w-16 h-16 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
    '📊': <svg className="w-16 h-16 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    '🛡️': <svg className="w-16 h-16 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
    '🎯': <svg className="w-16 h-16 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    'default': <svg className="w-16 h-16 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
};

export default function ServicesBento({ onOpenContact }: ServicesBentoProps = {}) {
    const { t, language } = useLanguage();
    const isRtl = language === 'ar';
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    
    // Fetch services from API
    const { data: apiServices, loading } = useServices();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Fallback services from translations
    const fallbackServices = [
        {
            id: 'web',
            title: t.services_bento.items.web.title,
            description: t.services_bento.items.web.desc,
            details: t.services_bento.items.web.details,
            icon: serviceIcons['💻'],
        },
        {
            id: 'design',
            title: t.services_bento.items.design.title,
            description: t.services_bento.items.design.desc,
            details: t.services_bento.items.design.details,
            icon: serviceIcons['🎨'],
        },
        {
            id: 'mobile',
            title: t.services_bento.items.mobile.title,
            description: t.services_bento.items.mobile.desc,
            details: t.services_bento.items.mobile.details,
            icon: serviceIcons['📱'],
        },
        {
            id: 'cloud',
            title: t.services_bento.items.cloud.title,
            description: t.services_bento.items.cloud.desc,
            details: t.services_bento.items.cloud.details,
            icon: serviceIcons['default'],
        },
    ];

    // Use API data if available, otherwise fallback
    const services = useMemo(() => {
        if (apiServices.length > 0) {
            return apiServices.map((service: Service) => ({
                id: service.slug || service.id,
                title: isRtl && service.titleAr ? service.titleAr : service.title,
                description: isRtl && service.shortDescAr ? service.shortDescAr : service.shortDescription,
                details: isRtl && service.featuresAr?.length > 0 ? service.featuresAr : service.features,
                icon: serviceIcons[service.icon || ''] || serviceIcons['default'],
            }));
        }
        return fallbackServices;
    }, [apiServices, isRtl, t]);

    return (
        <section className="py-12 sm:py-16 lg:py-20 relative z-content isolate bg-transparent">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 lg:gap-20 items-center" dir={isRtl ? 'rtl' : 'ltr'}>

                    {/* Left Column (or Right in RTL): Text & Buttons */}
                    <div className={`lg:w-1/3 ${isRtl ? 'text-right' : 'text-left'}`}>
                        <motion.h2
                            initial={{ opacity: 0, translateX: isRtl ? 20 : -20 }}
                            whileInView={{ opacity: 1, translateX: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className={`text-section text-white mb-6 drop-shadow-lg ${isRtl ? 'tracking-normal leading-tight' : ''}`}
                        >
                            {t.services_bento.heading}
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, translateX: isRtl ? 20 : -20 }}
                            whileInView={{ opacity: 1, translateX: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className={`text-indigo-200/60 text-lg mb-10 font-light ${isRtl ? 'leading-loose' : 'leading-relaxed'}`}
                        >
                            {t.services_bento.description}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, translateY: 20 }}
                            whileInView={{ opacity: 1, translateY: 0 }}
                            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="flex flex-wrap gap-4"
                        >
                            <MagneticButton>
                                <button onClick={onOpenContact} className="px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)]">
                                    {t.services_bento.explore_work}
                                </button>
                            </MagneticButton>

                            <WhyLuminaIsland />
                        </motion.div>
                    </div>

                    {/* Right Column (or Left in RTL): Service Cards */}
                    <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {services.map((service) => (
                            <motion.div
                                key={service.id}
                                onClick={() => setSelectedId(service.id)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        setSelectedId(service.id);
                                    }
                                }}
                                role="button"
                                tabIndex={0}
                                aria-label={`View details for ${service.title}`}
                                variants={item}
                                whileHover={{ translateY: -5 }}
                                className="group relative p-5 sm:p-6 rounded-xl sm:rounded-2xl border border-white/[0.08] bg-lumina-panel/80 backdrop-blur-sm overflow-hidden text-center hover:border-purple-500/40 hover:bg-lumina-panel transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/50 shadow-lg hover:shadow-2xl"
                            >
                                <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <motion.div className="relative z-10 flex flex-col items-center gap-3 sm:gap-4">
                                    <div className="p-2.5 sm:p-3 bg-white/5 rounded-lg sm:rounded-xl border border-white/10 group-hover:border-purple-500/30 group-hover:bg-purple-500/10 transition-colors">
                                        {service.icon}
                                    </div>

                                    <div>
                                        <h3 className={`text-base sm:text-lg font-bold text-white mb-1 ${isRtl ? 'tracking-normal' : ''}`}>
                                            {service.title}
                                        </h3>
                                        <p className={`text-xs text-gray-400 line-clamp-2 ${isRtl ? 'leading-relaxed' : ''}`}>
                                            {service.description}
                                        </p>
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>

            {/* Modal Overlay */}
            {mounted && createPortal(
                <AnimatePresence>
                    {selectedId !== null && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setSelectedId(null)}
                            className="modal-backdrop"
                        >
                            {services.filter(s => s.id === selectedId).map(service => (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                    key={service.id}
                                    className="modal-content bg-[#140b20]"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                <div className="p-8">
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-500" />

                                <div className="flex flex-col items-center text-center">
                                    <motion.div className="w-24 h-24 mb-6 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(147,51,234,0.15)]">
                                        {service.icon}
                                    </motion.div>

                                    <motion.h3 className="text-3xl font-bold text-white mb-2">
                                        {service.title}
                                    </motion.h3>

                                    <motion.p className="text-gray-400 mb-8">
                                        {service.description}
                                    </motion.p>

                                    <div className="grid grid-cols-2 gap-3 w-full mb-8">
                                        {service.details?.map((detail, i) => (
                                            <div key={i} className="bg-white/5 rounded-lg p-3 text-sm text-indigo-200/80 border border-white/5">
                                                {detail}
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setSelectedId(null)}
                                        className="px-6 py-2 rounded-full bg-white text-black font-bold text-sm tracking-wide hover:scale-105 transition-transform"
                                    >
                                        {isRtl ? 'إغلاق' : 'CLOSE'}
                                    </button>
                                </div>
                                </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </section>
    );
}