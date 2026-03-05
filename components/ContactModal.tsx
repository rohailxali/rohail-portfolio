'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import personalData from '@/data/personal.json';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        subject: 'Project Inquiry',
        message: '',
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formState),
            });

            if (response.ok) {
                setStatus('success');
                setFormState({ name: '', email: '', subject: 'Project Inquiry', message: '' });
                setTimeout(() => {
                    setStatus('idle');
                    onClose();
                }, 2000);
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
            console.error('Contact form error:', error);
        }
    };

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
                            <Dialog.Panel className="w-full max-w-md transform rounded-2xl glass-panel p-8 shadow-xl transition-all">
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 text-noir-muted hover:text-accent-orange text-2xl"
                                    aria-label="Close contact form"
                                >
                                    ×
                                </button>

                                <Dialog.Title className="font-heading font-bold text-2xl text-white mb-6">
                                    Get In Touch
                                </Dialog.Title>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-noir-muted mb-1">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            required
                                            value={formState.name}
                                            onChange={e => setFormState({ ...formState, name: e.target.value })}
                                            className="w-full bg-noir-card border border-noir-border rounded-lg px-4 py-3 text-white focus:border-accent-orange focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-noir-muted mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            required
                                            value={formState.email}
                                            onChange={e => setFormState({ ...formState, email: e.target.value })}
                                            className="w-full bg-noir-card border border-noir-border rounded-lg px-4 py-3 text-white focus:border-accent-orange focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium text-noir-muted mb-1">
                                            Subject
                                        </label>
                                        <input
                                            type="text"
                                            id="subject"
                                            required
                                            value={formState.subject}
                                            onChange={e => setFormState({ ...formState, subject: e.target.value })}
                                            className="w-full bg-noir-card border border-noir-border rounded-lg px-4 py-3 text-white focus:border-accent-orange focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-noir-muted mb-1">
                                            Message
                                        </label>
                                        <textarea
                                            id="message"
                                            required
                                            rows={4}
                                            value={formState.message}
                                            onChange={e => setFormState({ ...formState, message: e.target.value })}
                                            className="w-full bg-noir-card border border-noir-border rounded-lg px-4 py-3 text-white focus:border-accent-orange focus:outline-none resize-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        className="w-full bg-accent-orange text-black font-semibold rounded-lg px-6 py-3 hover:shadow-glow-orange transition-all disabled:opacity-50"
                                    >
                                        {status === 'loading' ? 'Sending...' : 'Send Message'}
                                    </button>

                                    {status === 'success' && (
                                        <p className="text-green-500 text-sm text-center">Message sent successfully!</p>
                                    )}
                                    {status === 'error' && (
                                        <p className="text-red-500 text-sm text-center">Failed to send. Please try again.</p>
                                    )}
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
