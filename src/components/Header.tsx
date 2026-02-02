"use client";

import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Header() {
    const { t, language, setLanguage, dir } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-lumina-dark/95 py-3 sm:py-4 border-b border-white/[0.05] shadow-2xl backdrop-blur-md" : "py-4 sm:py-6 lg:py-8 bg-transparent"
                }`}
        >
            <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
                <Link href="/" className="text-xl sm:text-2xl font-bold tracking-tighter text-white">
                    LUMINA<span className="text-gray-400">.</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6 lg:gap-10">
                    <Link href="/services" className="text-sm font-medium text-gray-300 hover:text-white transition-colors tracking-wide">{t.header.work}</Link>
                    <Link href="/services" className="text-sm font-medium text-gray-300 hover:text-white transition-colors tracking-wide">{t.header.services}</Link>
                    <Link href="/about" className="text-sm font-medium text-gray-300 hover:text-white transition-colors tracking-wide">{t.header.about}</Link>
                    <Link href="/#poll" className="text-sm font-medium text-gray-300 hover:text-white transition-colors tracking-wide">{t.header.poll}</Link>
                    <Link href="/#poll" className="px-6 py-2 text-xs font-semibold text-white border border-white/20 rounded-full hover:bg-white/10 transition-all uppercase tracking-widest backdrop-blur-sm">
                        {t.header.contact}
                    </Link>

                    {/* Language Switcher */}
                    <div className="flex items-center bg-white/5 backdrop-blur-md rounded-full p-1 border border-white/10">
                        <button
                            onClick={() => setLanguage('en')}
                            aria-label="Switch to English"
                            className={`w-9 h-7 rounded-full text-[10px] font-bold transition-all flex items-center justify-center ${language === 'en'
                                ? 'bg-white text-black shadow-sm'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            EN
                        </button>
                        <button
                            onClick={() => setLanguage('ar')}
                            aria-label="Switch to Arabic"
                            className={`w-9 h-7 rounded-full text-[10px] font-bold transition-all flex items-center justify-center ${language === 'ar'
                                ? 'bg-white text-black shadow-sm'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            AR
                        </button>
                    </div>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 backdrop-blur-sm pointer-events-auto"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label={isOpen ? "Close menu" : "Open menu"}
                    aria-expanded={isOpen}
                >
                    <div className="w-5 flex flex-col items-end gap-1.5">
                        <span className={`w-full h-0.5 bg-white transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
                        <span className={`w-full h-0.5 bg-white transition-all ${isOpen ? 'opacity-0' : ''}`} />
                        <span className={`w-full h-0.5 bg-white transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                    </div>
                </button>

                {/* Mobile Menu Overlay */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -20 }}
                    style={{ pointerEvents: isOpen ? "auto" : "none" }}
                    className="absolute top-0 left-0 right-0 bg-[#0f0518]/95 backdrop-blur-xl border-b border-white/10 p-6 pt-28 md:hidden flex flex-col gap-6 shadow-2xl"
                >
                    <Link href="/services" onClick={() => setIsOpen(false)} className="text-lg font-medium text-gray-300 hover:text-white">{t.header.work}</Link>
                    <Link href="/services" onClick={() => setIsOpen(false)} className="text-lg font-medium text-gray-300 hover:text-white">{t.header.services}</Link>
                    <Link href="/about" onClick={() => setIsOpen(false)} className="text-lg font-medium text-gray-300 hover:text-white">{t.header.about}</Link>
                    <Link href="/#poll" onClick={() => setIsOpen(false)} className="text-lg font-medium text-gray-300 hover:text-white">{t.header.poll}</Link>
                    <Link href="/#poll" onClick={() => setIsOpen(false)} className="text-lg font-medium text-purple-400 hover:text-purple-300">{t.header.contact}</Link>

                    <div className="h-px bg-white/10 w-full" />

                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                        <button onClick={() => { setLanguage('en'); setIsOpen(false) }} className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${language === 'en' ? 'bg-white text-black shadow-sm' : 'text-gray-400'}`}>EN</button>
                        <button onClick={() => { setLanguage('ar'); setIsOpen(false) }} className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${language === 'ar' ? 'bg-white text-black shadow-sm' : 'text-gray-400'}`}>العربية</button>
                    </div>
                </motion.div>
            </div>
        </header>
    );
}
