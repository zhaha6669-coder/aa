"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useLanguage } from "../../context/LanguageContext";
import MouseFollower from "../../components/MouseFollower";
import { SkeletonSection } from "../../components/Skeleton";

// Lazy load heavy components
const AboutHero = dynamic(() => import("../../components/AboutHero"), {
    loading: () => <SkeletonSection />,
});
const AboutValues = dynamic(() => import("../../components/AboutValues"), {
    loading: () => <SkeletonSection />,
});
const AboutTeam = dynamic(() => import("../../components/AboutTeam"), {
    loading: () => <SkeletonSection />,
});
const CtaSection = dynamic(() => import("../../components/CtaSection"), {
    loading: () => <div className="h-96 animate-pulse bg-white/5" />,
});

export default function AboutPage() {
    const { t, language } = useLanguage();
    const isRtl = language === 'ar';

    return (
        <div className="relative w-full overflow-x-hidden bg-[#0f0518] min-h-screen pt-20">
            <MouseFollower />
            
            <AboutHero />
            <AboutValues />
            <AboutTeam />
            <CtaSection />
        </div>
    );
}
