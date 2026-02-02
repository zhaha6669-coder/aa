"use client";

import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useProjects, Project } from "../hooks/useApiData";

export default function PortfolioSection() {
    const { t, language } = useLanguage();
    const isRtl = language === 'ar';
    const [activeFilter, setActiveFilter] = useState("all");
    
    // Fetch projects from API
    const { data: apiProjects, loading } = useProjects();
    
    // Fallback to translation data if API returns empty
    const fallbackProjects = t.portfolio.projects.map((project: any, index: number) => ({
        id: `fallback-${index}`,
        title: project.title,
        titleAr: null,
        description: project.description,
        descriptionAr: null,
        category: project.category,
        technologies: project.tech || [],
        tech: project.tech || [],
        images: [`/projects/project-${index + 1}.jpg`],
        slug: `project-${index + 1}`,
        featured: false,
        status: 'published'
    }));

    const projects = useMemo(() => {
        if (apiProjects.length > 0) {
            return apiProjects.map((project: Project) => ({
                ...project,
                title: isRtl && project.titleAr ? project.titleAr : project.title,
                description: isRtl && project.descriptionAr ? project.descriptionAr : project.description,
                tech: project.technologies || [],
            }));
        }
        return fallbackProjects;
    }, [apiProjects, isRtl, fallbackProjects]);

    const categories = ["all", ...Array.from(new Set(projects.map((p: any) => p.category)))];

    const filteredProjects = activeFilter === "all" 
        ? projects 
        : projects.filter((p: any) => p.category === activeFilter);

    // Loading skeleton
    if (loading) {
        return (
            <section className="py-20 relative z-content bg-transparent overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <div className="h-10 bg-white/10 rounded-lg w-64 mx-auto mb-4 animate-pulse" />
                        <div className="h-6 bg-white/5 rounded w-96 mx-auto animate-pulse" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="rounded-2xl bg-lumina-panel/50 border border-white/[0.08] overflow-hidden">
                                <div className="h-64 bg-white/5 animate-pulse" />
                                <div className="p-6">
                                    <div className="h-6 bg-white/10 rounded w-3/4 mb-3 animate-pulse" />
                                    <div className="h-4 bg-white/5 rounded w-full mb-2 animate-pulse" />
                                    <div className="h-4 bg-white/5 rounded w-2/3 animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 relative z-content bg-transparent overflow-hidden">
            <div className="container mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className={`text-section text-white mb-4 ${isRtl ? 'font-arabic' : ''}`}>
                        {t.portfolio.heading}
                    </h2>
                    <p className="text-purple-300/60 text-lg max-w-2xl mx-auto">
                        {t.portfolio.subheading}
                    </p>
                </motion.div>

                {/* Filter Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="flex flex-wrap justify-center gap-3 mb-12"
                    dir={isRtl ? 'rtl' : 'ltr'}
                >
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveFilter(category)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                                activeFilter === category
                                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
                            }`}
                        >
                            {category === "all" ? t.portfolio.filter_all : category}
                        </button>
                    ))}
                </motion.div>

                {/* Projects Grid */}
                <motion.div 
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    dir={isRtl ? 'rtl' : 'ltr'}
                >
                    {filteredProjects.map((project: any, index: number) => (
                        <motion.div
                            layout
                            key={project.title}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="group relative rounded-2xl overflow-hidden bg-lumina-panel/50 backdrop-blur-sm border border-white/[0.08] hover:border-purple-500/40 transition-all cursor-pointer"
                        >
                            {/* Image Placeholder with Gradient */}
                            <div className="relative h-64 bg-gradient-to-br from-purple-600/20 via-indigo-600/20 to-cyan-600/20 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-lumina-dark via-transparent to-transparent opacity-60" />
                                
                                {/* Decorative Pattern */}
                                <div className="absolute inset-0 opacity-10">
                                    <svg className="w-full h-full" viewBox="0 0 100 100">
                                        <pattern id={`pattern-${index}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                            <circle cx="10" cy="10" r="1" fill="white" />
                                        </pattern>
                                        <rect width="100" height="100" fill={`url(#pattern-${index})`} />
                                    </svg>
                                </div>

                                {/* Hover Effect */}
                                <div className="absolute inset-0 bg-gradient-to-t from-purple-600/0 to-purple-600/0 group-hover:from-purple-600/20 group-hover:to-transparent transition-all duration-500" />
                                
                                {/* Category Tag */}
                                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-white">
                                    {project.category}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4 sm:p-5 lg:p-6">
                                <h3 className={`text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors ${isRtl ? 'font-arabic' : ''}`}>
                                    {project.title}
                                </h3>
                                <p className={`text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 ${isRtl ? 'font-arabic leading-loose' : 'leading-relaxed'}`}>
                                    {project.description}
                                </p>
                                
                                {/* Tech Stack */}
                                <div className="flex flex-wrap gap-2">
                                    {(project.tech || project.technologies || []).map((tech: string, i: number) => (
                                        <span
                                            key={i}
                                            className="px-2 py-1 rounded-md bg-purple-500/10 text-purple-300 text-xs border border-purple-500/20"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Hover Overlay - View Project */}
                            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-purple-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <motion.button
                                    initial={{ y: 20, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="px-6 py-3 bg-white text-purple-900 font-bold rounded-xl hover:bg-purple-100 transition-colors"
                                >
                                    {t.portfolio.view_project}
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
