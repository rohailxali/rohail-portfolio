'use client';

import { motion } from 'framer-motion';
import personalData from '@/data/personal.json';

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer id="contact" className="mt-24 py-12 border-t border-noir-border">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row items-center justify-between gap-8"
                >
                    {/* Left: Branding */}
                    <div>
                        <p className="font-heading font-bold text-white text-lg mb-1">{personalData.name}</p>
                        <p className="text-noir-muted text-sm">{personalData.role}</p>
                    </div>

                    {/* Center: Quick Links */}
                    <div className="flex items-center gap-6">
                        <a
                            href={`mailto:${personalData.emailFull}`}
                            className="text-noir-muted hover:text-accent-orange transition-colors text-sm"
                            aria-label="Send email"
                        >
                            {personalData.email}
                        </a>
                        <span className="text-noir-border">|</span>
                        <a
                            href={personalData.resumeUrl}
                            download="Muhammad_Rohail_Ali_Resume.pdf"
                            className="text-noir-muted hover:text-accent-orange transition-colors text-sm flex items-center gap-1"
                            aria-label="Download resume"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Resume
                        </a>
                    </div>

                    {/* Right: Social Links + Copyright */}
                    <div className="flex flex-col items-center md:items-end gap-3">
                        <div className="flex items-center gap-4">
                            <a
                                href={personalData.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-noir-muted hover:text-accent-orange transition-colors"
                                aria-label="LinkedIn profile"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                </svg>
                            </a>

                            <a
                                href={personalData.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-noir-muted hover:text-accent-orange transition-colors"
                                aria-label="GitHub profile"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                            </a>
                        </div>
                        <p className="text-noir-muted text-xs">© {year} {personalData.name}. All rights reserved.</p>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
}
