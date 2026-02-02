"use client";

import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

export default function AboutHero() {
    const { t, language } = useLanguage();
    const isRtl = language === 'ar';

    return (
        <section className="relative w-full py-20 lg:py-32 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-16" dir={isRtl ? 'rtl' : 'ltr'}>
                    
                    {/* Text Content */}
                    <motion.div 
                        initial={{ opacity: 0, x: isRtl ? 50 : -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className={`w-full lg:w-1/2 ${isRtl ? 'text-right' : 'text-left'}`}
                    >
                        <div className="relative inline-block mb-6">
                            <h1 className={`text-5xl md:text-7xl font-bold text-white ${isRtl ? 'tracking-normal leading-tight font-cairo' : 'tracking-tighter'}`}>
                                {t.about.hero.title}
                            </h1>
                            <motion.div 
                                initial={{ width: 0 }}
                                whileInView={{ width: "60%" }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className={`absolute -bottom-2 ${isRtl ? 'right-0' : 'left-0'} h-1.5 bg-purple-600 rounded-full shadow-[0_0_15px_rgba(147,51,234,0.5)]`}
                            />
                        </div>

                        <p className={`text-lg md:text-xl text-gray-300 mb-8 max-w-2xl ${isRtl ? 'leading-loose' : 'leading-relaxed'}`}>
                           {t.about.hero.description}
                        </p>

                        <div className={`flex items-center gap-4 ${isRtl ? 'justify-start' : 'justify-start'}`}>
                            <div className="h-px w-12 bg-purple-500/50" />
                            <span className="text-sm font-medium text-purple-400 tracking-widest uppercase">
                                {t.about.hero.subtitle}
                            </span>
                        </div>
                    </motion.div>

                    {/* Visual Element */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="w-full lg:w-1/2 flex justify-center lg:justify-end relative"
                    >
                         {/* Abstract background elements for the graphic */}
                         <div className="section-glow w-[120%] h-[120%] bg-purple-900/10" />
                         
                         <div className="relative w-full max-w-[600px] h-[400px] bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-3xl backdrop-blur-sm overflow-hidden p-1 shadow-2xl group">
                            <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
                            
                            {/* Inner content simulating the 3D cube/network look */}
                            <div className="w-full h-full bg-[#0a0510] rounded-[20px] relative overflow-hidden">
                                {/* Terminal-like display */}
                                <div className="p-6 font-mono text-sm">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-3 h-3 rounded-full bg-red-500" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                        <div className="w-3 h-3 rounded-full bg-green-500" />
                                    </div>
                                    <div className="text-green-400 space-y-2">
                                        <p><span className="text-purple-400">const</span> lumina = {'{'}</p>
                                        <p className="ml-4">vision: <span className="text-amber-300">"Digital Excellence"</span>,</p>
                                        <p className="ml-4">mission: <span className="text-amber-300">"Transform Ideas"</span>,</p>
                                        <p className="ml-4">status: <span className="text-cyan-400">"Building..."</span></p>
                                        <p>{'}'};</p>
                                    </div>
                                </div>
                                
                                {/* Decorative lines - Keeping user's design aesthetic */}
                                <div className="absolute top-6 left-6 w-16 h-16 border-l-2 border-t-2 border-purple-500/50 rounded-tl-2xl pointer-events-none" />
                                <div className="absolute bottom-6 right-6 w-16 h-16 border-r-2 border-b-2 border-purple-500/50 rounded-br-2xl pointer-events-none" />
                            </div>
                         </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
