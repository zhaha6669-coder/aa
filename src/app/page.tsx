"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Suspense, useState, useEffect } from "react";
import ServicesBento from "../components/ServicesBento";
import SimplePoll from "../components/SimplePoll";
import MouseFollower from "../components/MouseFollower";
import MagneticButton from "../components/MagneticButton";
import StatsSection from "../components/StatsSection";
import PortfolioSection from "../components/PortfolioSection";
import TestimonialsSection from "../components/TestimonialsSection";
import ContactForm from "../components/ContactForm";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { useLanguage } from "../context/LanguageContext";

// Lazy load CelestialBody with loading state
const CelestialBody = dynamic(() => import("../components/CelestialBody"), {
    loading: () => (
        <div className="h-[600px] flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-purple-500/10 animate-pulse" />
        </div>
    ),
    ssr: false,
});

export default function Home() {
    const { t, language } = useLanguage();
    const isRtl = language === 'ar';
    const [isContactFormOpen, setIsContactFormOpen] = useState(false);

    // Make openContactForm available globally for WhyLuminaIsland
    useEffect(() => {
        (window as any).openContactForm = () => setIsContactFormOpen(true);
        return () => {
            delete (window as any).openContactForm;
        };
    }, []);

    return (
        <div className="relative w-full overflow-x-hidden">
            <MouseFollower />

            {/* Hero Section */}
            <section className="relative z-10 isolate min-h-screen flex items-center justify-center pt-20 sm:pt-24 pb-12 overflow-hidden bg-transparent">
                <div className="container mx-auto px-4 sm:px-6 h-full">
                    <div className="flex flex-col-reverse lg:flex-row items-center justify-between h-full gap-8 sm:gap-12 lg:gap-0" dir={isRtl ? 'rtl' : 'ltr'}>

                        {/* Content Column */}
                        <div className={`w-full lg:w-1/2 flex flex-col justify-center space-y-6 sm:space-y-8 z-20 items-center text-center ${isRtl ? 'lg:items-end lg:text-right' : 'lg:items-start lg:text-left'}`}>

                            {/* Visual Badge */}
                            <motion.div
                                initial={{ opacity: 0, translateX: isRtl ? 20 : -20 }}
                                animate={{ opacity: 1, translateX: 0 }}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                className="inline-block px-4 py-1.5 rounded-full border border-white/5 bg-white/5 backdrop-blur-md"
                            >
                                <span className="text-xs font-medium tracking-[0.2em] text-indigo-300 uppercase">
                                    {t.hero.badge}
                                </span>
                            </motion.div>

                            {/* Main Heading */}
                            <h1
                                className={`text-hero text-white ${isRtl ? 'leading-[1.1] font-arabic' : ''}`}
                                style={{ direction: isRtl ? 'rtl' : 'ltr' }}
                            >
                                {t.hero.title_line1} <br />
                                {t.hero.title_line2} <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                                    {t.hero.title_highlight}
                                </span>
                            </h1>

                            <p
                                className={`text-lg md:text-xl text-indigo-200/50 max-w-lg leading-relaxed font-light ${isRtl ? 'text-center lg:text-right' : 'text-center lg:text-left'}`}
                            >
                                {t.hero.description}
                            </p>

                            {/* Buttons */}
                            <div
                                className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 mt-4 w-full sm:w-auto"
                                style={{ direction: isRtl ? 'rtl' : 'ltr' }}
                            >
                                <MagneticButton>
                                    <button onClick={() => setIsContactFormOpen(true)} className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-base sm:text-lg font-medium transition-all backdrop-blur-sm shadow-[0_0_20px_rgba(147,51,234,0.15)] hover:shadow-[0_0_30px_rgba(147,51,234,0.3)]">
                                        {t.hero.start_project}
                                    </button>
                                </MagneticButton>

                                <MagneticButton>
                                    <button className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 text-indigo-200/60 hover:text-white transition-colors font-medium">
                                        {t.hero.explore_work}
                                    </button>
                                </MagneticButton>
                            </div>
                        </div>

                        {/* Right Column: Globe (CelestialBody) */}
                        <div
                            className={`lg:w-1/2 h-[300px] sm:h-[400px] md:h-[500px] lg:h-[90vh] w-full relative flex items-center justify-center ${isRtl ? 'lg:-mr-20' : 'lg:-mr-20'}`}
                        >
                            {/* Gradient Glow behind the globe */}
                            <div className="section-glow w-[100%] h-[100%] bg-purple-600/10" />
                            <ErrorBoundary fallback={<div className="text-white/20">3D Unavailable</div>}>
                                <CelestialBody />
                            </ErrorBoundary>
                        </div>

                    </div>
                </div>
            </section>

            <StatsSection />
            <ServicesBento onOpenContact={() => setIsContactFormOpen(true)} />
            <PortfolioSection />
            <TestimonialsSection />
            <SimplePoll />
            
            <ContactForm isOpen={isContactFormOpen} onClose={() => setIsContactFormOpen(false)} />
        </div>
    );
}
