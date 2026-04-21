'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';

type ProjectStatus = 'completed' | 'mvp' | 'in-progress' | 'needs-improvement';

type Project = {
    id: string;
    title: string;
    category: string;
    description: string;
    longDescription?: string;
    thumbnail: string;
    isVideo: boolean;
    tech: string[];
    demoUrl?: string | null;
    githubUrl?: string | null;
    gallery: string[];
    status?: ProjectStatus;
    course?: string | null;
    features?: string[];
    whatRemains?: string | null;
};

const FILTER_TABS = [
    { key: 'ALL',   label: 'All Projects' },
    { key: 'WEB',   label: 'Web & Apps' },
    { key: 'GAME',  label: 'Games' },
    { key: 'ML',    label: 'ML / AI' },
    { key: 'APP',   label: 'Tools' },
];

export default function Portfolio() {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [activeFilter, setActiveFilter] = useState('ALL');

    const fetchProjects = useCallback(async () => {
        try {
            const res = await fetch('/api/projects');
            if (res.ok) setProjects(await res.json());
        } catch { /* silently ignore */ }
    }, []);

    useEffect(() => { fetchProjects(); }, [fetchProjects]);

    const filtered = activeFilter === 'ALL'
        ? projects
        : projects.filter(p => {
            if (activeFilter === 'WEB') return p.category === 'WEB';
            if (activeFilter === 'GAME') return p.category === 'GAME';
            if (activeFilter === 'ML') return p.category === 'ML';
            if (activeFilter === 'APP') return p.category === 'APP';
            return true;
        });

    return (
        <>
            <section id="projects" className="min-h-screen" ref={ref}>
                {/* ── Header ─────────────────────────────────────────────────── */}
                <div className="flex items-center justify-between mb-6">
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        className="font-heading font-bold text-3xl text-white"
                    >
                        Portfolio
                    </motion.h3>

                    {/* Admin gear */}
                    <a
                        href="/admin"
                        id="admin-panel-link"
                        aria-label="Open admin panel"
                        title="Manage Projects (Admin)"
                        className="w-9 h-9 rounded-lg border border-noir-border bg-noir-card flex items-center justify-center text-noir-muted hover:border-accent-orange hover:text-accent-orange transition-all duration-200"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </a>
                </div>

                {/* ── Filter Tabs ─────────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.1 }}
                    className="flex gap-2 flex-wrap mb-6"
                    role="tablist"
                    aria-label="Filter projects by category"
                >
                    {FILTER_TABS.map(tab => (
                        <button
                            key={tab.key}
                            role="tab"
                            aria-selected={activeFilter === tab.key}
                            onClick={() => setActiveFilter(tab.key)}
                            className={`relative text-xs font-semibold px-3.5 py-1.5 rounded-lg border transition-all duration-200 ${
                                activeFilter === tab.key
                                    ? 'bg-accent-orange text-black border-accent-orange'
                                    : 'bg-noir-card border-noir-border text-noir-muted hover:border-accent-orange/50 hover:text-white'
                            }`}
                        >
                            {tab.label}
                            {/* Count badge */}
                            <span className={`ml-1.5 text-[10px] font-bold opacity-70`}>
                                {tab.key === 'ALL'
                                    ? projects.length
                                    : projects.filter(p =>
                                        tab.key === 'WEB' ? p.category === 'WEB' :
                                        tab.key === 'GAME' ? p.category === 'GAME' :
                                        tab.key === 'ML' ? p.category === 'ML' :
                                        p.category === 'APP'
                                    ).length
                                }
                            </span>
                        </button>
                    ))}
                </motion.div>

                {/* ── Legend ─────────────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.15 }}
                    className="flex flex-wrap items-center gap-3 mb-6 text-[10px] text-noir-muted"
                >
                    <span className="uppercase tracking-wider font-semibold">Status:</span>
                    {[
                        { color: 'bg-emerald-400', label: 'Live' },
                        { color: 'bg-blue-400', label: 'MVP' },
                        { color: 'bg-amber-400', label: 'In Progress' },
                        { color: 'bg-purple-400', label: 'Early Stage' },
                    ].map(s => (
                        <span key={s.label} className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${s.color}`} />
                            {s.label}
                        </span>
                    ))}
                </motion.div>

                {/* ── Grid ───────────────────────────────────────────────────── */}
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={activeFilter}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[200px]"
                    >
                        {filtered.map((project, index) => (
                            <div key={project.id} className="h-full">
                                <ProjectCard
                                    project={project}
                                    index={index}
                                    onClick={() => setSelectedProject(project)}
                                />
                            </div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                {filtered.length === 0 && (
                    <div className="flex items-center justify-center h-48 text-noir-muted text-sm">
                        No projects in this category yet.
                    </div>
                )}

                {projects.length === 0 && (
                    <div className="flex items-center justify-center h-64 text-noir-muted text-sm">
                        <p>No projects yet.{' '}
                            <a href="/admin" className="text-accent-orange hover:underline">Add one →</a>
                        </p>
                    </div>
                )}
            </section>

            <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        </>
    );
}
