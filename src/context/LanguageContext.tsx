"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations } from '../data/translations';

type Language = 'en' | 'ar';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: typeof translations.en;
    dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('en');

    useEffect(() => {
        // Load saved language from localStorage (client-side only)
        if (typeof window !== 'undefined') {
            const savedLang = localStorage.getItem('language') as Language;
            if (savedLang && (savedLang === 'en' || savedLang === 'ar')) {
                setLanguage(savedLang);
            }
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            document.documentElement.lang = language;
            document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
        }
    }, [language]);

    const changeLanguage = (lang: Language) => {
        setLanguage(lang);
        if (typeof window !== 'undefined') {
            localStorage.setItem('language', lang);
        }
    };

    const t = translations[language];
    const dir = language === 'ar' ? 'rtl' : 'ltr';

    // Return the provider immediately. 
    // We handle document attribute updates in the useEffect above.
    return (
        <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t, dir }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
    return context;
};
