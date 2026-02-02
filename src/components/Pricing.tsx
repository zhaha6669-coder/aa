"use client";

import { motion } from "framer-motion";
import MagneticButton from "./MagneticButton";
import { useLanguage } from "../context/LanguageContext";

export default function Pricing() {
    const { t, language } = useLanguage();
    const isRtl = language === 'ar';

    const plans = [
        { ...t.pricing.plans.starter, id: 'starter', color: 'bg-blue-500' },
        { ...t.pricing.plans.pro, id: 'pro', color: 'bg-indigo-500' },
        { ...t.pricing.plans.enterprise, id: 'enterprise', color: 'bg-purple-500' },
    ];

    return (
        <section className="py-24 relative z-10 isolate">
             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-900/5 to-transparent pointer-events-none z-[-1]" />

            <div className="container mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <motion.h2 
                        initial={{ opacity: 0, translateY: 20 }}
                        whileInView={{ opacity: 1, translateY: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="text-3xl md:text-5xl font-bold text-white mb-6"
                    >
                        {t.pricing.heading}
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, translateY: 20 }}
                        whileInView={{ opacity: 1, translateY: 0 }}
                        transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="text-gray-400 text-lg"
                    >
                        {t.pricing.subheading}
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start" dir={isRtl ? 'rtl' : 'ltr'}>
                    {plans.map((plan, i) => {
                        const isPopular = plan.id === 'pro';
                        return (
                            <motion.div
                                key={plan.name}
                                whileInView={{ opacity: 1, translateY: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                className={`panel-base ${isPopular ? 'border-indigo-500 bg-indigo-900/10 shadow-[0_0_50px_rgba(79,70,229,0.15)] z-20' : 'border-white/10 bg-white/5'} hover:transform hover:scale-105 transition-all duration-300`}
                            >
                                {isPopular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full text-xs font-bold text-white uppercase tracking-wider shadow-lg">
                                        {t.pricing.plans.pro.popular}
                                    </div>
                                )}

                                <div className={`mb-8 ${isRtl ? 'text-right' : ''}`}>
                                    <h3 className="text-xl font-medium text-gray-300 mb-4">{plan.name}</h3>
                                    <div className="flex items-baseline gap-1" style={{ flexDirection: isRtl ? 'row-reverse' : 'row' }}>
                                        <span className="text-5xl font-bold text-white tracking-tight">{plan.price}</span>
                                        <span className="text-gray-500">{plan.period}</span>
                                    </div>
                                </div>

                                <div className="flex-1 mb-10">
                                    <ul className="space-y-4">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center gap-3 text-gray-400">
                                                <svg className={`w-5 h-5 flex-shrink-0 ${isPopular ? 'text-indigo-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className={isRtl ? 'text-right flex-1' : ''}>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <MagneticButton className="w-full">
                                    <button className={`w-full py-4 rounded-xl font-bold transition-all ${isPopular ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/25' : 'bg-white/10 hover:bg-white/15 text-white'}`}>
                                        {plan.cta}
                                    </button>
                                </MagneticButton>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}