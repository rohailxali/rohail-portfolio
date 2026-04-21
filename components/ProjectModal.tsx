'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import Image from 'next/image';

type ProjectStatus = 'completed' | 'mvp' | 'in-progress' | 'needs-improvement';

interface ProjectModalProps {
    project: {
        id: string;
        title: string;
        category: string;
        description: string;
        longDescription?: string;
        tech: string[];
        demoUrl?: string | null;
        githubUrl?: string | null;
        gallery: string[];
        status?: ProjectStatus;
        course?: string | null;
        features?: string[];
        whatRemains?: string | null;
    } | null;
    onClose: () => void;
}

const STATUS_CONFIG: Record<ProjectStatus, { label: string; dot: string; badge: string }> = {
    'completed':         { label: 'Live & Deployed',   dot: 'bg-emerald-400', badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
    'mvp':               { label: 'MVP Complete',       dot: 'bg-blue-400',    badge: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
    'in-progress':       { label: 'In Progress',        dot: 'bg-amber-400 animate-pulse',   badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
    'needs-improvement': { label: 'Early Stage',        dot: 'bg-purple-400',  badge: 'bg-purple-500/15 text-purple-400 border-purple-500/30' },
};

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
    if (!project) return null;

    const statusCfg = project.status ? STATUS_CONFIG[project.status] : null;
    const description = project.longDescription || project.description;

    return (
        <Transition appear show={!!project} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
                    leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-3xl transform rounded-2xl glass-panel shadow-2xl transition-all relative overflow-hidden">
                                {/* Hero Image */}
                                {project.gallery[0] && (
                                    <div className="relative w-full h-52 md:h-64">
                                        <Image
                                            src={project.gallery[0]}
                                            alt={`${project.title} screenshot`}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, 768px"
                                            priority
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0b0b0b]" />

                                        {/* Close button */}
                                        <button
                                            onClick={onClose}
                                            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm text-white hover:text-accent-orange flex items-center justify-center text-xl transition-colors"
                                            aria-label="Close modal"
                                        >
                                            ×
                                        </button>
                                    </div>
                                )}

                                {/* Content */}
                                <motion.div
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="p-8"
                                >
                                    {/* Header row */}
                                    <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                                        <div className="flex flex-wrap items-center gap-2">
                                            {/* Category */}
                                            <span className="text-accent-orange text-xs font-bold tracking-widest uppercase">
                                                {project.category}
                                            </span>

                                            {/* Course */}
                                            {project.course && (
                                                <>
                                                    <span className="text-noir-muted/40 text-xs">•</span>
                                                    <span className="text-noir-muted text-xs">{project.course}</span>
                                                </>
                                            )}
                                        </div>

                                        {/* Status badge */}
                                        {statusCfg && (
                                            <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${statusCfg.badge}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                                                {statusCfg.label}
                                            </span>
                                        )}
                                    </div>

                                    <Dialog.Title className="font-heading font-bold text-2xl md:text-3xl text-white mb-3">
                                        {project.title}
                                    </Dialog.Title>

                                    <p className="text-noir-muted leading-relaxed mb-6 text-sm md:text-base">
                                        {description}
                                    </p>

                                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                                        {/* Tech Stack */}
                                        <div>
                                            <h4 className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
                                                <span className="w-4 h-px bg-accent-orange" />
                                                Tech Stack
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {project.tech.map(tech => (
                                                    <span
                                                        key={tech}
                                                        className="px-2.5 py-1 bg-noir-bg border border-noir-border rounded text-xs text-noir-muted hover:border-accent-orange/40 hover:text-accent-orange transition-colors"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Features */}
                                        {project.features && project.features.length > 0 && (
                                            <div>
                                                <h4 className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
                                                    <span className="w-4 h-px bg-accent-orange" />
                                                    Key Features
                                                </h4>
                                                <ul className="space-y-1.5">
                                                    {project.features.map((f, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-xs text-noir-muted">
                                                            <svg className="w-3.5 h-3.5 text-accent-orange flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                            {f}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>

                                    {/* What Remains */}
                                    {project.whatRemains && (
                                        <div className="mb-6 p-4 bg-noir-bg/60 border border-noir-border rounded-xl">
                                            <h4 className="font-semibold text-white text-sm mb-2 flex items-center gap-2">
                                                <svg className="w-4 h-4 text-accent-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                                What&apos;s Next
                                            </h4>
                                            <p className="text-noir-muted text-xs leading-relaxed">{project.whatRemains}</p>
                                        </div>
                                    )}

                                    {/* Links */}
                                    <div className="flex flex-wrap gap-3">
                                        {project.demoUrl && (
                                            <a
                                                href={project.demoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 bg-accent-orange text-black font-semibold rounded-lg px-5 py-2.5 text-sm hover:shadow-glow-orange transition-all"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                                Live Demo
                                            </a>
                                        )}
                                        {project.githubUrl && (
                                            <a
                                                href={project.githubUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 bg-noir-card text-white font-semibold rounded-lg px-5 py-2.5 text-sm border border-noir-border hover:border-accent-orange transition-all"
                                            >
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                                </svg>
                                                GitHub
                                            </a>
                                        )}
                                        {/* Fallback: no links */}
                                        {!project.demoUrl && !project.githubUrl && (
                                            <p className="text-noir-muted/50 text-xs italic">No public links available yet.</p>
                                        )}
                                    </div>
                                </motion.div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
