'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';

interface AddProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CATEGORIES = ['MOCKUP', 'BRANDING', 'VIDEO', 'LOGO', 'WEB', 'APP', 'OTHER'];

const defaultForm = {
    title: '',
    category: 'MOCKUP',
    description: '',
    thumbnail: '',
    isVideo: false,
    tech: '',
    demoUrl: '',
    githubUrl: '',
};

export default function AddProjectModal({ isOpen, onClose, onSuccess }: AddProjectModalProps) {
    const [form, setForm] = useState(defaultForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    githubUrl: form.githubUrl || null,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to add project');
            }

            setForm(defaultForm);
            onSuccess();
            onClose();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        'w-full bg-noir-card border border-noir-border rounded-lg px-4 py-2.5 text-white placeholder-noir-muted focus:outline-none focus:border-accent-orange transition-colors duration-200 text-sm';
    const labelClass = 'block text-xs font-semibold text-noir-muted uppercase tracking-wider mb-1.5';

    return (
        <Transition appear show={isOpen} as={Fragment}>
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
                            <Dialog.Panel className="w-full max-w-lg transform rounded-2xl glass-panel p-8 shadow-xl transition-all relative">
                                {/* Close Button */}
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 text-noir-muted hover:text-accent-orange text-2xl leading-none"
                                    aria-label="Close modal"
                                >
                                    ×
                                </button>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <div className="mb-1">
                                        <span className="text-accent-orange text-xs font-semibold tracking-widest uppercase">
                                            Admin
                                        </span>
                                    </div>
                                    <Dialog.Title className="font-heading font-bold text-2xl text-white mb-6">
                                        Add New Project
                                    </Dialog.Title>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        {/* Title */}
                                        <div>
                                            <label className={labelClass}>Title *</label>
                                            <input
                                                id="add-project-title"
                                                type="text"
                                                required
                                                value={form.title}
                                                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                                className={inputClass}
                                                placeholder="My Awesome Project"
                                            />
                                        </div>

                                        {/* Category */}
                                        <div>
                                            <label className={labelClass}>Category *</label>
                                            <select
                                                id="add-project-category"
                                                value={form.category}
                                                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                                className={inputClass}
                                            >
                                                {CATEGORIES.map(c => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <label className={labelClass}>Description *</label>
                                            <textarea
                                                id="add-project-description"
                                                required
                                                rows={3}
                                                value={form.description}
                                                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                                className={`${inputClass} resize-none`}
                                                placeholder="Brief description of the project..."
                                            />
                                        </div>

                                        {/* Thumbnail URL */}
                                        <div>
                                            <label className={labelClass}>Thumbnail URL</label>
                                            <input
                                                id="add-project-thumbnail"
                                                type="text"
                                                value={form.thumbnail}
                                                onChange={e => setForm(f => ({ ...f, thumbnail: e.target.value }))}
                                                className={inputClass}
                                                placeholder="/assets/projects/my-image.jpg"
                                            />
                                        </div>

                                        {/* Tech Stack */}
                                        <div>
                                            <label className={labelClass}>Tech Stack (comma-separated)</label>
                                            <input
                                                id="add-project-tech"
                                                type="text"
                                                value={form.tech}
                                                onChange={e => setForm(f => ({ ...f, tech: e.target.value }))}
                                                className={inputClass}
                                                placeholder="React, Node.js, PostgreSQL"
                                            />
                                        </div>

                                        {/* URLs Row */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className={labelClass}>Demo URL</label>
                                                <input
                                                    id="add-project-demo"
                                                    type="text"
                                                    value={form.demoUrl}
                                                    onChange={e => setForm(f => ({ ...f, demoUrl: e.target.value }))}
                                                    className={inputClass}
                                                    placeholder="https://..."
                                                />
                                            </div>
                                            <div>
                                                <label className={labelClass}>GitHub URL</label>
                                                <input
                                                    id="add-project-github"
                                                    type="text"
                                                    value={form.githubUrl}
                                                    onChange={e => setForm(f => ({ ...f, githubUrl: e.target.value }))}
                                                    className={inputClass}
                                                    placeholder="https://github.com/..."
                                                />
                                            </div>
                                        </div>

                                        {/* Is Video */}
                                        <div className="flex items-center gap-3">
                                            <input
                                                id="add-project-isvideo"
                                                type="checkbox"
                                                checked={form.isVideo}
                                                onChange={e => setForm(f => ({ ...f, isVideo: e.target.checked }))}
                                                className="w-4 h-4 accent-orange-500 rounded"
                                            />
                                            <label htmlFor="add-project-isvideo" className="text-sm text-noir-muted cursor-pointer">
                                                This project contains a video
                                            </label>
                                        </div>

                                        {/* Error */}
                                        {error && (
                                            <p className="text-red-400 text-sm">{error}</p>
                                        )}

                                        {/* Submit */}
                                        <div className="flex gap-3 pt-2">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                id="add-project-submit"
                                                className="flex-1 bg-accent-orange text-black font-semibold rounded-lg px-6 py-3 hover:shadow-glow-orange transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {loading ? 'Saving…' : 'Save Project'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={onClose}
                                                className="flex-1 bg-noir-card text-white font-semibold rounded-lg px-6 py-3 border border-noir-border hover:border-accent-orange transition-all"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
