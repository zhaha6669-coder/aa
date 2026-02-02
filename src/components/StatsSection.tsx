"use client";

import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, { duration: 2500, bounce: 0 });
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        if (isInView) {
            motionValue.set(value);
        }
    }, [motionValue, isInView, value]);

    useEffect(() => {
        springValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = Math.floor(latest).toLocaleString() + suffix;
            }
        });
    }, [springValue, suffix]);

    return <span ref={ref}>0{suffix}</span>;
}

interface StatsData {
    projects_completed: number;
    happy_clients: number;
    satisfaction_rate: number;
    years_experience: number;
}

export default function StatsSection() {
    const { t, language } = useLanguage();
    const isRtl = language === 'ar';
    const [statsData, setStatsData] = useState<StatsData>({
        projects_completed: 50,
        happy_clients: 30,
        satisfaction_rate: 98,
        years_experience: 5
    });
    const [loading, setLoading] = useState(true);

    // Fetch stats from API
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/stats');
                const result = await res.json();
                if (result.success) {
                    setStatsData(result.data);
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const stats = [
        { 
            value: statsData.projects_completed, 
            suffix: "+", 
            label: t.stats.projects_completed,
            icon: (
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            gradient: "from-emerald-500 to-teal-500"
        },
        { 
            value: statsData.happy_clients, 
            suffix: "+", 
            label: t.stats.happy_clients,
            icon: (
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            gradient: "from-purple-500 to-fuchsia-500"
        },
        { 
            value: statsData.satisfaction_rate, 
            suffix: "%", 
            label: t.stats.satisfaction_rate,
            icon: (
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
            ),
            gradient: "from-amber-500 to-orange-500"
        },
        { 
            value: statsData.years_experience, 
            suffix: "+", 
            label: t.stats.years_experience,
            icon: (
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            gradient: "from-cyan-500 to-blue-500"
        },
    ];

    return (
        <section className="py-12 sm:py-16 lg:py-20 relative z-content bg-transparent overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-8 sm:mb-12 lg:mb-16"
                >
                    <h2 className={`text-section text-white mb-3 sm:mb-4 ${isRtl ? 'font-arabic' : ''}`}>
                        {t.stats.heading}
                    </h2>
                    <p className="text-purple-300/60 text-base sm:text-lg max-w-2xl mx-auto px-4">
                        {t.stats.subheading}
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6" dir={isRtl ? 'rtl' : 'ltr'}>
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30, scale: 0.9 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="group relative p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl bg-lumina-panel/50 backdrop-blur-sm border border-white/[0.08] hover:border-purple-500/30 transition-all overflow-hidden"
                        >
                            {/* Gradient Glow */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500`} />
                            
                            {/* Content */}
                            <div className="relative z-10 flex flex-col items-center text-center gap-2 sm:gap-3 lg:gap-4">
                                <div className={`text-purple-400 group-hover:scale-110 transition-transform duration-300 scale-75 sm:scale-90 lg:scale-100`}>
                                    {stat.icon}
                                </div>
                                <div className={`text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                                    <Counter value={stat.value} suffix={stat.suffix} />
                                </div>
                                <p className={`text-xs sm:text-sm lg:text-base text-gray-300 font-medium ${isRtl ? 'font-arabic' : ''}`}>
                                    {stat.label}
                                </p>
                            </div>

                            {/* Floating particles effect */}
                            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                                <motion.div
                                    animate={{
                                        y: [0, -10, 0],
                                        opacity: [0.1, 0.3, 0.1]
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        delay: index * 0.2
                                    }}
                                    className={`absolute top-1/4 left-1/4 w-20 h-20 bg-gradient-to-r ${stat.gradient} rounded-full blur-2xl opacity-20`}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
