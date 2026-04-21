'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import personalData from '@/data/personal.json';

const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
];

export default function Nav() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const scrollToSection = (href: string) => {
        setIsMenuOpen(false);
        if (href === '#contact') {
            // Contact is handled via modal — find and click the hero contact button
            const btn = document.getElementById('hero-contact-btn');
            if (btn) btn.click();
            return;
        }
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className="absolute top-8 right-8 z-50" aria-label="Main navigation">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
                {navLinks.map((link, index) => (
                    <motion.button
                        key={link.name}
                        onClick={() => scrollToSection(link.href)}
                        className="text-noir-muted hover:text-accent-orange transition-colors duration-300 text-sm font-medium"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        aria-label={`Navigate to ${link.name}`}
                    >
                        {link.name}
                    </motion.button>
                ))}

                {/* Resume Download */}
                <motion.a
                    href={personalData.resumeUrl}
                    download="Muhammad_Rohail_Ali_Resume.pdf"
                    className="flex items-center gap-1.5 text-xs font-semibold border border-accent-orange text-accent-orange rounded-lg px-4 py-2 hover:bg-accent-orange hover:text-black transition-all duration-300"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: navLinks.length * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    aria-label="Download resume PDF"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Resume
                </motion.a>
            </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="text-noir-text p-2"
                    aria-label="Toggle navigation menu"
                    aria-expanded={isMenuOpen}
                    aria-controls="mobile-nav-menu"
                >
                    <div className={`w-6 h-0.5 bg-accent-orange mb-1.5 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                    <div className={`w-6 h-0.5 bg-accent-orange mb-1.5 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
                    <div className={`w-6 h-0.5 bg-accent-orange transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                </button>

                {isMenuOpen && (
                    <motion.div
                        id="mobile-nav-menu"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-12 right-0 bg-noir-card border border-noir-border rounded-xl p-4 min-w-[200px] shadow-xl"
                    >
                        {navLinks.map(link => (
                            <button
                                key={link.name}
                                onClick={() => scrollToSection(link.href)}
                                className="block w-full text-left text-noir-muted hover:text-accent-orange transition-colors py-2.5 text-sm border-b border-noir-border last:border-0"
                            >
                                {link.name}
                            </button>
                        ))}
                        <a
                            href={personalData.resumeUrl}
                            download="Muhammad_Rohail_Ali_Resume.pdf"
                            className="flex items-center gap-2 mt-2 text-accent-orange text-sm font-semibold py-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download Resume
                        </a>
                    </motion.div>
                )}
            </div>
        </nav>
    );
}
