'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

type ProjectStatus = 'completed' | 'mvp' | 'in-progress' | 'needs-improvement';

interface ProjectCardProps {
    project: {
        id: string;
        title: string;
        category: string;
        thumbnail: string;
        isVideo: boolean;
        description: string;
        status?: ProjectStatus;
        course?: string | null;
    };
    index: number;
    onClick: () => void;
    adminMode?: boolean;
    onDelete?: () => void;
}

const STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string }> = {
    'completed':         { label: 'Live',            color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    'mvp':               { label: 'MVP',             color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    'in-progress':       { label: 'In Progress',     color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    'needs-improvement': { label: 'Early Stage',     color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
};

export default function ProjectCard({ project, index, onClick, adminMode, onDelete }: ProjectCardProps) {
    const statusCfg = project.status ? STATUS_CONFIG[project.status] : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.07, duration: 0.5 }}
            whileHover={{ scale: adminMode ? 1 : 1.02, transition: { duration: 0.2 } }}
            onClick={onClick}
            className="group relative bg-noir-card rounded-xl overflow-hidden cursor-pointer border border-noir-border hover:border-accent-orange/40 transition-all duration-300 h-full"
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && onClick()}
            aria-label={`View ${project.title} project details`}
        >
            {/* Thumbnail */}
            <div className="relative w-full h-full min-h-[200px]">
                <Image
                    src={project.thumbnail}
                    alt={`${project.title} — project screenshot`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+FDPQAJBwNk4P4fMAAAAABJRU5ErkJggg=="
                />

                {/* Dark gradient base — always visible for legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Top badges row */}
                <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
                    {/* Category */}
                    <span className="bg-noir-bg/80 backdrop-blur-sm text-accent-orange text-[10px] font-bold px-2.5 py-1 rounded tracking-wider uppercase">
                        {project.category}
                    </span>

                    {/* Status badge */}
                    {statusCfg && (
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded border backdrop-blur-sm tracking-wide uppercase ${statusCfg.color}`}>
                            {statusCfg.label}
                        </span>
                    )}
                </div>

                {/* Video badge */}
                {project.isVideo && (
                    <div className="absolute top-12 right-3 w-7 h-7 rounded-full bg-accent-orange flex items-center justify-center text-white text-xs" aria-label="Video project">
                        ▶
                    </div>
                )}

                {/* Bottom info — visible on hover */}
                {!adminMode && (
                    <div className="absolute bottom-0 inset-x-0 p-4 translate-y-1 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <h4 className="font-heading font-bold text-white text-sm mb-0.5 line-clamp-1">{project.title}</h4>
                        {project.course && (
                            <p className="text-[10px] text-noir-muted/80 line-clamp-1">{project.course}</p>
                        )}
                        <p className="text-accent-orange text-xs font-semibold mt-1">View details →</p>
                    </div>
                )}

                {/* Static title bottom — always show a bit */}
                {!adminMode && (
                    <div className="absolute bottom-3 left-3 right-3 group-hover:opacity-0 transition-opacity duration-200">
                        <h4 className="font-heading font-semibold text-white text-xs line-clamp-1 drop-shadow">{project.title}</h4>
                    </div>
                )}

                {/* Admin overlay */}
                {adminMode && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-4 text-center">
                        <h4 className="font-heading font-bold text-white text-sm">{project.title}</h4>
                    </div>
                )}
            </div>

            {/* Admin Delete Button */}
            {adminMode && onDelete && (
                <button
                    onClick={e => { e.stopPropagation(); onDelete(); }}
                    aria-label={`Delete ${project.title}`}
                    className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center text-lg leading-none font-bold shadow-lg transition-colors duration-200"
                >
                    ×
                </button>
            )}
        </motion.div>
    );
}
