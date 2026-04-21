'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// ─── Types ───────────────────────────────────────────────────────────────────

type Project = {
    id: string;
    title: string;
    category: string;
    description: string;
    thumbnail: string;
    isVideo: boolean;
    tech: string[];
    demoUrl: string | null;
    githubUrl: string | null;
    gallery: string[];
};

type Toast = { id: string; message: string; type: 'success' | 'error' };

const CATEGORIES = ['WEB', 'APP', 'MOCKUP', 'BRANDING', 'VIDEO', 'LOGO', 'OTHER'];

const emptyForm = {
    title: '',
    category: 'WEB',
    description: '',
    thumbnail: '',
    isVideo: false,
    tech: '',
    demoUrl: '',
    githubUrl: '',
};

// ─── Admin Page ───────────────────────────────────────────────────────────────

export default function AdminPage() {
    const [authed, setAuthed] = useState(false);
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');
    const [adminSecret, setAdminSecret] = useState('');

    // Projects state
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Image upload state
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [previewUrl, setPreviewUrl] = useState('');
    const [cloudinaryConfigured, setCloudinaryConfigured] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Toast state
    const [toasts, setToasts] = useState<Toast[]>([]);

    // ── Auth ──────────────────────────────────────────────────────────────────

    useEffect(() => {
        const saved = sessionStorage.getItem('admin_secret');
        if (saved) {
            setAdminSecret(saved);
            setAuthed(true);
        }
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // We verify against the API — if it returns 401, password is wrong
        setAdminSecret(password);
        sessionStorage.setItem('admin_secret', password);
        setAuthed(true);
        setAuthError('');
    };

    const handleLogout = () => {
        sessionStorage.removeItem('admin_secret');
        setAuthed(false);
        setPassword('');
        setAdminSecret('');
    };

    // ── Toasts ────────────────────────────────────────────────────────────────

    const addToast = useCallback((message: string, type: 'success' | 'error') => {
        const id = `toast-${Date.now()}`;
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    }, []);

    // ── Data ──────────────────────────────────────────────────────────────────

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/projects');
            if (res.ok) {
                const data = await res.json();
                setProjects(data);
            } else if (res.status === 401) {
                setAuthed(false);
                setAuthError('Session expired. Please log in again.');
            }
        } catch {
            addToast('Failed to load projects', 'error');
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    useEffect(() => {
        if (authed) fetchProjects();
    }, [authed, fetchProjects]);

    // ── Image Upload ──────────────────────────────────────────────────────────

    const handleFileSelect = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            addToast('Please select an image file', 'error');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            addToast('Image must be under 5MB', 'error');
            return;
        }

        // Local preview immediately
        const reader = new FileReader();
        reader.onload = e => setPreviewUrl(e.target?.result as string);
        reader.readAsDataURL(file);

        // Upload to server
        setUploading(true);
        setUploadProgress(30);

        try {
            const uploadForm = new FormData();
            uploadForm.append('file', file);

            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'x-admin-secret': adminSecret },
                body: uploadForm,
            });

            setUploadProgress(80);
            const data = await res.json();

            if (!res.ok) {
                if (res.status === 503) {
                    setCloudinaryConfigured(false);
                    addToast('Cloudinary not configured — using local preview URL', 'error');
                } else {
                    addToast(data.error || 'Upload failed', 'error');
                }
                return;
            }

            setForm(f => ({ ...f, thumbnail: data.url }));
            setPreviewUrl(data.url);
            setUploadProgress(100);
            addToast('Image uploaded successfully', 'success');
        } catch {
            addToast('Upload failed — check your connection', 'error');
        } finally {
            setUploading(false);
            setTimeout(() => setUploadProgress(0), 800);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) handleFileSelect(file);
    };

    // ── Form ──────────────────────────────────────────────────────────────────

    const openAddForm = () => {
        setEditingProject(null);
        setForm(emptyForm);
        setPreviewUrl('');
        setFormErrors({});
        setShowForm(true);
    };

    const openEditForm = (project: Project) => {
        setEditingProject(project);
        setForm({
            title: project.title,
            category: project.category,
            description: project.description,
            thumbnail: project.thumbnail,
            isVideo: project.isVideo,
            tech: project.tech.join(', '),
            demoUrl: project.demoUrl || '',
            githubUrl: project.githubUrl || '',
        });
        setPreviewUrl(project.thumbnail);
        setFormErrors({});
        setShowForm(true);
    };

    const validateForm = (): boolean => {
        const errs: Record<string, string> = {};
        if (!form.title.trim()) errs.title = 'Title is required';
        if (form.title.length > 100) errs.title = 'Title must be under 100 characters';
        if (!form.description.trim()) errs.description = 'Description is required';
        if (form.description.length < 10) errs.description = 'Description must be at least 10 characters';
        if (form.demoUrl && !isValidUrl(form.demoUrl)) errs.demoUrl = 'Must be a valid URL';
        if (form.githubUrl && !isValidUrl(form.githubUrl)) errs.githubUrl = 'Must be a valid URL';
        setFormErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const isValidUrl = (url: string): boolean => {
        try { new URL(url); return true; } catch { return false; }
    };

    const buildPayload = () => ({
        title: form.title.trim(),
        category: form.category,
        description: form.description.trim(),
        thumbnail: form.thumbnail || '/assets/projects/project-1.jpg',
        isVideo: form.isVideo,
        tech: form.tech.split(',').map(t => t.trim()).filter(Boolean),
        demoUrl: form.demoUrl ? form.demoUrl : null,
        githubUrl: form.githubUrl ? form.githubUrl : null,
        gallery: [form.thumbnail || '/assets/projects/project-1.jpg'],
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        setSubmitting(true);

        try {
            const isEdit = !!editingProject;
            const payload = isEdit ? { ...buildPayload(), id: editingProject!.id } : buildPayload();
            const method = isEdit ? 'PUT' : 'POST';

            const res = await fetch('/api/projects', {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-secret': adminSecret,
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.status === 401) {
                setAuthed(false);
                addToast('Session expired. Please log in again.', 'error');
                return;
            }

            if (!res.ok) {
                addToast(data.error || 'Operation failed', 'error');
                return;
            }

            addToast(isEdit ? 'Project updated successfully!' : 'Project added successfully!', 'success');
            setShowForm(false);
            fetchProjects();
        } catch {
            addToast('Network error. Please try again.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
        setDeletingId(id);

        try {
            const res = await fetch(`/api/projects?id=${id}`, {
                method: 'DELETE',
                headers: { 'x-admin-secret': adminSecret },
            });

            if (res.status === 401) {
                setAuthed(false);
                return;
            }
            if (res.ok) {
                setProjects(prev => prev.filter(p => p.id !== id));
                addToast(`"${title}" deleted`, 'success');
            } else {
                addToast('Delete failed', 'error');
            }
        } catch {
            addToast('Network error', 'error');
        } finally {
            setDeletingId(null);
        }
    };

    const copyJSON = () => {
        const payload = {
            id: `proj-${Date.now()}`,
            ...buildPayload(),
        };
        navigator.clipboard.writeText(JSON.stringify(payload, null, 4));
        addToast('JSON copied to clipboard!', 'success');
    };

    // ── Input styles ──────────────────────────────────────────────────────────

    const inputCls = (field: string) =>
        `w-full bg-[#0a0a0a] border rounded-lg px-4 py-2.5 text-white placeholder-[rgba(255,255,255,0.3)] focus:outline-none transition-colors duration-200 text-sm ${
            formErrors[field]
                ? 'border-red-500 focus:border-red-400'
                : 'border-[rgba(255,255,255,0.08)] focus:border-[#FF5A2A]'
        }`;

    const labelCls = 'block text-xs font-semibold text-[rgba(255,255,255,0.5)] uppercase tracking-wider mb-1.5';

    // ─────────────────────────────────────────────────────────────────────────
    // ── RENDER: Login Screen ──────────────────────────────────────────────────
    // ─────────────────────────────────────────────────────────────────────────

    if (!authed) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-sm"
                >
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0f0f0f] border border-[rgba(255,255,255,0.06)] mb-4">
                            <svg className="w-8 h-8 text-[#FF5A2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 className="font-[Poppins,sans-serif] font-bold text-2xl text-white mb-1">Admin Panel</h1>
                        <p className="text-[rgba(255,255,255,0.5)] text-sm">Noir Portfolio — Project Management</p>
                    </div>

                    <form onSubmit={handleLogin} className="bg-[#0b0b0b] border border-[rgba(255,255,255,0.04)] rounded-2xl p-8 shadow-2xl">
                        <div className="mb-4">
                            <label htmlFor="admin-password" className={labelCls}>Admin Secret</label>
                            <input
                                id="admin-password"
                                type="password"
                                value={password}
                                onChange={e => { setPassword(e.target.value); setAuthError(''); }}
                                className={`w-full bg-[#0a0a0a] border ${authError ? 'border-red-500' : 'border-[rgba(255,255,255,0.08)]'} rounded-lg px-4 py-3 text-white placeholder-[rgba(255,255,255,0.3)] focus:outline-none focus:border-[#FF5A2A] transition-colors`}
                                placeholder="Enter admin secret…"
                                autoComplete="current-password"
                                autoFocus
                            />
                            {authError && <p className="mt-1.5 text-xs text-red-400">{authError}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={!password}
                            className="w-full bg-[#FF5A2A] text-black font-semibold rounded-lg py-3 hover:shadow-[0_0_20px_rgba(255,90,42,0.3)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Enter Admin Panel
                        </button>

                        <p className="text-center text-xs text-[rgba(255,255,255,0.3)] mt-4">
                            Default secret: <code className="text-[#FF5A2A]">rohail-admin-2024</code><br />
                            Set <code className="text-[rgba(255,255,255,0.5)]">ADMIN_SECRET</code> in .env.local to change
                        </p>
                    </form>

                    <div className="text-center mt-4">
                        <Link href="/" className="text-[rgba(255,255,255,0.4)] text-sm hover:text-[#FF5A2A] transition-colors">
                            ← Back to Portfolio
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ── RENDER: Admin Dashboard ───────────────────────────────────────────────
    // ─────────────────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen bg-[#050505] text-white font-[Inter,sans-serif]">
            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none" role="status" aria-live="polite">
                <AnimatePresence>
                    {toasts.map(toast => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 40, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 40, scale: 0.9 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-sm font-medium border ${
                                toast.type === 'success'
                                    ? 'bg-green-900/80 border-green-700/50 text-green-300'
                                    : 'bg-red-900/80 border-red-700/50 text-red-300'
                            } backdrop-blur-sm`}
                        >
                            {toast.type === 'success' ? (
                                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            ) : (
                                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            )}
                            {toast.message}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Header */}
            <header className="border-b border-[rgba(255,255,255,0.04)] bg-[#0b0b0b] sticky top-0 z-50 backdrop-blur-md">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#FF5A2A] flex items-center justify-center text-black font-bold text-sm">A</div>
                        <div>
                            <p className="text-white font-semibold text-sm">Admin Panel</p>
                            <p className="text-[rgba(255,255,255,0.4)] text-xs">Noir Portfolio</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            className="text-[rgba(255,255,255,0.5)] hover:text-white text-sm transition-colors flex items-center gap-1.5"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            View Site
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="text-xs text-[rgba(255,255,255,0.4)] hover:text-red-400 transition-colors border border-[rgba(255,255,255,0.06)] rounded-lg px-3 py-1.5"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-6 py-8">
                {/* Stats Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Projects', value: projects.length },
                        { label: 'Categories', value: new Set(projects.map(p => p.category)).size },
                        { label: 'With GitHub', value: projects.filter(p => p.githubUrl).length },
                        { label: 'With Demo', value: projects.filter(p => p.demoUrl).length },
                    ].map(stat => (
                        <div key={stat.label} className="bg-[#0b0b0b] border border-[rgba(255,255,255,0.04)] rounded-xl p-4">
                            <p className="text-[rgba(255,255,255,0.4)] text-xs mb-1">{stat.label}</p>
                            <p className="text-white font-bold text-2xl font-[Poppins,sans-serif]">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Projects Section */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-white font-bold text-xl font-[Poppins,sans-serif]">Projects</h2>
                    <button
                        onClick={openAddForm}
                        id="admin-add-project-btn"
                        className="flex items-center gap-2 bg-[#FF5A2A] text-black font-semibold rounded-lg px-5 py-2.5 text-sm hover:shadow-[0_0_20px_rgba(255,90,42,0.3)] transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add Project
                    </button>
                </div>

                {!cloudinaryConfigured && (
                    <div className="mb-6 p-4 bg-amber-900/20 border border-amber-700/30 rounded-xl flex items-start gap-3">
                        <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
                        <div>
                            <p className="text-amber-300 text-sm font-medium">Cloudinary not configured</p>
                            <p className="text-amber-400/70 text-xs mt-0.5">Image uploads are disabled. Add <code className="text-amber-300">CLOUDINARY_*</code> env vars to enable. See <code>.env.local.example</code>.</p>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <svg className="animate-spin w-8 h-8 text-[#FF5A2A]" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                    </div>
                ) : (
                    <div className="grid gap-3">
                        <AnimatePresence>
                            {projects.map((project, i) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: deletingId === project.id ? 0.4 : 1, y: 0 }}
                                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    transition={{ delay: i * 0.04 }}
                                    className="bg-[#0b0b0b] border border-[rgba(255,255,255,0.04)] rounded-xl p-4 flex items-center gap-4 hover:border-[rgba(255,90,42,0.2)] transition-colors"
                                >
                                    {/* Thumbnail */}
                                    <div className="relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0">
                                        <Image
                                            src={project.thumbnail}
                                            alt={project.title}
                                            fill
                                            className="object-cover"
                                            sizes="80px"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <h3 className="text-white font-semibold text-sm truncate">{project.title}</h3>
                                            <span className="flex-shrink-0 text-[10px] font-bold text-[#FF5A2A] bg-[#FF5A2A]/10 border border-[#FF5A2A]/20 rounded px-1.5 py-0.5">
                                                {project.category}
                                            </span>
                                        </div>
                                        <p className="text-[rgba(255,255,255,0.4)] text-xs truncate">{project.description}</p>
                                        {project.tech.length > 0 && (
                                            <div className="flex gap-1 mt-1.5 flex-wrap">
                                                {project.tech.slice(0, 4).map(t => (
                                                    <span key={t} className="text-[10px] text-[rgba(255,255,255,0.4)] bg-[rgba(255,255,255,0.04)] rounded px-1.5 py-0.5 border border-[rgba(255,255,255,0.04)]">{t}</span>
                                                ))}
                                                {project.tech.length > 4 && (
                                                    <span className="text-[10px] text-[rgba(255,255,255,0.3)]">+{project.tech.length - 4}</span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Links */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        {project.githubUrl && (
                                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-[rgba(255,255,255,0.4)] hover:text-white transition-colors" aria-label="GitHub">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                                            </a>
                                        )}
                                        {project.demoUrl && (
                                            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="text-[rgba(255,255,255,0.4)] hover:text-[#FF5A2A] transition-colors" aria-label="Live demo">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                            </a>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => openEditForm(project)}
                                            className="text-xs text-[rgba(255,255,255,0.5)] hover:text-white border border-[rgba(255,255,255,0.06)] rounded-lg px-3 py-1.5 hover:border-[rgba(255,255,255,0.2)] transition-all"
                                            aria-label={`Edit ${project.title}`}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(project.id, project.title)}
                                            disabled={deletingId === project.id}
                                            className="text-xs text-red-400/70 hover:text-red-400 border border-[rgba(255,255,255,0.06)] hover:border-red-500/30 rounded-lg px-3 py-1.5 transition-all disabled:opacity-40"
                                            aria-label={`Delete ${project.title}`}
                                        >
                                            {deletingId === project.id ? '…' : 'Delete'}
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {projects.length === 0 && !loading && (
                            <div className="text-center py-16 text-[rgba(255,255,255,0.3)]">
                                <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                <p className="text-sm">No projects yet. Add your first one!</p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* ── Add/Edit Form Drawer ─────────────────────────────────────────────── */}
            <AnimatePresence>
                {showForm && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !submitting && setShowForm(false)}
                            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ opacity: 0, x: '100%' }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: '100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="fixed right-0 top-0 h-full w-full max-w-xl bg-[#0d0d0d] border-l border-[rgba(255,255,255,0.06)] z-[60] overflow-y-auto"
                        >
                            <div className="p-6">
                                {/* Drawer Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <p className="text-[#FF5A2A] text-xs font-semibold tracking-widest uppercase mb-0.5">
                                            {editingProject ? 'Editing' : 'New Project'}
                                        </p>
                                        <h2 className="text-white font-bold text-xl font-[Poppins,sans-serif]">
                                            {editingProject ? editingProject.title : 'Add Project'}
                                        </h2>
                                    </div>
                                    <button
                                        onClick={() => !submitting && setShowForm(false)}
                                        className="w-9 h-9 rounded-xl border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[rgba(255,255,255,0.5)] hover:text-white transition-colors"
                                        aria-label="Close form"
                                    >
                                        ×
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Title */}
                                    <div>
                                        <label className={labelCls}>Title <span className="text-[#FF5A2A]">*</span></label>
                                        <input
                                            id="form-title"
                                            type="text"
                                            value={form.title}
                                            onChange={e => { setForm(f => ({ ...f, title: e.target.value })); setFormErrors(p => ({ ...p, title: '' })); }}
                                            className={inputCls('title')}
                                            placeholder="My Awesome Project"
                                        />
                                        {formErrors.title && <p className="mt-1 text-xs text-red-400">{formErrors.title}</p>}
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <label className={labelCls}>Category <span className="text-[#FF5A2A]">*</span></label>
                                        <select
                                            id="form-category"
                                            value={form.category}
                                            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                            className={inputCls('category')}
                                        >
                                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className={labelCls}>Description <span className="text-[#FF5A2A]">*</span></label>
                                        <textarea
                                            id="form-description"
                                            rows={4}
                                            value={form.description}
                                            onChange={e => { setForm(f => ({ ...f, description: e.target.value })); setFormErrors(p => ({ ...p, description: '' })); }}
                                            className={`${inputCls('description')} resize-none`}
                                            placeholder="Describe the project, what problem it solves, your role…"
                                        />
                                        {formErrors.description && <p className="mt-1 text-xs text-red-400">{formErrors.description}</p>}
                                    </div>

                                    {/* Image Upload */}
                                    <div>
                                        <label className={labelCls}>Thumbnail Image</label>

                                        {/* Drop Zone */}
                                        <div
                                            onDrop={handleDrop}
                                            onDragOver={e => e.preventDefault()}
                                            onClick={() => fileInputRef.current?.click()}
                                            className="relative border-2 border-dashed border-[rgba(255,255,255,0.08)] hover:border-[#FF5A2A]/50 rounded-xl p-6 cursor-pointer transition-colors text-center group"
                                        >
                                            {previewUrl ? (
                                                <div className="relative w-full h-36 rounded-lg overflow-hidden">
                                                    <Image src={previewUrl} alt="Preview" fill className="object-cover" sizes="400px" />
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <p className="text-white text-sm font-medium">Click to replace</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="py-4">
                                                    <svg className="w-10 h-10 mx-auto text-[rgba(255,255,255,0.2)] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                    <p className="text-[rgba(255,255,255,0.4)] text-sm">Drop image here or click to upload</p>
                                                    <p className="text-[rgba(255,255,255,0.2)] text-xs mt-1">PNG, JPG, WebP — max 5MB</p>
                                                </div>
                                            )}
                                            {uploading && (
                                                <div className="absolute inset-0 bg-black/60 rounded-xl flex flex-col items-center justify-center gap-2">
                                                    <svg className="animate-spin w-6 h-6 text-[#FF5A2A]" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
                                                    <div className="w-32 h-1 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
                                                        <motion.div className="h-full bg-[#FF5A2A] rounded-full" animate={{ width: `${uploadProgress}%` }} />
                                                    </div>
                                                    <p className="text-white text-xs">Uploading…</p>
                                                </div>
                                            )}
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={e => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }}
                                        />

                                        {/* Manual URL fallback */}
                                        <div className="mt-2">
                                            <label className="block text-[10px] font-medium text-[rgba(255,255,255,0.3)] mb-1">Or paste image URL</label>
                                            <input
                                                type="text"
                                                value={form.thumbnail}
                                                onChange={e => { setForm(f => ({ ...f, thumbnail: e.target.value })); setPreviewUrl(e.target.value); }}
                                                className={`${inputCls('thumbnail')} text-xs`}
                                                placeholder="https://res.cloudinary.com/…"
                                            />
                                        </div>
                                    </div>

                                    {/* Tech Stack */}
                                    <div>
                                        <label className={labelCls}>Tech Stack (comma-separated)</label>
                                        <input
                                            id="form-tech"
                                            type="text"
                                            value={form.tech}
                                            onChange={e => setForm(f => ({ ...f, tech: e.target.value }))}
                                            className={inputCls('tech')}
                                            placeholder="React, Node.js, PostgreSQL, Docker"
                                        />
                                    </div>

                                    {/* URLs */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className={labelCls}>Live Demo URL</label>
                                            <input
                                                id="form-demo"
                                                type="url"
                                                value={form.demoUrl}
                                                onChange={e => { setForm(f => ({ ...f, demoUrl: e.target.value })); setFormErrors(p => ({ ...p, demoUrl: '' })); }}
                                                className={inputCls('demoUrl')}
                                                placeholder="https://…"
                                            />
                                            {formErrors.demoUrl && <p className="mt-1 text-xs text-red-400">{formErrors.demoUrl}</p>}
                                        </div>
                                        <div>
                                            <label className={labelCls}>GitHub URL</label>
                                            <input
                                                id="form-github"
                                                type="url"
                                                value={form.githubUrl}
                                                onChange={e => { setForm(f => ({ ...f, githubUrl: e.target.value })); setFormErrors(p => ({ ...p, githubUrl: '' })); }}
                                                className={inputCls('githubUrl')}
                                                placeholder="https://github.com/…"
                                            />
                                            {formErrors.githubUrl && <p className="mt-1 text-xs text-red-400">{formErrors.githubUrl}</p>}
                                        </div>
                                    </div>

                                    {/* Is Video toggle */}
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <button
                                            type="button"
                                            role="switch"
                                            aria-checked={form.isVideo}
                                            onClick={() => setForm(f => ({ ...f, isVideo: !f.isVideo }))}
                                            className={`relative w-10 h-6 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A2A] ${form.isVideo ? 'bg-[#FF5A2A]' : 'bg-[rgba(255,255,255,0.1)]'}`}
                                        >
                                            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${form.isVideo ? 'translate-x-4' : ''}`} />
                                        </button>
                                        <span className="text-sm text-[rgba(255,255,255,0.6)]">This project is a video</span>
                                    </label>

                                    {/* Actions */}
                                    <div className="flex gap-3 pt-2">
                                        <button
                                            type="submit"
                                            disabled={submitting || uploading}
                                            id="form-submit-btn"
                                            className="flex-1 bg-[#FF5A2A] text-black font-semibold rounded-lg py-3 hover:shadow-[0_0_20px_rgba(255,90,42,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {submitting ? (
                                                <>
                                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
                                                    Saving…
                                                </>
                                            ) : editingProject ? 'Save Changes' : 'Add Project'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={copyJSON}
                                            title="Copy JSON to clipboard (fallback)"
                                            className="px-4 py-3 border border-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.5)] hover:text-white hover:border-[rgba(255,255,255,0.2)] rounded-lg text-sm transition-all flex items-center gap-1.5"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                                            JSON
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => !submitting && setShowForm(false)}
                                            disabled={submitting}
                                            className="px-4 py-3 border border-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.5)] hover:text-white hover:border-[rgba(255,255,255,0.2)] rounded-lg text-sm transition-all"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
