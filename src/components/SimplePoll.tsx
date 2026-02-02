"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "../context/LanguageContext";

export default function SimplePoll() {
    const { t, language } = useLanguage();
    const isRtl = language === 'ar';
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeQuiz, setActiveQuiz] = useState<'business' | 'developer' | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const [result, setResult] = useState("");
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const openQuiz = (type: 'business' | 'developer') => {
        setActiveQuiz(type);
        setCurrentQuestion(0);
        setScore(0);
        setIsCompleted(false);
        setResult("");
        setSelectedAnswer(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setActiveQuiz(null);
    };

    const handleAnswer = (value: string) => {
        if (selectedAnswer) return;
        setSelectedAnswer(value);

        setTimeout(() => {
            let newScore = score;

            if (activeQuiz === 'business') {
                const points = value === 'C' ? 3 : (value === 'B' ? 2 : 1);
                newScore = score + points;
                const totalQ = t.poll.quiz.business.questions.length;

                if (currentQuestion + 1 < totalQ) {
                    setScore(newScore);
                    setCurrentQuestion(currentQuestion + 1);
                    setSelectedAnswer(null);
                } else {
                    const resultKey = newScore > 7 ? 'enterprise' : 'startup';
                    setScore(newScore);
                    setIsCompleted(true);
                    setResult(t.poll.quiz.business.results[resultKey]);
                }
            } else if (activeQuiz === 'developer') {
                let points = 0;
                if (currentQuestion === 0 && value === 'B') points = 1;
                if (currentQuestion === 1 && value === 'B') points = 1;
                if (currentQuestion === 2 && value === 'C') points = 1;

                newScore = score + points;
                const totalQ = t.poll.quiz.developer.questions.length;

                if (currentQuestion + 1 < totalQ) {
                    setScore(newScore);
                    setCurrentQuestion(currentQuestion + 1);
                    setSelectedAnswer(null);
                } else {
                    const resultKey = newScore >= 2 ? 'success' : 'fail';
                    setScore(newScore);
                    setIsCompleted(true);
                    setResult(t.poll.quiz.developer.results[resultKey]);
                }
            }
        }, 800);
    };

    const getCorrectAnswer = (qIndex: number) => {
        if (activeQuiz === 'developer') {
            if (qIndex === 0) return 'B';
            if (qIndex === 1) return 'B';
            if (qIndex === 2) return 'C';
        }
        return null;
    };

    const cards = [
        {
            id: 'business',
            title: isRtl ? 'بوابة الأعمال' : 'Business Gateway',
            desc: isRtl ? 'جاد بشأن النمو؟ دعنا نقيم إمكانات مشروعك.' : 'Serious about growth? Let us assess your project potential.',
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            color: 'amber',
            gradient: 'from-amber-500 to-orange-500',
            borderColor: 'border-amber-500/30',
            textColor: 'text-amber-400',
            bgGlow: 'bg-amber-500/20',
        },
        {
            id: 'developer',
            title: isRtl ? 'تحدي المطورين' : 'Developer Challenge',
            desc: isRtl ? 'تعتقد أنك تستطيع البرمجة؟ اختبر مهاراتك.' : 'Think you can code? Test your skills.',
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
            ),
            color: 'red',
            gradient: 'from-red-500 to-rose-600',
            borderColor: 'border-red-500/30',
            textColor: 'text-red-400',
            bgGlow: 'bg-red-500/20',
        },
    ];

    return (
        <>
            <section id="poll" className="py-20 relative z-content isolate bg-transparent">
                <div className="container mx-auto px-6">
                    
                    {/* Header */}
                    <div className="text-center mb-12">
                        <motion.h2
                            initial={{ opacity: 0, translateY: 20 }}
                            whileInView={{ opacity: 1, translateY: 0 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className={`text-section text-white mb-4 ${isRtl ? 'font-arabic' : ''}`}
                        >
                            {t.poll.title}
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, translateY: 20 }}
                            whileInView={{ opacity: 1, translateY: 0 }}
                            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="text-purple-300/60 text-lg"
                        >
                            {t.poll.subtitle}
                        </motion.p>
                    </div>

                    {/* Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto" dir={isRtl ? 'rtl' : 'ltr'}>
                        {cards.map((card, index) => (
                            <motion.div
                                key={card.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}

                                viewport={{ once: true }}
                                onClick={() => openQuiz(card.id as 'business' | 'developer')}
                                className={`relative p-8 rounded-2xl border ${card.borderColor} bg-lumina-panel/70 backdrop-blur-sm cursor-pointer group overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:bg-lumina-panel`}
                            >
                                {/* Glow Effect */}
                                <div className={`absolute inset-0 ${card.bgGlow} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
                                
                                <div className="relative z-10 flex flex-col items-center text-center">
                                    {/* Icon */}
                                    <div className={`w-20 h-20 rounded-2xl ${card.bgGlow} border ${card.borderColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        <span className={`text-3xl ${card.textColor}`}>
                                            {card.icon}
                                        </span>
                                    </div>

                                    {/* Text */}
                                    <h3 className={`text-2xl font-bold text-white mb-3 ${isRtl ? 'font-arabic' : ''}`}>
                                        {card.title}
                                    </h3>
                                    <p className="text-gray-400 mb-6 leading-relaxed">
                                        {card.desc}
                                    </p>

                                    {/* Button */}
                                    <button className={`px-6 py-2.5 rounded-full bg-gradient-to-r ${card.gradient} text-white font-bold text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-300`}>
                                        {isRtl ? 'ابدأ التحدي' : 'Start Challenge'}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Modal */}
            {mounted && createPortal(
                <AnimatePresence>
                    {isModalOpen && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="modal-backdrop"
                            onClick={closeModal}
                        >
                            {/* Modal Content */}
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className={`modal-content max-w-xl bg-[#12081f] ${
                                    activeQuiz === 'business' ? 'border-amber-500/40' : 'border-red-500/40'
                                }`}
                                onClick={(e) => e.stopPropagation()}
                            >
                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="modal-close-btn"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Glow */}
                        <div className={`absolute -top-32 -right-32 w-64 h-64 rounded-full blur-[100px] pointer-events-none ${
                            activeQuiz === 'business' ? 'bg-amber-500/30' : 'bg-red-500/30'
                        }`} />

                        {/* Content */}
                        <div className="relative p-6 md:p-8" dir={isRtl ? 'rtl' : 'ltr'}>
                            {!isCompleted ? (
                                <div className="pt-6">
                                    {/* Quiz Header */}
                                    <div className="flex items-center justify-between mb-6">
                                        <span className={`text-xs font-bold uppercase tracking-widest ${
                                            activeQuiz === 'business' ? 'text-amber-400' : 'text-red-400'
                                        }`}>
                                            {activeQuiz === 'developer' 
                                                ? t.poll.quiz.developer.intro.title 
                                                : t.poll.quiz.business.intro.title}
                                        </span>
                                        <span className={`text-sm ${activeQuiz === 'business' ? 'text-amber-400' : 'text-red-400'}`}>
                                            {currentQuestion + 1} / {activeQuiz === 'developer' 
                                                ? t.poll.quiz.developer.questions.length 
                                                : t.poll.quiz.business.questions.length}
                                        </span>
                                    </div>

                                    {/* Question */}
                                    <h3 className={`text-xl md:text-2xl font-bold text-white mb-6 leading-relaxed ${isRtl ? 'font-arabic' : ''} ${activeQuiz === 'developer' ? 'font-mono text-lg' : ''}`}>
                                        {activeQuiz === 'developer'
                                            ? t.poll.quiz.developer.questions[currentQuestion].question
                                            : t.poll.quiz.business.questions[currentQuestion].question}
                                    </h3>

                                    {/* Code Block for Developer */}
                                    {activeQuiz === 'developer' && (
                                        <div className="mb-6 p-4 bg-black/50 rounded-xl border border-red-500/20 overflow-x-auto">
                                            <code className="font-mono text-sm text-green-400 whitespace-pre">
                                                {t.poll.quiz.developer.questions[currentQuestion].code}
                                            </code>
                                        </div>
                                    )}

                                    {/* Options */}
                                    <div className="space-y-3">
                                        {(activeQuiz === 'developer'
                                            ? t.poll.quiz.developer.questions[currentQuestion].options
                                            : t.poll.quiz.business.questions[currentQuestion].options
                                        ).map((opt: any, idx: number) => {
                                            const isSelected = selectedAnswer === opt.value;
                                            const correctAnswer = getCorrectAnswer(currentQuestion);
                                            const isCorrect = correctAnswer === opt.value;

                                            let btnClass = "w-full p-4 rounded-xl border flex items-center transition-all duration-200 text-right";

                                            if (isSelected) {
                                                if (activeQuiz === 'developer') {
                                                    btnClass += isCorrect
                                                        ? " bg-green-500/20 border-green-500"
                                                        : " bg-red-500/20 border-red-500";
                                                } else {
                                                    btnClass += " bg-amber-500/20 border-amber-500";
                                                }
                                            } else if (selectedAnswer) {
                                                btnClass += " border-white/10 bg-white/5 opacity-40";
                                            } else {
                                                btnClass += " border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10";
                                            }

                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleAnswer(opt.value)}
                                                    disabled={selectedAnswer !== null}
                                                    className={btnClass}
                                                >
                                                    <span className={`w-8 h-8 rounded-full border flex items-center justify-center ml-3 text-sm font-bold ${
                                                        isSelected
                                                            ? (activeQuiz === 'developer'
                                                                ? (isCorrect ? 'border-green-400 text-green-400' : 'border-red-400 text-red-400')
                                                                : 'border-amber-400 text-amber-400')
                                                            : 'border-white/20 text-gray-500'
                                                    }`}>
                                                        {String.fromCharCode(65 + idx)}
                                                    </span>
                                                    <span className={`flex-1 ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                                                        {opt.text}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Progress */}
                                    <div className="mt-8 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${
                                                activeQuiz === 'business' ? 'bg-amber-500' : 'bg-red-500'
                                            }`}
                                            style={{
                                                width: `${((currentQuestion + 1) / (activeQuiz === 'developer'
                                                    ? t.poll.quiz.developer.questions.length
                                                    : t.poll.quiz.business.questions.length)) * 100}%`
                                            }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="py-10 text-center">
                                    {/* Result Icon */}
                                    <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center border-2 ${
                                        activeQuiz === 'business'
                                            ? 'bg-amber-500/20 border-amber-500'
                                            : 'bg-red-500/20 border-red-500'
                                    }`}>
                                        {activeQuiz === 'business' ? (
                                            <svg className="w-12 h-12 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-12 h-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        )}
                                    </div>

                                    <h3 className={`text-3xl font-bold text-white mb-4 ${isRtl ? 'font-arabic' : ''}`}>
                                        {isRtl ? "النتيجة" : "Result"}
                                    </h3>

                                    <p className={`text-lg text-gray-300 mb-8 max-w-sm mx-auto leading-relaxed ${isRtl ? 'font-arabic' : ''}`}>
                                        {result}
                                    </p>

                                    <button
                                        onClick={closeModal}
                                        className={`px-8 py-3 rounded-full text-white font-bold transition-all hover:scale-105 ${
                                            activeQuiz === 'business'
                                                ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                                                : 'bg-gradient-to-r from-red-500 to-rose-600'
                                        }`}
                                    >
                                        {isRtl ? "إغلاق" : "Close"}
                                    </button>
                                </div>
                            )}
                            </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}
