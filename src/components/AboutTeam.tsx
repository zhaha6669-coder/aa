"use client";

import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { useTeamMembers, TeamMember } from "../hooks/useApiData";
import { useMemo } from "react";

export default function AboutTeam() {
    const { t, language } = useLanguage();
    const isRtl = language === 'ar';
    
    // Fetch team members from API
    const { data: apiMembers, loading } = useTeamMembers();
    
    // Fallback to translation data if API returns empty
    const fallbackMembers = t.about.team.members;
    
    const members = useMemo(() => {
        if (apiMembers.length > 0) {
            return apiMembers.map((member: TeamMember) => ({
                name: isRtl && member.nameAr ? member.nameAr : member.name,
                role: isRtl && member.roleAr ? member.roleAr : member.role,
                bio: isRtl && member.bioAr ? member.bioAr : member.bio,
                image: member.image,
                linkedin: member.linkedin,
                twitter: member.twitter,
                github: member.github,
            }));
        }
        return fallbackMembers;
    }, [apiMembers, isRtl, fallbackMembers]);

    // Loading skeleton
    if (loading) {
        return (
            <section className="relative py-24 overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="mb-16">
                        <div className="h-10 bg-white/10 rounded-lg w-64 mb-4 animate-pulse" />
                        <div className="w-20 h-1 bg-purple-600 rounded-full" />
                    </div>
                    <div className="flex flex-wrap justify-center gap-10">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex flex-col items-center">
                                <div className="w-32 h-32 rounded-full bg-white/10 mb-6 animate-pulse" />
                                <div className="h-5 bg-white/10 rounded w-24 mb-2 animate-pulse" />
                                <div className="h-4 bg-white/5 rounded w-20 animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="relative py-24 overflow-hidden">
             {/* Background glow for team section */}
             <div className="absolute bottom-0 w-full h-[500px] bg-gradient-to-t from-purple-900/10 to-transparent pointer-events-none" />

            <div className="container mx-auto px-6">
                <div className={`mb-16 ${isRtl ? 'text-right' : 'text-left'}`} dir={isRtl ? 'rtl' : 'ltr'}>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className={`text-3xl md:text-5xl font-bold text-white mb-4 ${isRtl ? 'tracking-normal leading-tight' : ''}`}
                    >
                        {t.about.team.title}
                    </motion.h2>
                    <div className="w-20 h-1 bg-purple-600 rounded-full" />
                </div>

                <div 
                    className="flex flex-wrap justify-center gap-10" 
                    dir={isRtl ? 'rtl' : 'ltr'}
                >
                    {members.map((member: any, index: number) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                            className="flex flex-col items-center group cursor-pointer"
                        >
                            <div className="relative w-32 h-32 mb-6 rounded-full p-1 bg-gradient-to-br from-purple-500 via-fuchsia-500 to-indigo-500">
                                <div className="w-full h-full rounded-full bg-[#0a0510] overflow-hidden relative">
                                    {/* Member Image or Placeholder */}
                                    {member.image ? (
                                        <img 
                                            src={member.image} 
                                            alt={member.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500">
                                            <svg className="w-16 h-16 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                    
                                    {/* Hover Overlay with Social Links */}
                                    <div className="absolute inset-0 bg-purple-500/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                        {member.linkedin && (
                                            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-white hover:scale-110 transition-transform">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                                            </a>
                                        )}
                                        {member.twitter && (
                                            <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="text-white hover:scale-110 transition-transform">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                                            </a>
                                        )}
                                        {member.github && (
                                            <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-white hover:scale-110 transition-transform">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <h3 className={`text-white font-bold text-lg mb-1 group-hover:text-purple-400 transition-colors ${isRtl ? 'tracking-normal' : ''}`}>
                                {member.name}
                            </h3>
                            
                            <span className={`text-gray-500 text-xs font-medium ${isRtl ? 'tracking-normal' : 'uppercase tracking-wider'}`}>
                                {member.role}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
