'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface ProjectModalProps {
    project: {
        id: string;
        title: string;
        category: string;
        description: string;
        tech: string[];
        demoUrl?: string;
        githubUrl?: string | null;
        gallery: string[];
    } | null;
    onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
    if (!project) return null;

    return (
        <Transition appear show={!!project} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-3xl transform rounded-2xl glass-panel p-8 shadow-xl transition-all">
                                {/* Close Button */}
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 text-noir-muted hover:text-accent-orange text-2xl"
                                    aria-label="Close modal"
                                >
                                    ×
                                </button>

                                {/* Content */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <div className="mb-4">
                                        <span className="text-accent-orange text-sm font-semibold">
                                            {project.category}
                                        </span>
                                    </div>

                                    <Dialog.Title className="font-heading font-bold text-3xl text-white mb-4">
                                        {project.title}
                                    </Dialog.Title>

                                    <p className="text-noir-muted leading-relaxed mb-6">{project.description}</p>

                                    {/* Tech Stack */}
                                    <div className="mb-6">
                                        <h4 className="font-semibold text-white mb-3">Tech Stack</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {project.tech.map(tech => (
                                                <span
                                                    key={tech}
                                                    className="px-3 py-1 bg-noir-card border border-noir-border rounded text-sm text-noir-muted"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Gallery */}
                                    <div className="mb-6">
                                        <h4 className="font-semibold text-white mb-3">Gallery</h4>
                                        <div className="grid grid-cols-1 gap-4">
                                            {project.gallery.map((img, idx) => (
                                                <div key={idx} className="relative w-full h-64 rounded-lg overflow-hidden">
                                                    <Image
                                                        src={img}
                                                        alt={`${project.title} gallery ${idx + 1}`}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Links */}
                                    <div className="flex gap-4">
                                        {project.demoUrl && (
                                            <a
                                                href={project.demoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-accent-orange text-black font-semibold rounded-lg px-6 py-3 hover:shadow-glow-orange transition-all"
                                            >
                                                Live Demo →
                                            </a>
                                        )}
                                        {project.githubUrl && (
                                            <a
                                                href={project.githubUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-noir-card text-white font-semibold rounded-lg px-6 py-3 border border-noir-border hover:border-accent-orange transition-all"
                                            >
                                                GitHub
                                            </a>
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
