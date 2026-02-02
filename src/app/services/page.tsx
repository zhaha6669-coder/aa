"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import MouseFollower from "../../components/MouseFollower";
import { useLanguage } from "../../context/LanguageContext";
import { SkeletonSection } from "../../components/Skeleton";

// Lazy load heavy components
const FeaturesGrid = dynamic(() => import("../../components/FeaturesGrid"), {
    loading: () => <SkeletonSection />,
});
const Pricing = dynamic(() => import("../../components/Pricing"), {
    loading: () => <SkeletonSection />,
});
const CtaSection = dynamic(() => import("../../components/CtaSection"), {
    loading: () => <div className="h-96 animate-pulse bg-white/5" />,
});

export default function ServicesPage() {
    const { t, language } = useLanguage();
    const isRtl = language === 'ar';

    return (
        <div className="relative w-full overflow-x-hidden bg-[#0f0518] min-h-screen pt-20">
            <MouseFollower />

            {/* Page Header */}
            <section className="relative z-content isolate py-20 overflow-hidden">
                <div className="container mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                         <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tighter">
                            {t.header.services}
                        </h1>
                        <p className="text-xl text-indigo-200/50 max-w-2xl mx-auto">
                            {isRtl 
                                ? "اكتشف كيف يمكننا مساعدتك في بناء مستقبلك الرقمي."
                                : "Discover how we can help you build your digital future."}
                        </p>
                    </motion.div>
                </div>
                
                {/* Background Gradient */}
                <div className="section-glow w-[60%] h-[60%] bg-purple-900/20" />
            </section>

            <FeaturesGrid />
            <Pricing />
            <CtaSection />
        </div>
    );
}
