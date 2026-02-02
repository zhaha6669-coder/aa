"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "../context/LanguageContext";

interface ContactFormProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ContactForm({ isOpen, onClose }: ContactFormProps) {
    const { t, language } = useLanguage();
    const isRtl = language === 'ar';
    const [mounted, setMounted] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        projectType: "",
        budget: "",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage("");

        try {
            // Save to database first
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            let result;
            try {
                result = await response.json();
            } catch {
                throw new Error('حدث خطأ في الاتصال بالخادم');
            }

            if (!response.ok) {
                // Handle validation errors
                if (result.errors && Array.isArray(result.errors)) {
                    const messages = result.errors.map((err: any) => err.message).join('\n');
                    throw new Error(messages);
                }
                throw new Error(result.error || 'Failed to submit');
            }

            // Success - message saved to database
            setIsSubmitting(false);
            setSubmitStatus("success");

            // Reset form after 2 seconds
            setTimeout(() => {
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    projectType: "",
                    budget: "",
                    message: ""
                });
                setSubmitStatus("idle");
                onClose();
            }, 2000);

        } catch (error) {
            console.error('Error submitting form:', error);
            setIsSubmitting(false);
            setSubmitStatus("error");
            setErrorMessage(error instanceof Error ? error.message : 'حدث خطأ في إرسال الرسالة');
            
            // Reset error status after 5 seconds
            setTimeout(() => {
                setSubmitStatus("idle");
                setErrorMessage("");
            }, 5000);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-6"
                    >
                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", damping: 25 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-2xl bg-[#1a1625]/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-purple-500/30 shadow-2xl shadow-purple-500/20 max-h-[90vh] overflow-y-auto"
                            dir={isRtl ? "rtl" : "ltr"}
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className={`absolute top-4 sm:top-6 ${isRtl ? 'left-4 sm:left-6' : 'right-4 sm:right-6'} w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all z-10`}
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {/* Content */}
                            <div className="p-6 sm:p-8 md:p-10">
                                {/* Header */}
                                <div className="text-center mb-6 sm:mb-8">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: "spring" }}
                                        className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center"
                                    >
                                        <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </motion.div>
                                    <h2 className={`text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2 ${isRtl ? 'font-arabic' : ''}`}>
                                        {t.contact.heading}
                                    </h2>
                                    <p className="text-gray-400">
                                        {t.contact.subheading}
                                    </p>
                                </div>

                                {/* Success Message */}
                                <AnimatePresence>
                                    {submitStatus === "success" && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-center"
                                        >
                                            <svg className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-sm sm:text-base">{t.contact.success_message}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Error Message */}
                                <AnimatePresence>
                                    {submitStatus === "error" && errorMessage && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400"
                                            dir={isRtl ? 'rtl' : 'ltr'}
                                        >
                                            <div className="flex items-start gap-3">
                                                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <div className="text-sm whitespace-pre-line">{errorMessage}</div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Name & Email */}
                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div>
                                            <label className={`block text-sm font-medium text-gray-300 mb-2 ${isRtl ? 'font-arabic' : ''}`}>
                                                {t.contact.form.name} *
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className={`w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all ${isRtl ? 'font-arabic text-right' : ''}`}
                                                placeholder={t.contact.form.name_placeholder}
                                            />
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium text-gray-300 mb-2 ${isRtl ? 'font-arabic' : ''}`}>
                                                {t.contact.form.email} *
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                                placeholder={t.contact.form.email_placeholder}
                                            />
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className={`block text-sm font-medium text-gray-300 mb-2 ${isRtl ? 'font-arabic' : ''}`}>
                                            {t.contact.form.phone}
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all ${isRtl ? 'font-arabic text-right' : ''}`}
                                            placeholder={t.contact.form.phone_placeholder}
                                        />
                                    </div>

                                    {/* Project Type & Budget */}
                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div>
                                            <label className={`block text-sm font-medium text-gray-300 mb-2 ${isRtl ? 'font-arabic' : ''}`}>
                                                {t.contact.form.project_type} *
                                            </label>
                                            <select
                                                name="projectType"
                                                value={formData.projectType}
                                                onChange={handleChange}
                                                required
                                                className={`w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all ${isRtl ? 'font-arabic text-right' : ''}`}
                                            >
                                                <option value="" className="bg-lumina-dark">{t.contact.form.select_project}</option>
                                                <option value="web" className="bg-lumina-dark">{t.contact.form.web_dev}</option>
                                                <option value="mobile" className="bg-lumina-dark">{t.contact.form.mobile_app}</option>
                                                <option value="uiux" className="bg-lumina-dark">{t.contact.form.ui_ux}</option>
                                                <option value="other" className="bg-lumina-dark">{t.contact.form.other}</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium text-gray-300 mb-2 ${isRtl ? 'font-arabic' : ''}`}>
                                                {t.contact.form.budget}
                                            </label>
                                            <select
                                                name="budget"
                                                value={formData.budget}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all ${isRtl ? 'font-arabic text-right' : ''}`}
                                            >
                                                <option value="" className="bg-lumina-dark">{t.contact.form.select_budget}</option>
                                                <option value="<5k" className="bg-lumina-dark">&lt; $5,000</option>
                                                <option value="5k-10k" className="bg-lumina-dark">$5,000 - $10,000</option>
                                                <option value="10k-25k" className="bg-lumina-dark">$10,000 - $25,000</option>
                                                <option value="25k+" className="bg-lumina-dark">$25,000+</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label className={`block text-sm font-medium text-gray-300 mb-2 ${isRtl ? 'font-arabic' : ''}`}>
                                            {t.contact.form.message} *
                                        </label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={4}
                                            className={`w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none ${isRtl ? 'font-arabic text-right' : ''}`}
                                            placeholder={t.contact.form.message_placeholder}
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30 ${isRtl ? 'font-arabic' : ''}`}
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                {t.contact.form.sending}
                                            </span>
                                        ) : (
                                            t.contact.form.submit
                                        )}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
