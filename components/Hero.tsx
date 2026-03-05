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

                        <motion.button
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsContactOpen(true)}
                            className="bg-accent-orange text-black font-semibold rounded-lg px-8 py-4 text-lg hover:shadow-glow-orange transition-all duration-300"
                            aria-label="Open contact form"
                        >
                            Get In touch
                        </motion.button>

                        {/* Tech Logos */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="flex gap-6 mt-12 flex-wrap"
                        >
                            {['Python', 'React', 'Next.js', 'TensorFlow', 'AWS'].map(tech => (
                                <div
                                    key={tech}
                                    className="px-3 py-1 bg-noir-card border border-noir-border rounded text-xs text-noir-muted"
                                >
                                    {tech}
                                </div>
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
                                alt="Muhammad Rohail Ali"
                                fill
                                className="object-cover grayscale"
                                priority
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
        </section>
    );
}
