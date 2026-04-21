'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import personalData from '@/data/personal.json';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Client-side validation schema
const contactSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    subject: z.string().min(3, 'Subject must be at least 3 characters'),
    message: z.string().min(20, 'Message must be at least 20 characters'),
});

type FormErrors = Partial<Record<keyof z.infer<typeof contactSchema>, string>>;

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        subject: 'Project Inquiry',
        message: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const validate = (): boolean => {
        const result = contactSchema.safeParse(formState);
        if (!result.success) {
            const fieldErrors: FormErrors = {};
            result.error.errors.forEach(err => {
                const field = err.path[0] as keyof FormErrors;
                if (!fieldErrors[field]) fieldErrors[field] = err.message;
            });
            setErrors(fieldErrors);
            return false;
        }
        setErrors({});
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setStatus('loading');
        setErrorMessage('');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formState),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setFormState({ name: '', email: '', subject: 'Project Inquiry', message: '' });
                setTimeout(() => {
                    setStatus('idle');
                    onClose();
                }, 2500);
            } else {
                setStatus('error');
                setErrorMessage(data.error || 'Failed to send message. Please try again.');
            }
        } catch {
            setStatus('error');
            setErrorMessage('Network error. Please check your connection and try again.');
        }
    };

    const inputClass = (field: keyof FormErrors) =>
        `w-full bg-noir-card border rounded-lg px-4 py-3 text-white focus:outline-none transition-colors duration-200 ${
            errors[field]
                ? 'border-red-500 focus:border-red-400'
                : 'border-noir-border focus:border-accent-orange'
        }`;

    const handleClose = () => {
        if (status === 'loading') return;
        setErrors({});
        setStatus('idle');
        setErrorMessage('');
        onClose();
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={handleClose}>
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
                            <Dialog.Panel className="w-full max-w-md transform rounded-2xl glass-panel p-8 shadow-xl transition-all relative">
                                <button
                                    onClick={handleClose}
                                    className="absolute top-4 right-4 text-noir-muted hover:text-accent-orange text-2xl leading-none transition-colors"
                                    aria-label="Close contact form"
                                    disabled={status === 'loading'}
                                >
                                    ×
                                </button>

                                <Dialog.Title className="font-heading font-bold text-2xl text-white mb-2">
                                    Get In Touch
                                </Dialog.Title>
                                <p className="text-noir-muted text-sm mb-6">
                                    I&apos;ll get back to you at{' '}
                                    <a href={`mailto:${personalData.emailFull}`} className="text-accent-orange hover:underline">
                                        {personalData.email}
                                    </a>
                                </p>

                                {/* Aria live region for screen readers */}
                                <div aria-live="polite" aria-atomic="true" className="sr-only">
                                    {status === 'success' && 'Message sent successfully!'}
                                    {status === 'error' && errorMessage}
                                </div>

                                {status === 'success' ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col items-center justify-center py-12 text-center"
                                    >
                                        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                                            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <h3 className="text-white font-semibold text-lg mb-2">Message Sent!</h3>
                                        <p className="text-noir-muted text-sm">Thanks for reaching out. I&apos;ll be in touch soon.</p>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                                        <div>
                                            <label htmlFor="contact-name" className="block text-sm font-medium text-noir-muted mb-1">
                                                Name <span className="text-accent-orange">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="contact-name"
                                                required
                                                value={formState.name}
                                                onChange={e => {
                                                    setFormState({ ...formState, name: e.target.value });
                                                    if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                                                }}
                                                className={inputClass('name')}
                                                placeholder="Your full name"
                                                autoComplete="name"
                                            />
                                            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="contact-email" className="block text-sm font-medium text-noir-muted mb-1">
                                                Email <span className="text-accent-orange">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                id="contact-email"
                                                required
                                                value={formState.email}
                                                onChange={e => {
                                                    setFormState({ ...formState, email: e.target.value });
                                                    if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                                                }}
                                                className={inputClass('email')}
                                                placeholder="you@example.com"
                                                autoComplete="email"
                                            />
                                            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="contact-subject" className="block text-sm font-medium text-noir-muted mb-1">
                                                Subject <span className="text-accent-orange">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="contact-subject"
                                                required
                                                value={formState.subject}
                                                onChange={e => {
                                                    setFormState({ ...formState, subject: e.target.value });
                                                    if (errors.subject) setErrors(prev => ({ ...prev, subject: undefined }));
                                                }}
                                                className={inputClass('subject')}
                                                placeholder="Project Inquiry"
                                            />
                                            {errors.subject && <p className="mt-1 text-xs text-red-400">{errors.subject}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="contact-message" className="block text-sm font-medium text-noir-muted mb-1">
                                                Message <span className="text-accent-orange">*</span>
                                            </label>
                                            <textarea
                                                id="contact-message"
                                                required
                                                rows={4}
                                                value={formState.message}
                                                onChange={e => {
                                                    setFormState({ ...formState, message: e.target.value });
                                                    if (errors.message) setErrors(prev => ({ ...prev, message: undefined }));
                                                }}
                                                className={`${inputClass('message')} resize-none`}
                                                placeholder="Tell me about your project…"
                                            />
                                            {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
                                            <p className="mt-1 text-xs text-noir-muted text-right">{formState.message.length}/20 min</p>
                                        </div>

                                        {status === 'error' && (
                                            <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                                <svg className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                <p className="text-red-400 text-sm">{errorMessage}</p>
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={status === 'loading'}
                                            id="contact-submit-btn"
                                            className="w-full bg-accent-orange text-black font-semibold rounded-lg px-6 py-3 hover:shadow-glow-orange transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {status === 'loading' ? (
                                                <>
                                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                                    </svg>
                                                    Sending…
                                                </>
                                            ) : 'Send Message'}
                                        </button>
                                    </form>
                                )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
