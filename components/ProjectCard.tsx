'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface ProjectCardProps {
    project: {
        id: string;
        title: string;
        category: string;
        thumbnail: string;
        isVideo: boolean;
        description: string;
    };
    index: number;
    onClick: () => void;
    adminMode?: boolean;
    onDelete?: () => void;
}

export default function ProjectCard({ project, index, onClick, adminMode, onDelete }: ProjectCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: adminMode ? 1 : 1.02 }}
            onClick={onClick}
            className="group relative bg-noir-card rounded-xl overflow-hidden cursor-pointer border border-noir-border hover:border-accent-orange-dim transition-all duration-300 row-span-1"
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && onClick()}
            aria-label={`View ${project.title} project details`}
        >
            {/* Thumbnail */}
            <div className="relative w-full h-full">
                <Image
                    src={project.thumbnail}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+FDPQAJBwNk4P4fMAAAAABJRU5ErkJggg=="
                />

                {/* Category Tag */}
                <div className="absolute top-3 left-3 bg-noir-bg/80 backdrop-blur-sm text-accent-orange text-xs font-semibold px-3 py-1 rounded">
                    {project.category}
                </div>

                {/* Video Badge */}
                {project.isVideo && (
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-accent-orange flex items-center justify-center text-white text-sm">
                        ▶
                    </div>
                )}

                {/* Overlay */}
                {!adminMode && (
                    <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center">
                        <h4 className="font-heading font-bold text-white text-xl mb-2">{project.title}</h4>
                        <p className="text-accent-orange text-sm font-semibold">View project →</p>
                    </div>
                )}

                {/* Admin overlay: show title always */}
                {adminMode && (
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-4 text-center">
                        <h4 className="font-heading font-bold text-white text-base">{project.title}</h4>
                    </div>
                )}
            </div>

            {/* Admin Delete Button */}
            {adminMode && onDelete && (
                <button
                    onClick={e => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    aria-label={`Delete ${project.title}`}
                    className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center text-lg leading-none font-bold shadow-lg transition-colors duration-200"
                >
                    ×
                </button>
            )}
        </motion.div>
    );
}
