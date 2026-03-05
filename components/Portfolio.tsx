'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import AddProjectModal from './AddProjectModal';

type Project = {
    id: string;
    title: string;
    category: string;
    description: string;
    thumbnail: string;
    isVideo: boolean;
    tech: string[];
    demoUrl?: string;
    githubUrl?: string | null;
    gallery: string[];
};

export default function Portfolio() {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [adminMode, setAdminMode] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchProjects = useCallback(async () => {
        try {
            const res = await fetch('/api/projects');
            if (res.ok) {
                const data = await res.json();
                setProjects(data);
            }
        } catch {
            // Silently fail – existing data stays in place
        }
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        try {
            const res = await fetch(`/api/projects?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setProjects(prev => prev.filter(p => p.id !== id));
            }
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <>
            <section id="projects" className="min-h-screen" ref={ref}>
                {/* Header row */}
                <div className="flex items-center justify-between mb-8">
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        className="font-heading font-bold text-3xl text-white"
                    >
                        Portfolio
                    </motion.h3>

                    <div className="flex items-center gap-2">
                        {adminMode && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                onClick={() => setShowAddModal(true)}
                                id="add-project-btn"
                                className="flex items-center gap-1.5 bg-accent-orange text-black text-sm font-semibold px-4 py-2 rounded-lg hover:shadow-glow-orange transition-all duration-200"
                            >
                                <span className="text-base leading-none">+</span>
                                Add Project
                            </motion.button>
                        )}

                        <button
                            onClick={() => setAdminMode(m => !m)}
                            id="admin-toggle-btn"
                            aria-label={adminMode ? 'Exit admin mode' : 'Enter admin mode'}
                            title={adminMode ? 'Exit Admin Mode' : 'Admin Mode'}
                            className={`w-9 h-9 rounded-lg border flex items-center justify-center text-lg transition-all duration-200 ${adminMode
                                    ? 'bg-accent-orange border-accent-orange text-black'
                                    : 'bg-noir-card border-noir-border text-noir-muted hover:border-accent-orange hover:text-accent-orange'
                                }`}
                        >
                            {adminMode ? '🔓' : '🔒'}
                        </button>
                    </div>
                </div>

                {/* Admin mode hint */}
                {adminMode && (
                    <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-accent-orange mb-4 font-semibold tracking-wide uppercase"
                    >
                        Admin Mode — click ✕ to delete a project
                    </motion.p>
                )}

                {/* Masonry Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[200px]">
                    {projects.map((project, index) => (
                        <div
                            key={project.id}
                            className={`transition-opacity duration-200 ${deletingId === project.id ? 'opacity-40 pointer-events-none' : ''}`}
                        >
                            <ProjectCard
                                project={project}
                                index={index}
                                onClick={() => !adminMode && setSelectedProject(project)}
                                adminMode={adminMode}
                                onDelete={() => handleDelete(project.id)}
                            />
                        </div>
                    ))}
                </div>
            </section>

            <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />

            <AddProjectModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSuccess={fetchProjects}
            />
        </>
    );
}
