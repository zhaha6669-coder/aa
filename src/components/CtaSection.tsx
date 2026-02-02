"use client";

import { motion } from "framer-motion";
import MagneticButton from "./MagneticButton";
import { useLanguage } from "../context/LanguageContext";

export default function CtaSection() {
    const { t, language } = useLanguage();

    return (
        <section className="py-32 relative z-content isolate overflow-hidden">
            {/* Background Effects */}
            <div className="section-glow w-[800px] h-[500px] bg-indigo-600/10" />
            
            <div className="container mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className={`text-4xl md:text-6xl font-bold text-white mb-6 ${language === 'ar' ? 'tracking-normal leading-tight' : 'tracking-tight'}`}>
                        {t.cta_section.heading}
                    </h2>
                    <p className={`text-xl text-gray-400 max-w-2xl mx-auto mb-12 ${language === 'ar' ? 'leading-relaxed' : ''}`}>
                        {t.cta_section.subheading}
                    </p>
                    
                    <MagneticButton>
                        <button className="px-12 py-5 rounded-full bg-white text-black font-bold text-lg hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all">
                            {t.cta_section.button}
                        </button>
                    </MagneticButton>
                </motion.div>
            </div>
        </section>
    );
}