"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useTestimonials, Testimonial } from "../hooks/useApiData";

export default function TestimonialsSection() {
    const { t, language } = useLanguage();
    const isRtl = language === 'ar';
    const [activeIndex, setActiveIndex] = useState(0);
    
    // Fetch testimonials from API
    const { data: apiTestimonials, loading } = useTestimonials();
    
    // Fallback to translation data if API returns empty
    const fallbackTestimonials = t.testimonials.items;
    
    const testimonials = useMemo(() => {
        if (apiTestimonials.length > 0) {
            return apiTestimonials.map((item: Testimonial) => ({
                quote: isRtl && item.quoteAr ? item.quoteAr : item.quote,
                name: item.authorName,
                role: isRtl && item.authorRoleAr ? item.authorRoleAr : item.authorRole,
                company: item.authorCompany,
                image: item.authorImage,
                rating: item.rating,
            }));
        }
        return fallbackTestimonials;
    }, [apiTestimonials, isRtl, fallbackTestimonials]);

    // Auto-rotate testimonials
    useEffect(() => {
        if (testimonials.length === 0) return;
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % testimonials.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [testimonials.length]);

    // Loading skeleton
    if (loading) {
        return (
            <section className="py-20 relative z-content bg-transparent overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="h-10 bg-white/10 rounded-lg w-64 mx-auto mb-4 animate-pulse" />
                        <div className="h-6 bg-white/5 rounded w-96 mx-auto animate-pulse" />
                    </div>
                    <div className="max-w-4xl mx-auto">
                        <div className="p-10 rounded-3xl bg-lumina-panel/50 border border-purple-500/20">
                            <div className="h-6 bg-white/10 rounded w-full mb-4 animate-pulse" />
                            <div className="h-6 bg-white/5 rounded w-3/4 mb-8 animate-pulse" />
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-white/10 animate-pulse" />
                                <div>
                                    <div className="h-5 bg-white/10 rounded w-32 mb-2 animate-pulse" />
                                    <div className="h-4 bg-white/5 rounded w-24 animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (testimonials.length === 0) return null;

    return (
        <section className="py-20 relative z-content bg-transparent overflow-hidden">
            <div className="container mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className={`text-section text-white mb-4 ${isRtl ? 'font-arabic' : ''}`}>
                        {t.testimonials.heading}
                    </h2>
                    <p className="text-purple-300/60 text-lg max-w-2xl mx-auto">
                        {t.testimonials.subheading}
                    </p>
                </motion.div>

                {/* Main Testimonial Card */}
                <div className="max-w-4xl mx-auto mb-12 relative" dir={isRtl ? 'rtl' : 'ltr'}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeIndex}
                            initial={{ opacity: 0, x: 100, rotateY: 15 }}
                            animate={{ opacity: 1, x: 0, rotateY: 0 }}
                            exit={{ opacity: 0, x: -100, rotateY: -15 }}
                            transition={{ duration: 0.6, type: "spring" }}
                            className="relative p-10 md:p-12 rounded-3xl bg-gradient-to-br from-lumina-panel/80 to-lumina-panel/40 backdrop-blur-xl border border-purple-500/20 shadow-2xl shadow-purple-500/10"
                        >
                            {/* Quote Icon */}
                            <div className="absolute top-8 left-8 text-purple-500/20">
                                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                </svg>
                            </div>

                            {/* Rating Stars */}
                            <div className="flex gap-1 mb-6 justify-center md:justify-start">
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className="w-5 h-5 text-amber-400 fill-current"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                    </svg>
                                ))}
                            </div>

                            {/* Testimonial Text */}
                            <p className={`text-lg md:text-xl text-gray-200 mb-8 ${isRtl ? 'font-arabic leading-loose' : 'leading-relaxed'}`}>
                                "{testimonials[activeIndex].quote}"
                            </p>

                            {/* Author Info */}
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg sm:text-xl flex-shrink-0">
                                    {testimonials[activeIndex].name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className={`font-bold text-sm sm:text-base text-white ${isRtl ? 'font-arabic' : ''}`}>
                                        {testimonials[activeIndex].name}
                                    </h4>
                                    <p className={`text-xs sm:text-sm text-purple-300 ${isRtl ? 'font-arabic' : ''}`}>
                                        {testimonials[activeIndex].role} · {testimonials[activeIndex].company}
                                    </p>
                                </div>
                            </div>

                            {/* Decorative glow */}
                            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Arrows */}
                    <button
                        onClick={() => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                        className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-0 md:-right-16' : 'left-0 md:-left-16'} w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-all group`}
                        aria-label="Previous testimonial"
                    >
                        <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRtl ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
                        </svg>
                    </button>
                    <button
                        onClick={() => setActiveIndex((prev) => (prev + 1) % testimonials.length)}
                        className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'left-0 md:-left-16' : 'right-0 md:-right-16'} w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-all group`}
                        aria-label="Next testimonial"
                    >
                        <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRtl ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
                        </svg>
                    </button>
                </div>

                {/* Thumbnail Navigation */}
                <div className="flex justify-center gap-3">
                    {testimonials.map((_: any, index: number) => (
                        <button
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            className={`w-3 h-3 rounded-full transition-all ${
                                index === activeIndex
                                    ? "bg-purple-500 w-8"
                                    : "bg-white/20 hover:bg-white/40"
                            }`}
                            aria-label={`Go to testimonial ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
