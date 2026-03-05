'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'Projects', href: '#projects' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
];

export default function Nav() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const scrollToSection = (href: string) => {
        setIsMenuOpen(false);
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
            </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="text-noir-text p-2"
                    aria-label="Toggle menu"
                    aria-expanded={isMenuOpen}
                >
                    <div className="w-6 h-0.5 bg-accent-orange mb-1.5"></div>
                    <div className="w-6 h-0.5 bg-accent-orange mb-1.5"></div>
                    <div className="w-6 h-0.5 bg-accent-orange"></div>
                </button>

                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-12 right-0 bg-noir-card border border-noir-border rounded-xl p-4 min-w-[200px]"
                    >
                        {navLinks.map(link => (
                            <button
                                key={link.name}
                                onClick={() => scrollToSection(link.href)}
                                className="block w-full text-left text-noir-muted hover:text-accent-orange transition-colors py-2 text-sm"
                            >
                                {link.name}
                            </button>
                        ))}
                    </motion.div>
                )}
            </div>
        </nav>
    );
}
