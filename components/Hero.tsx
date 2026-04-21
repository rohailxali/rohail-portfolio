'use client';

import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import ContactModal from './ContactModal';
import personalData from '@/data/personal.json';

export default function Hero() {
    const [isContactOpen, setIsContactOpen] = useState(false);
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 300], [0, 50]);

    const techStack = ['Python', 'React', 'Next.js', 'FastAPI', 'LangChain', 'TensorFlow', 'Docker', 'AWS'];

    return (
        <section id="home" className="relative min-h-[80vh] flex items-center pt-20">
            {/* Parallax Background */}
            <motion.div
                style={{ y }}
                className="absolute inset-0 bg-gradient-to-br from-noir-bg via-noir-panel to-noir-bg opacity-50 -z-10"
            />

            <div className="relative z-10 w-full">
                <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
                    {/* Left: Headline */}
                    <div className="flex-1">
                        <motion.h1
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="font-heading font-extrabold leading-[0.9] tracking-tighter text-hero text-white mb-6"
                        >
                            {personalData.name}
                        </motion.h1>

                        <motion.h2
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="font-heading font-bold text-hero-sub text-noir-muted mb-8"
                        >
                            {personalData.role}
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-lg text-noir-muted mb-10 max-w-2xl"
                        >
                            {personalData.tagline}
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="flex flex-wrap gap-4 mb-12"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsContactOpen(true)}
                                className="bg-accent-orange text-black font-semibold rounded-lg px-8 py-4 text-lg hover:shadow-glow-orange transition-all duration-300"
                                aria-label="Open contact form"
                                id="hero-contact-btn"
                            >
                                Get In Touch
                            </motion.button>

                            <motion.a
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                href={personalData.resumeUrl}
                                download="Muhammad_Rohail_Ali_Resume.pdf"
                                className="flex items-center gap-2 bg-noir-card border border-noir-border text-white font-semibold rounded-lg px-8 py-4 text-lg hover:border-accent-orange transition-all duration-300"
                                aria-label="Download resume"
                                id="hero-resume-btn"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Resume
                            </motion.a>
                        </motion.div>

                        {/* Tech Stack Tags */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="flex gap-3 flex-wrap"
                            aria-label="Technology stack"
                        >
                            {techStack.map((tech, i) => (
                                <motion.div
                                    key={tech}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 1 + i * 0.05 }}
                                    className="px-3 py-1 bg-noir-card border border-noir-border rounded text-xs text-noir-muted hover:border-accent-orange hover:text-accent-orange transition-all duration-200 cursor-default"
                                >
                                    {tech}
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Right: Circular Headshot */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="relative w-64 h-64 lg:w-80 lg:h-80 flex-shrink-0"
                    >
                        <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-accent-orange shadow-glow-orange">
                            <Image
                                src="/assets/headshot.png"
                                alt="Muhammad Rohail Ali — Data Scientist & Full-Stack Developer"
                                fill
                                className="object-cover"
                                priority
                                sizes="(max-width: 768px) 256px, 320px"
                            />
                        </div>
                        {/* Decorative ring */}
                        <div className="absolute inset-[-8px] rounded-full border border-accent-orange-dim animate-pulse pointer-events-none" />
                    </motion.div>
                </div>
            </div>

            <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
        </section>
    );
}
