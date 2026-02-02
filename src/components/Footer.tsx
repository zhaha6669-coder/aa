"use client";

import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
    const { t, language } = useLanguage();
    const isRtl = language === 'ar';

    return (
        <footer className="relative bg-[#050510] pt-12 sm:pt-16 lg:pt-20 pb-8 sm:pb-10 overflow-hidden z-content">
            <div className="container mx-auto px-4 sm:px-6">
                <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-12 sm:mb-14 lg:mb-16 ${isRtl ? 'text-right' : 'text-left'}`} dir={isRtl ? 'rtl' : 'ltr'}>
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold tracking-tighter text-white">
                            LUMINA<span className="text-[var(--neon-purple)]">.</span>
                        </h3>
                        <p className={`text-gray-300 ${isRtl ? 'leading-loose' : 'leading-relaxed'}`}>
                            {t.footer.tagline}
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-6">{t.footer.sections.company}</h4>
                        <ul className={`text-gray-300 ${isRtl ? 'space-y-4' : 'space-y-3'}`}>
                            <li><Link href="/about" className="hover:text-[var(--neon-cyan)] transition-colors">{t.footer.links.about}</Link></li>
                            <li><Link href="/#poll" className="hover:text-[var(--neon-cyan)] transition-colors">{t.footer.links.careers}</Link></li>
                            <li><Link href="/services" className="hover:text-[var(--neon-cyan)] transition-colors">{t.footer.links.insights}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-6">{t.footer.sections.services}</h4>
                        <ul className={`text-gray-300 ${isRtl ? 'space-y-4' : 'space-y-3'}`}>
                            <li><Link href="/services" className="hover:text-[var(--neon-purple)] transition-colors">{t.footer.links.web_dev}</Link></li>
                            <li><Link href="/services" className="hover:text-[var(--neon-purple)] transition-colors">{t.footer.links.mobile_apps}</Link></li>
                            <li><Link href="/services" className="hover:text-[var(--neon-purple)] transition-colors">{t.footer.links.ui_ux}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-6">{t.footer.sections.connect}</h4>
                        <ul className="space-y-3 text-gray-300">
                            <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Twitter / X</a></li>
                            <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a></li>
                            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a></li>
                        </ul>
                    </div>
                </div>

                <div className={`pt-8 flex flex-col md:flex-row justify-between items-center gap-4 ${isRtl ? 'md:flex-row-reverse' : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>
                    <p className="text-sm text-gray-400">
                        © {new Date().getFullYear()} {t.footer.copyright}
                    </p>
                    <div className="flex gap-6 text-sm text-gray-400">
                        <Link href="/about" className="hover:text-gray-300">{t.footer.links.privacy}</Link>
                        <Link href="/about" className="hover:text-gray-300">{t.footer.links.terms}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
